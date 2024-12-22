import sys


class Bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


if len(sys.argv) > 1:
    total = int(sys.argv[1])
else:
    total = 29
primes = []
with open('export.txt') as file:
    lines = file.readlines()
    for one_line in lines:
        line = one_line.split("\t")
        for one_number in line:
            primes.append(int(one_number))

COUNT = 0
for i in range(1, 5000):
    if i in primes:
        # print(f"{bcolors.UNDERLINE}{i}{bcolors.ENDC}")
        print('\x1b[6;30;42m' + str(i) + '\x1b[0m' + '\t', end="")
    else:
        print(str(i) + '\t', end="")
    if COUNT == total:
        COUNT = 0
        print()
    else:
        COUNT = COUNT + 1
print()
