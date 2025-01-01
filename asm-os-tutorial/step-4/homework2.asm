[org 0x7c00]

mov bp, 0x8000
mov sp, bp

inputLabel:
    mov ax, 0
    int 0x16
    mov bh, al
    push bx
    cmp al, 13
    je print
    jmp inputLabel

print:
    pop bx
    mov ah, 0x0e
    mov al, bh
    int 0x10
    cmp bp, sp
    je exit
    jmp print

exit:
    jmp $

times 510-($-$$) db 0
db 0x55, 0xaa