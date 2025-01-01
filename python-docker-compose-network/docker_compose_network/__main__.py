from os.path import exists

from sys import argv
from .parsing import parse_file
from .mapping import generate_network_map
from .svg import write_svg


def main():
    filename = "docker-compose.yml"
    output_filename = "network_map.svg"
    if len(argv) > 2:
        filename = argv[2]
    if len(argv) > 3:
        output_filename = argv[3]
    if not exists(filename):
        print(f"File {filename} not found")
        exit(1)
    devices, bridge_networks = parse_file(filename)
    svg, width, height = generate_network_map(devices, bridge_networks)
    write_svg(width, height, svg, output_filename)


if __name__ == "__main__":
    main()
