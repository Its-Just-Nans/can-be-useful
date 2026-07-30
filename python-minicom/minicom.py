#!/bin/env python3
# common usage
#
# ```
# minicom.py login && minicom -c on
# ```
#

from sys import argv, exit
from time import sleep
from os import getenv
from os.path import dirname, realpath, join, exists

try:
    from dotenv import load_dotenv
except ImportError:
    print("Module dotenv not found")
    print("python -m pip install dotenv --break-system-packages")
    exit(1)

DIR_SCRIPT = dirname(realpath(__file__))
ENV_PATH = join(DIR_SCRIPT, ".env")

if not exists(ENV_PATH):
    print(f"Cannot find .env at {ENV_PATH}")
    exit(1)
load_dotenv(ENV_PATH)


try:
    import serial
    # python3 -m pip install pyserial --break-system-packages
except ImportError:
    print("Module pyserial not found")
    print("python -m pip install pyserial --break-system-packages")
    exit(1)


def fill_boxes():
    BOXES = []
    models = getenv("BOXES_MODEL")
    if models is None:
        print("Error with BOXES_MODEL ENV variable")
        return BOXES
    for model_name in models.split(","):
        model_data = getenv(f"MODEL_{model_name}")
        if model_data is None:
            print(f"Error with {model_name} ENV variable")
        else:
            for one_serial in model_data.split(","):
                BOXES.append((model_name, one_serial))
    return BOXES


def main(callback):
    device = None
    command = None
    port = "/dev/ttyUSB0"
    if not exists(port):
        print(f"{port} does not exists")
        print("Is the serial connected ?")
        print("Is the box electrically connected ?")
        return 1
    with serial.Serial(
        port, 115200, timeout=0.1, parity=serial.PARITY_EVEN, rtscts=1
    ) as ser:
        while True:
            try:
                lines = ser.readline()
                lines = [lines]
                # print(f"## Received {len(lines)} lines")
                for line in lines:
                    line = line.decode()
                    if line.startswith("\r"):
                        line = line[1:]
                    if command is not None:
                        if line == command + "\r\n":
                            command = None
                            continue
                        if line == "\n":
                            continue
                    print(line, end="")
                    if "login:" in line:
                        ser.write(b"root")
                        ser.write(b"\n")
                        sleep(0.01)
                        device = line[0 : line.find(" ")]
                        print(f"## Autologin: Trying to login on {device}")
                        found = False
                        for devic, seri in BOXES:
                            if device == devic:
                                ser.reset_input_buffer()
                                ser.write(seri.encode())
                                ser.write(b"\n")
                                found = True
                        if not found:
                            print("## Autologin: No device found")
                            return 1
                    elif line.startswith("root@") and device is None:
                        device = line[5:12]
                        print(f"## Device is {device}")
                        ser.reset_input_buffer()
                        ser.write(b"\n")
                    elif f"root@{device}" in line:
                        command = callback()
                        if command is None:
                            print("## Soft exited")
                            return
                        full_cmd = command + "\n"
                        ser.reset_input_buffer()
                        ser.write(full_cmd.encode())
                        if command == "exit":
                            print("## Command exited")
                            return
                if len(lines) == 1 and lines[0] == b"":
                    ser.write(b"\n")
                sleep(0.01)
            except KeyboardInterrupt:
                print()
                break
            except Exception as e:
                print(f"## Exception: {e}")
                if not exists(port):
                    print(f"{port} does not exists anymore")
                    break
                pass
    return 1


def my_exit(tmp_=""):
    print()
    exit()


def run_cmd_callback(cmd):
    # mutable count to have access in the callback
    count = [0]

    def run_cmd():
        to_return = None
        if count[0] == 0:
            to_return = cmd
        count[0] = count[0] + 1
        return to_return

    return run_cmd


if __name__ == "__main__":
    BOXES = fill_boxes()
    callback = input
    if len(argv) > 1:
        if argv[1] == "login":
            callback = my_exit
        if argv[1] == "run":
            callback = run_cmd_callback(argv[2])
    code = main(callback)
    exit(code)
