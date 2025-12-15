import pandas as pd
import os
import json

import plotly.express as px
import plotly.graph_objects as go

TIME_SPLIT = 10


def extract_month(path_year, month):
    places = {}
    segments = {}

    path_json = os.path.join(path_year, month)

    with open(path_json) as f:
        data = json.load(f)

    data = data["timelineObjects"]
    print("Number of data  : ", len(data), month)

    for one_data in data:
        if "activitySegment" not in one_data:
            loc = one_data["placeVisit"]["location"]
            duration = one_data["placeVisit"]["duration"]
            text = ""
            if "name" in loc:
                text = loc["name"]
            if "address" in loc:
                text = loc["address"]

            text += f"\n{duration['startTimestamp']} - {duration['endTimestamp']}"
            time = duration["startTimestamp"][0:TIME_SPLIT]
            if "latitudeE7" not in loc:
                continue
            seg = {
                "color": "green",
                "lat": loc["latitudeE7"] / 1e7,
                "lon": loc["longitudeE7"] / 1e7,
                "text": text,
                "start": duration["startTimestamp"],
                "end": duration["endTimestamp"],
            }
            if time in segments:
                segments[time].append(seg)
            else:
                segments[time] = [seg]
        else:
            loc = one_data["activitySegment"]["startLocation"]
            duration = one_data["activitySegment"]["duration"]
            new_loc = {
                "color": "red",
                "lat": loc["latitudeE7"] / 1e7,
                "lon": loc["longitudeE7"] / 1e7,
                "start": duration["startTimestamp"],
                "end": duration["endTimestamp"],
                "text": f"{duration['startTimestamp']} - {duration['endTimestamp']}",
            }
            time = duration["startTimestamp"][0:TIME_SPLIT]
            if time in places:
                places[time].append(new_loc)
            else:
                places[time] = [new_loc]

    return places, segments


def extract_semantic(path_year):
    if not os.path.exists(path_year):
        print("File not found : ", path_year)
        return [], []

    places = {}
    segments = {}
    for file in os.listdir(path_year):
        place, segment = extract_month(path_year, file)
        places.update(place)
        segments.update(segment)

    return places, segments


path = input("enter absolute path to the google takeout/journeys\n")

segments = {}
places = {}

sementic = os.path.join(path, "Semantic Location History")

for year in os.listdir(sementic):
    path_year = os.path.join(sementic, year)
    if os.path.isdir(path_year):
        print("Year : ", year)
        place, segment = extract_semantic(path_year)
        print("Number of days for places : ", len(place))
        print("Number of fays for segments : ", len(segment))
        segments.update(segment)
        places.update(place)


path_records = os.path.join(path, "Records.json")
print("Reading records from : ", path_records)
with open(path_records, "r") as f:
    records = json.load(f)
print("Number of records : ", len(records["locations"]))


data_records = {}
for record in records["locations"]:
    spurce = ""
    if "source" in record:
        source = record["source"]
    else:
        source = record["formFactor"]
    text = ""
    if "address" in record:
        text = record["address"]
    if "latitudeE7" not in record:
        continue
    seg = {
        "color": "blue",
        "lat": record["latitudeE7"] / 1e7,
        "lon": record["longitudeE7"] / 1e7,
        "text": text,
        "timestamp": record["timestamp"],
    }

    time = record["timestamp"][0:TIME_SPLIT]
    if time in data_records:
        data_records[time].append(seg)

    else:
        data_records[time] = [seg]


def show_date(choosen_date):
    data = {}
    if choosen_date in segments:
        data["segments"] = segments[choosen_date]
        df = pd.DataFrame(segments[choosen_date])
        fig = px.line_map(df, lat="lat", lon="lon", color="color", text="text")
    else:
        fig = go.Figure()

    fig.update_layout(title=choosen_date, map_zoom=3)
    if choosen_date in data_records:
        data["records"] = data_records[choosen_date]
        fdd = pd.DataFrame(data_records[choosen_date])
        fig.add_trace(
            go.Scattermap(
                mode="markers+lines",
                lon=fdd["lon"],
                lat=fdd["lat"],
                marker={"size": 10},
            )
        )

    if choosen_date in places:
        data["places"] = places[choosen_date]
        df = pd.DataFrame(places[choosen_date])
        fig.add_trace(
            go.Scattermap(
                mode="markers",
                lon=df["lon"],
                lat=df["lat"],
                marker={"size": 10},
            )
        )

    fig.show()
    return data


# sort by date
segments = dict(sorted(segments.items(), key=lambda item: item[0]))
places = dict(sorted(places.items(), key=lambda item: item[0]))
data_records = dict(sorted(data_records.items(), key=lambda item: item[0]))

# get all dates
all_dates = sorted(
    set(list(segments.keys()) + list(places.keys()) + list(data_records.keys()))
)

all_dates.reverse()

for key in all_dates:
    print("Date : ", key)
    data = show_date(key)
    i = input("Press Enter to continue or 'export'\n")
    if i == "export":
        with open(f"{key}.json", "w") as f:
            json.dump(data, f)
            print(f"Data exported to {key}.json")
