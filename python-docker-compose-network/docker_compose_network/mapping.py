from .svg import draw_circle, draw_text

global drawed_networks, drawed_devices
drawed_networks = {}
drawed_devices = {}
multi = 50


def draw_network_map(data, bridge_networks, previous, current):
    r = len(data.get(current, [])) * multi
    if previous is not None:
        cx = drawed_networks[previous]["cx"] + drawed_networks[previous]["r"] + r
    else:
        cx = 100
    drawed_networks[current] = {
        "cx": cx,
        "cy": 100,
        "r": r,
        "fill": "blue",
        "stroke": "#000",
        "stroke_width": 2,
        "text": current,
    }
    device_alones = data.get(current, [])
    for i, (device_name, device_conf) in enumerate(device_alones.items()):
        if len(device_conf) == 1:
            drawed_devices[device_name] = {
                "cx": cx,
                "cy": 100 + (i) * multi,
                "r": 20,
                "fill": "red",
                "stroke": "#000",
                "stroke_width": 2,
                "text": device_name,
            }
    friends = bridge_networks[current]
    for one_paired_network in friends:
        if one_paired_network == current or one_paired_network in drawed_networks:
            continue
        draw_network_map(data, bridge_networks, current, one_paired_network)
        device_r1 = data.get(current, [])
        device_r2 = data.get(one_paired_network, [])
        # find the device both in device_r1 and device_r2
        devices_inter = set(set(device_r1.keys()) & set(device_r2.keys()))
        for i, inter_name in enumerate(devices_inter):
            drawed_devices[inter_name] = {
                "cx": cx + r,
                "cy": 100 + (i) * multi,
                "r": 20,
                "fill": "red",
                "stroke": "#000",
                "stroke_width": 2,
                "text": inter_name,
            }


def generate_network_map(data, bridge_networks):
    svg = []

    # Draw network as circle
    draw_network_map(data, bridge_networks, None, list(bridge_networks.keys())[0])
    max_height = 0
    max_width = 0

    for key, value in drawed_networks.items():
        max_height = max(max_height, value["cy"] + value["r"])
        max_width = max(max_width, value["cx"] + value["r"])
        svg.append(
            draw_circle(
                value["cx"],
                value["cy"],
                value["r"],
                value["fill"],
                value["stroke"],
                value["stroke_width"],
            )
        )
        svg.append(
            draw_text(
                value["cx"] - 10,
                value["cy"] + 5,
                value["text"],
                "black",
            )
        )

    for key, value in drawed_devices.items():
        max_height = max(max_height, value["cy"] + value["r"])
        max_width = max(max_width, value["cx"] + value["r"])
        svg.append(
            draw_circle(
                value["cx"],
                value["cy"],
                value["r"],
                value["fill"],
                value["stroke"],
                value["stroke_width"],
            )
        )
        svg.append(
            draw_text(
                value["cx"] - 10,
                value["cy"] + 5,
                value["text"],
                "black",
            )
        )
    return svg, max_width, max_height
