import random

fiche = open("fakeFile.txt", "r")
all_lines = fiche.readlines()
fiche.close()

all_participants = []

index = 0
for oneLine in all_lines:
    number_tickets = oneLine.split()[-1]
    name = oneLine.split()[:-1]
    full_name = " ".join(name)
    number_in_number_type = int(number_tickets)
    for count in range(number_in_number_type):
        all_participants.append('{} ({})'.format(full_name, index))
    index = index + 1


print(all_participants)

list_lots = ['1', '2', '3', "4", "5", "6"] # change with prize name
gagants = []

for lot in list_lots:
    selected = random.choice(all_participants)
    while selected in gagants:
        selected = random.choice(all_participants)
    print(lot + "=" + selected)
    gagants.append(selected)


print(gagants)
