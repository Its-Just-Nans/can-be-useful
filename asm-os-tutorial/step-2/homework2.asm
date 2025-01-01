mov ah, 0x0e
mov al, 65
int 0x10
mov bl, 'a'
xchg al, bl
int 0x10
xchg bl, al

loop:
    inc al
    inc bl
    cmp al, 'Z' + 1
    je exit
    int 0x10
    xchg al, bl
    int 0x10
    xchg bl, al
    jmp loop
exit:
    jmp $

times 510-($-$$) db 0
db 0x055, 0x0aa