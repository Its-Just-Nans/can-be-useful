compile:
	arduino-cli compile --fqbn arduino:avr:nano:cpu=atmega328old

upload:
	arduino-cli upload -p /dev/ttyUSB0 --fqbn arduino:avr:nano:cpu=atmega328old

putty:
	putty /dev/ttyUSB0 -serial -sercfg 9600,8,n,1,N

all: compile upload putty
