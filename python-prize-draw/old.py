import random

fiche = open("fakeFile.txt", "r")
content = fiche.read()
fiche.close()
k1 = content.split()
Liste_verif1 = [i for i in k1]

for k in k1:
    if k == '-':
        k1.remove(k)
    if k == 'De':
        k1.remove(k)
    if k == 'Porc':
        k1.remove(k)

Liste_verif2 = [i for i in k1]

L = []

Nom = ''
while len(k1) > 0:
    if k1[0] != '10' and k1[0] != '1' and k1[0] != '2' and k1[0] != '5':
        if Nom == '':
            Nom = k1[0]
        else:
            Nom = Nom+' '+k1[0]
            L.append(Nom)
        k1.remove(k1[0])
    else:
        L.append(int(k1[0]))
        k1.remove(k1[0])
        Nom = ''

Liste_verif3 = [i for i in L]

L_nom = []
L_occ = []
while len(L) > 0:
    if L[0] == 1 or L[0] == 2 or L[0] == 5 or L[0] == 10:
        L_occ.append(L[0])
    else:
        L_nom.append(L[0])
    L.remove(L[0])

L_tirage = []
for k in range(len(L_nom)):
    for i in range(L_occ[k]):
        L_tirage.append(L_nom[k])

L_gagnants = []

P1 = random.choice(L_tirage)
L_gagnants.append(P1)
print('1 '+P1)

P2 = random.choice(L_tirage)
while P2 in L_gagnants:
    P2 = random.choice(L_tirage)
print('2 '+P2)
L_gagnants.append(P2)

P3 = random.choice(L_tirage)
while P3 in L_gagnants:
    P3 = random.choice(L_tirage)
print('3 '+P3)
L_gagnants.append(P3)
PP1 = random.choice(L_tirage)
while PP1 in L_gagnants:
    PP1 = random.choice(L_tirage)
print('4 '+PP1)
L_gagnants.append(PP1)
PP2 = random.choice(L_tirage)
while PP2 in L_gagnants:
    PP2 = random.choice(L_tirage)
print('5 '+PP2)
L_gagnants.append(PP2)
PV1 = random.choice(L_tirage)
while PV1 in L_gagnants:
    PV1 = random.choice(L_tirage)
print('6 '+PV1)
L_gagnants.append(PV1)
PV2 = random.choice(L_tirage)
while PV2 in L_gagnants:
    PV2 = random.choice(L_tirage)
print('6 '+PV2)
L_gagnants.append(PV2)
PV3 = random.choice(L_tirage)
while PV3 in L_gagnants:
    PV3 = random.choice(L_tirage)
print('7 '+PV3)
L_gagnants.append(PV3)
PV4 = random.choice(L_tirage)
while PV4 in L_gagnants:
    PV4 = random.choice(L_tirage)
print('8 '+PV4)
L_gagnants.append(PV4)
PC1 = random.choice(L_tirage)
while PC1 in L_gagnants:
    PC1 = random.choice(L_tirage)
print('9 '+PC1)
L_gagnants.append(PC1)
PC2 = random.choice(L_tirage)
while PC2 in L_gagnants:
    PC2 = random.choice(L_tirage)
print('10 '+PC2)
L_gagnants.append(PC2)
PC3 = random.choice(L_tirage)
while PC3 in L_gagnants:
    PC3 = random.choice(L_tirage)
print('11 '+PC3)
L_gagnants.append(PC3)
