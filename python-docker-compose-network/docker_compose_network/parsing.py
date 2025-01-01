import yaml


def parse_file(filename):
    with open(filename, "r") as file:
        dockerfile = yaml.safe_load(file)

    devices = {}
    services = dockerfile.get("services", [])
    for name, config in services.items():
        machine_networks = config.get("networks", [])
        for net_key, network_conf in machine_networks.items():
            if net_key not in devices:
                devices[net_key] = {}
            devices[net_key][name] = machine_networks

    bridge_networks = {}
    for key, conf_device in dockerfile.get("services", []).items():
        device_networks = conf_device.get("networks", [])
        if len(device_networks) > 1:
            for name in device_networks:
                if name not in bridge_networks:
                    bridge_networks[name] = set(device_networks.keys())
                else:
                    bridge_networks[name].update(device_networks.keys())
    return devices, bridge_networks
