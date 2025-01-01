all: build run

build:
	nasm -f bin boot.asm -o boot.bin

run:
	qemu-system-x86_64 boot.bin