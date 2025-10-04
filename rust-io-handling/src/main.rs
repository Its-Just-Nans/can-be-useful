use std::io::{self, BufRead, BufReader};
use std::process::{Command, Stdio};
use std::thread;

fn main() -> io::Result<()> {
    let mut child = Command::new("./test.sh") // replace with your command
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?; // spawn the process

    // Handle stdout in a separate thread
    let stdout = child.stdout.take().expect("Failed to capture stdout");
    let stdout_thread = thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            match line {
                Ok(l) => println!("stdout: {}", l),
                Err(e) => eprintln!("Error reading stdout: {}", e),
            }
        }
    });

    // Handle stderr in another thread
    let stderr = child.stderr.take().expect("Failed to capture stderr");
    let stderr_thread = thread::spawn(move || {
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            match line {
                Ok(l) => eprintln!("stderr: {}", l),
                Err(e) => eprintln!("Error reading stderr: {}", e),
            }
        }
    });

    // Wait for the process to finish
    let status = child.wait()?;

    // Wait for threads to finish
    stdout_thread.join().unwrap();
    stderr_thread.join().unwrap();

    println!("Process exited with: {}", status);
    Ok(())
}
