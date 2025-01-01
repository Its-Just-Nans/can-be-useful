# keyboard

## Informations

Use putty to listen the `UART` communication

```sh
putty /dev/ttyUSB0 -serial -sercfg 9600,8,n,1,N
```

## How to use

With this program:

- press a key on the keyboard
- the bell is activated

## How it works

- it creates a serial communication
- it sends `7` in ASCII characters which is the sound of the bell

```cpp
Serial.println((char)7);
```

> Caption :
>
> - The `7` is the ASCII code for the bell
> - The cast `(char)` indicates to send a ascii char (and not the number `7`)
