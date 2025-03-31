import "./Query.css";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { API_KEY } from "../../constants";

const Query = (props) => {
    const [search, setSearch] = useState(props.search || "");
    const [isLiked, setIsLiked] = useState(false);
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        setSearch(props.search);
        setFavList(props.favList);
        // console.log(props);
        // eslint-disable-next-line
    }, [props.search, props.favList]);
    const { isLoading, error, data } = useQuery(
        ["weather", search, favList],
        async () => {
            if (!props.search) {
                return;
            }
            try {
                let searchStr = "";
                if (typeof search === "string") {
                    searchStr = search;
                } else {
                    searchStr = `${search.lat},${search.lng}`;
                }
                const res = await fetch(
                    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchStr}`
                );
                const data = await res.json();
                if (data.location) {
                    props.updateMap({
                        lat: data.location.lat,
                        lng: data.location.lon,
                    });
                    if (
                        favList &&
                        Array.isArray(favList) &&
                        favList.includes(
                            `${data.location.name},${data.location.country}`
                        )
                    ) {
                        setIsLiked(true);
                    } else {
                        setIsLiked(false);
                    }
                } else {
                    throw new Error("Invalid location");
                }
                return data;
            } catch (e) {
                throw e;
            }
        }
    );

    if (isLoading) {
        return (
            <div className="results">
                <div className="loader"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="results">
                <p>{error.toString()}</p>
            </div>
        );
    }
    return (
        <div className="results">
            <span
                onClick={() => {
                    let tempIsLiked = !isLiked;
                    setIsLiked(tempIsLiked);
                    let added = `${data.location.name},${data.location.country}`;
                    let temp = [];
                    if (tempIsLiked) {
                        temp = [...props.favList, added];
                    } else {
                        temp = [...props.favList];
                        const index = temp.indexOf(added);
                        if (index > -1) {
                            temp.splice(index, 1);
                        }
                    }
                    props.setFavList(temp);
                }}
                className={isLiked ? "star-icon full" : "star-icon"}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    x="0px"
                    y="0px"
                    width="24px"
                    height="24px"
                    viewBox="0 0 36.09 36.09"
                >
                    <g>
                        <path d="M36.042,13.909c-0.123-0.377-0.456-0.646-0.85-0.688l-11.549-1.172L18.96,1.43c-0.16-0.36-0.519-0.596-0.915-0.596   s-0.755,0.234-0.915,0.598L12.446,12.05L0.899,13.221c-0.394,0.04-0.728,0.312-0.85,0.688c-0.123,0.377-0.011,0.791,0.285,1.055   l8.652,7.738L6.533,34.045c-0.083,0.387,0.069,0.787,0.39,1.02c0.175,0.127,0.381,0.191,0.588,0.191   c0.173,0,0.347-0.045,0.503-0.137l10.032-5.84l10.03,5.84c0.342,0.197,0.77,0.178,1.091-0.059c0.32-0.229,0.474-0.633,0.391-1.02   l-2.453-11.344l8.653-7.737C36.052,14.699,36.165,14.285,36.042,13.909z M25.336,21.598c-0.268,0.24-0.387,0.605-0.311,0.957   l2.097,9.695l-8.574-4.99c-0.311-0.182-0.695-0.182-1.006,0l-8.576,4.99l2.097-9.695c0.076-0.352-0.043-0.717-0.311-0.957   l-7.396-6.613l9.87-1.002c0.358-0.035,0.668-0.264,0.814-0.592l4.004-9.077l4.003,9.077c0.146,0.328,0.456,0.557,0.814,0.592   l9.87,1.002L25.336,21.598z" />
                    </g>
                </svg>
            </span>
            <p className="locationName">
                {data.location.name} - {data.location.country}
            </p>
            <span>
                {typeof props.search === "string"
                    ? props.search
                    : `${props.search.lat},${props.search.lng}`}
            </span>
            <div className="metrics">
                <p>{"Temperature: " + data.current.temp_c + "°C"}</p>
                <p>{"Pressure: " + data.current.pressure_mb + " millibars"}</p>
                <p>{"Humidity: " + data.current.humidity + "%"}</p>
                <p>{"Cloud: " + data.current.cloud + "%"}</p>
                <p>{"Wind: " + data.current.wind_kph + "km/h"}</p>
            </div>
            <img src={data.current.condition.icon} alt="icon" />
        </div>
    );
};

export default Query;
