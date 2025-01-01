all: normal homework

homework:
	nasm -f bin homework.asm -o homework.bin
	qemu-system-x86_64 homework.bin
	nasm -f bin homework2.asm -o homework2.bin
	qemu-system-x86_64 homework2.bin

normal: build run

build:
	nasm -f bin boot.asm -o boot.bin

run:
	qemu-system-x86_64 boot.bin