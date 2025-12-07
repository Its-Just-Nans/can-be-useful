nb_instructions = int(input())

instructions = [input() for _ in range(nb_instructions)]

# instructions = [
#     "abc123", "acb123"
# ]

end = []

for one in instructions:
    last_char = None
    last_num = None
    breaked = False
    for one_char in one:
        if one_char.isnumeric():
            if last_num == None:
                last_num = one_char
                continue
            elif one_char == str(int(last_num)+1):
                last_num = one_char
                continue
            else:
                breaked = True
        else:
            if last_char == None:
                last_char = one_char
                continue
            if one_char > last_char:
                last_char = one_char
                continue
            else:
                breaked = True
    if not breaked:
        end.append(one)
toto = list(set(end))
print("_".join(end))
