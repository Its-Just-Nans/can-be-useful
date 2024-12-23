import serial


port = "/dev/ttyUSB0"
baudrate = 4800
ser = serial.Serial(port, baudrate, timeout=1)


def catcher(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"Error in {func.__name__}: {e}")

    return wrapper


@catcher
def decode_gprmc(line):
    print("GPRMC", end=" ")
    hours = int(line[7:9])
    minutes = int(line[9:11])
    seconds = int(line[11:13])
    milliseconds = int(line[14 : 14 + 2])
    print(f"{hours}:{minutes}:{seconds}.{milliseconds}", end=" ")
    state = line[17]
    if state == "V":
        print("invalid data")
        return
    milliseconds = line[13 : 13 + 3]
    latitude = line[17 : 17 + 11]
    lat = int(latitude[0:2])
    lat_min = float(latitude[2:-2])
    latitude = lat + lat_min / 60
    longitude = line[29:41]
    lon = int(longitude[0:3])
    lon_min = float(longitude[3:-2])
    longitude = lon + lon_min / 60
    speed = line[45:50]
    course = line[51:57]
    date = line[57:63]
    magnetic_variation = line[63:68]
    magnetic_variation_dir = line[68]
    crc = line[69:71]
    print(
        {
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds,
            "milliseconds": milliseconds,
            "latitude": latitude,
            "longitude": longitude,
            "speed": speed,
            "course": course,
            "date": date,
            "magnetic_variation": magnetic_variation,
            "magnetic_variation_dir": magnetic_variation_dir,
            "crc": crc,
        }
    )


def decode_gpgga(line):
    print("GPGGA", end=" ")
    hours = int(line[7:9])
    minutes = int(line[9:11])
    seconds = int(line[11:13])
    milliseconds = int(line[14:16])
    latitude = line[17 : 17 + 11]
    lat = int(latitude[0:2])
    lat_min = float(latitude[2:-2])
    latitude = lat + lat_min / 60
    longitude = line[29:41]
    lon = int(longitude[0:3])
    lon_min = float(longitude[3:-2])
    longitude = lon + lon_min / 60
    position = line[42]
    satellites = line[44 : 44 + 2]
    hdop = line[47:50]
    star = line[58]
    crc = line[59:61]
    print(
        {
            "time": f"{hours}:{minutes}:{seconds}.{milliseconds}",
            "latitude": latitude,
            "longitude": longitude,
            "position": position,
            "satellites": satellites,
            "hdop": hdop,
            "star": star,
            "crc": crc,
        }
    )


@catcher
def decode_gpgsv(line):
    print("GPGSV", end=" ")
    nb = int(line[7])
    current = int(line[9])
    total = int(line[11:12])
    print(
        {
            "nb": nb,
            "current": current,
            "total": total,
        }
    )


def decode_line(line):
    try:
        line = line.decode("utf-8")
        if line.startswith("$GPGGA"):
            decode_gpgga(line)
        elif line.startswith("$GPRMC"):
            decode_gprmc(line)
        elif line.startswith("$GPGSV"):
            decode_gpgsv(line)
        else:
            print(line[0:6])
    except UnicodeDecodeError:
        print("Error decoding line")


while True:
    data = ser.readline()
    decode_line(data)
