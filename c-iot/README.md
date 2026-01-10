# RIO201

## Code

- [https://www.iot-lab.info/legacy/tutorials/contiki-compilation/](https://www.iot-lab.info/legacy/tutorials/contiki-compilation/)

```sh
git submodule update --recursive --init
cd iot-lab && make setup-contiki
```

## Usage

```sh
# download dependencies
python -m pip install enoslib[iotlab]

# create the auth file
ENC_PASS=$(printf '%s' pass | base64)
echo -n user:$ENC_PASS > ~/.iotlabrc
```

## Compilation

```sh
make TARGET=iotlab-m3
```

> Made for TP
> Made between 2023-11-28 and 2023-12-02
