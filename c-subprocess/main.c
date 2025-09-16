#define _GNU_SOURCE
#include <errno.h>
#include <linux/memfd.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <sys/ptrace.h>
#include <sys/wait.h>
#include <unistd.h>

int main() {
  int fd = memfd_create("out", MFD_CLOEXEC);
  if (fd == -1) {
    perror("memfd_create");
    return 1;
  }
  int fderr = memfd_create("err", MFD_CLOEXEC);
  if (fderr == -1) {
    perror("memfd_create");
    return 1;
  }
  pid_t child = fork();
  if (child == 0) {
    dup2(fd, STDOUT_FILENO);    // Redirect stdout to memfd
    dup2(fderr, STDERR_FILENO); // Redirect stderr to memfd
    close(fd);
    close(fderr);
    printf(">>> Inside the child process. PID: %d\n", getpid());
    fflush(stdout);
    fflush(stderr);
    ptrace(PTRACE_TRACEME, 0, NULL, NULL);
    // Execute the command
    execl("/usr/bin/make", "make", NULL);
    perror(">>> execl failed");
    exit(1);
  } else {
    int status;
    pid_t pid;

    printf("Parent PID: %d, Child PID: %d\n", getpid(), child);

    // Wait for initial stop due to PTRACE_TRACEME
    pid = waitpid(child, &status, 0);
    if (pid < 0) {
      perror("waitpid failed");
      return 1;
    }

    // Set ptrace options
    ptrace(PTRACE_SETOPTIONS, child, 0,
           PTRACE_O_TRACEFORK | PTRACE_O_TRACECLONE | PTRACE_O_TRACEVFORK |
               PTRACE_O_TRACEEXEC);

    // Resume the child
    ptrace(PTRACE_CONT, child, NULL, NULL);

    while (1) {
      pid = waitpid(-1, &status, __WALL);
      if (pid == -1) {
        if (errno == ECHILD)
          break; // no more children
        perror("waitpid");
        break;
      }

      printf("Stopped process PID: %d, Status: 0x%x\n", pid, status);

      if (WIFEXITED(status)) {
        printf("Process %d exited normally with status %d\n", pid,
               WEXITSTATUS(status));
        if (pid == child)
          break;
      } else if (WIFSIGNALED(status)) {
        printf("Process %d terminated by signal %d\n", pid, WTERMSIG(status));
        if (pid == child)
          break;
      } else if (WIFSTOPPED(status)) {
        int event = status >> 16;
        if (event == PTRACE_EVENT_FORK || event == PTRACE_EVENT_VFORK ||
            event == PTRACE_EVENT_CLONE) {
          long new_pid;
          ptrace(PTRACE_GETEVENTMSG, pid, NULL, &new_pid);
          printf("New subprocess created. PID: %ld\n", new_pid);
        } else if (event == PTRACE_EVENT_EXEC) {
          printf("Exec detected in process %d\n", pid);

          // Read cmdline after exec
          char path[256];
          snprintf(path, sizeof(path), "/proc/%d/cmdline", pid);
          FILE *fp = fopen(path, "r");
          if (fp) {
            char cmdline[4096];
            size_t len = fread(cmdline, 1, sizeof(cmdline) - 1, fp);
            fclose(fp);
            if (len > 0) {
              cmdline[len] = '\0';
              printf("Cmdline after exec: ");
              for (size_t i = 0; i < len; ++i)
                putchar(cmdline[i] == '\0' ? ' ' : cmdline[i]);
              putchar('\n');
            } else {
              perror("fread failed (cmdline)");
            }
          } else {
            perror("fopen failed (cmdline)");
          }
        }
        ptrace(PTRACE_CONT, pid, NULL, NULL);
      }
    }
    printf(">>> Child process has exited. PID: %d\n", child);
    // print error and output from memfd
    char buffer[256];
    ssize_t bytes_read;
    off_t size = lseek(fd, 0, SEEK_SET); // Reset file offset to the beginning

    printf("--------------------------- Child stdout\n");
    while ((bytes_read = read(fd, buffer, sizeof(buffer) - 1)) > 0) {
      buffer[bytes_read] = '\0'; // Null-terminate the string
      printf("%s", buffer);
    }
    printf("--------------------------- Child stderr\n");
    lseek(fderr, 0, SEEK_SET); // Reset file offset to the beginning
    while ((bytes_read = read(fderr, buffer, sizeof(buffer) - 1)) > 0) {
      buffer[bytes_read] = '\0'; // Null-terminate the string
      printf("%s", buffer);
    }
    printf(">>> Parent process has finished.\n");
  }

  return 0;
}
