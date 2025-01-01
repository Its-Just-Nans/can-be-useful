all: homework

homework:
	nasm -f bin homework.asm -o homework.bin
	qemu-system-x86_64 homework.bin

	nasm -f bin homework2.asm -o homework2.bin
	qemu-system-x86_64 homework2.bin
