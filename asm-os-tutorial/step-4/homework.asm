printnumber:
    mov ah, 0x0e
    mov bx, 0
    mov al, 48

print:
    cmp bx, 10
    je exit
    int 0x10
    inc bx
    inc al
    jmp print

exit:
    ret

jmp $ ; infinite loop to hold screen

times 510 - ($-$$) db 0
db 0x55, 0xaa