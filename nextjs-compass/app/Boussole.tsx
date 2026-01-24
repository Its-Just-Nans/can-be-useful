"use client";

import { useEffect, useRef } from "react";
import { Arrow, Circle, Compass, Point, Wrapper } from "./UI";
import useCompass from "./useCompass";

export default function Boussole() {
    const [compass, pointDegree] = useCompass(null);
    const prev = useRef<null | number>(null);
    const rotation = useRef(0);

    // What is this ? See calcDegreeToPoint()
    const myPointOpacity =
        // ±15 degree
        (pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
            ? 0
            : pointDegree
              ? 1
              : 0;

    useEffect(() => {
        if (typeof prev.current === "undefined" || prev.current === null) {
            prev.current = compass;
            return;
        }
        let delta = compass - prev.current;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        rotation.current += delta;
        prev.current = compass;
    }, [compass]);

    return (
        <Wrapper>
            <Compass>
                <Arrow />
                <Circle $compass={rotation.current} />
                <Point $opacity={myPointOpacity} />
            </Compass>
            {!isNaN(compass) && <p style={{ textAlign: "center" }}>Angle : {Math.round(compass)}°</p>}
        </Wrapper>
    );
}
