argent = 0
argent = int(input("Saisissez la somme voulue : \n"))
nbBillet500 = 0
nbBillet200 = 0
nbBillet100 = 0
nbBillet50 = 0
nbBillet20 = 0
nbBillet10 = 0
distribBillet = 1
if argent < 10 or argent % 2 != 0:
    print("Je ne peux pas vous distribuez cette somme")
    distribBillet = 0
while argent > 0:
    if argent >= 500:
        argent = argent - 500
        nbBillet500 = nbBillet500 + 1
    else:
        if argent >= 200:
            argent = argent - 200
            nbBillet200 = nbBillet200 + 1
        else:
            if argent >= 100:
                argent = argent - 100
                nbBillet100 = nbBillet100 + 1
            else:
                if argent >= 50:
                    argent = argent - 50
                    nbBillet50 = nbBillet50 + 1
                else:
                    if argent >= 20:
                        argent = argent - 20
                        nbBillet20 = nbBillet20 + 1
                    else:
                        if argent >= 10:
                            argent = argent - 10
                            nbBillet10 = nbBillet10 + 1
                        else:
                            argent = argent - 10
                            print("Je ne peux pas vous distribuez cette somme")
                            distribBillet = 0
if distribBillet == 1:
    print("Nombre de billets de 500 :", nbBillet500)
    print("Nombre de billets de 200 :", nbBillet200)
    print("Nombre de billets de 100 :", nbBillet100)
    print("Nombre de billets de 50  :", nbBillet50)
    print("Nombre de billets de 20  :", nbBillet20)
    print("Nombre de billets de 10  :", nbBillet10)
