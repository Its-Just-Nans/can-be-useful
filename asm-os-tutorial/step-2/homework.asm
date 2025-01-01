mov ah, 0x0e        ; Switches to teletype mode
mov al, 65          ; Moves 65 to al register, which is the capital letter A

loop:               ; A loop

    cmp al, 'Z' + 1 ; Checks if the value in al has reached the specified value, or in this case, a char after Z
    je exit         ; If so, then break out of the loop
    int 0x10        ; Else, call the BIOS Interrupt and type out the letter
    add al, 32      ; This will add 32 to the al register because according to the ASCII Chart, the value difference between uppercase letters and the lowercase letters is different by 32
    int 0x10        ; Call the BIOS Interrupt again and type out the lowercase letter
    sub al, 31      ; Subtracts from al by 32 and add 1 after the loop starts again
    jmp loop        ; Jumps back into the loop

exit:               ; Exit Label
    jmp $           ; Jump to the current address

times 510 - ($ - $$) db 0
db 0x55, 0xaa