width = int(input())
nb_instructions = int(input())

instructions = [input() for _ in range(nb_instructions)]

final = []

for a in instructions:
    if a == "backspace":
        if len(final) > 0:
            final.pop()
    else:
        final.append(a)

chars = "".join(final)

count = 0
for one_char in chars:
    print(one_char, end="")
    count = count + 1
    if count == width:
        count = 0
        print("")
    else:
        continue
