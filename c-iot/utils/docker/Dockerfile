FROM multiarch/ubuntu-core:i386-trusty

RUN apt-get update
RUN apt-get -y install build-essential binutils-msp430 gcc-msp430 msp430-libc binutils-avr gcc-avr gdb-avr avr-libc avrdude binutils-arm-none-eabi gcc-arm-none-eabi gdb-arm-none-eabi openjdk-7-jdk openjdk-7-jre ant libncurses5-dev doxygen srecord git

WORKDIR /toto

RUN git clone https://github.com/iot-lab/iot-lab.git
RUN cd iot-lab && make setup-contiki
RUN cd iot-lab/parts/contiki/examples/iotlab/03-sensors-collecting/ && make TARGET=iotlab-m3

RUN ls -la iot-lab/parts/contiki/examples/iotlab/03-sensors-collecting/sensors-collecting.iotlab-m3

CMD ["/toto/iot-lab/parts/contiki/examples/iotlab/03-sensors-collecting/sensors-collecting.iotlab-m3"]