import { useEffect, useState } from "react";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { LOUVAIN } from "../../constants";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const ClickInterceptor = (props) => {
    useMapEvents({
        click(e) {
            props.update(e.latlng);
        },
    });
    return null;
};
function ChangeView(props) {
    const map = useMap();
    if (props.location.lat && props.location.lng) {
        map.setView(props.location, map.getZoom(), {
            animate: true,
        });
    }
    return null;
}

const Map = (props) => {
    const [location, setlocation] = useState(props.location || "");
    useEffect(() => {
        if (props.location !== location) {
            // console.log("updating location");
            setlocation(props.location);
        }
        // console.log(props);
        // eslint-disable-next-line
    }, [props.location]);
    return (
        <>
            <MapContainer center={LOUVAIN} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[
                        location.lat || LOUVAIN[0],
                        location.lng || LOUVAIN[1],
                    ]}
                >
                    <Popup>{location.lat + ", " + location.lng}</Popup>
                </Marker>
                <ClickInterceptor update={props.update} />
                <ChangeView location={location} />
            </MapContainer>
        </>
    );
};

export default Map;
