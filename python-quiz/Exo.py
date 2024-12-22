import random

def merge(x, y):
	z = y.copy()
	z.update(x)
	return z


def poseQuestion(index) :
	print('------------')
	print(index + '.' + questions[index])
	for z in reponse[index]:
		print(z[0]+'.'+z[2])

def waitReponse(index):
	var = ''
	reponse = input()

nameFiles = input('Saisir le fichier\n')

files = open(nameFiles, 'r')
randomChoice = ''
while randomChoice != 'yes' or randomChoice != 'no':
	value = input('RandomChoice ?\n')
	if  value == 'yes':
		randomChoice = True
		break
	elif value == 'no':
		randomChoice = False
		break
	else :
		continue

questions = {}
reponse = {}
filesLine = [x.strip() for x in files]
for i in filesLine :
	lineSplited = i.split('.')
	if len(lineSplited) == 2 :
		questions[lineSplited[0]] = lineSplited[1]
	elif len(lineSplited) == 4 :
		try:
			reponse[lineSplited[0]]
		except KeyError:
			reponse[lineSplited[0]] = []
			reponse[lineSplited[0]].append([ lineSplited[1], lineSplited[2], lineSplited[3] ])
		else:
			#reponse[lineSplited[0]] = merge({lineSplited[1]:[ lineSplited[2], lineSplited[3]] },  reponse[lineSplited[0]])
			#reponse[lineSplited[0]].update({lineSplited[1]:[ lineSplited[2], lineSplited[3]] })
			#reponse[lineSplited[0]] += [ **reponse[lineSplited[0]] + [ lineSplited[1], lineSplited[2], lineSplited[3] ] ]
			reponse[lineSplited[0]].append([ lineSplited[1], lineSplited[2], lineSplited[3] ])
userReponse = []
for z in questions:
	if (randomChoice == True) :
		tempIndex, tempQuestion = random.choice(list(questions.items()))
		poseQuestion(tempIndex)
		userReponse = reponse + input()
	else :
		poseQuestion(z)
		userReponse += input()

files.close()
input('Saisir valeur pour quitter\n')
