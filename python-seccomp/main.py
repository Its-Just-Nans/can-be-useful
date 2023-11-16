""" run with strace python main.py """
from seccomp import SyscallFilter, KILL, ALLOW  # apt install python3-seccomp

# by default we kill all
filt = SyscallFilter(defaction=KILL)
filt.add_rule(ALLOW, "openat")
filt.add_rule(ALLOW, "fstat")
filt.add_rule(ALLOW, "ioctl")
filt.add_rule(ALLOW, "lseek")
filt.add_rule(ALLOW, "fcntl")
filt.add_rule(ALLOW, "write")
filt.add_rule(ALLOW, "read")
filt.add_rule(ALLOW, "close")
filt.add_rule(ALLOW, "rt_sigaction")
filt.add_rule(ALLOW, "sigaltstack")
filt.add_rule(ALLOW, "exit_group")
filt.load()

f = open("/etc/passwd", encoding="utf-8")
for line in f:
    elts = line.split(":")
    print(elts[0])
