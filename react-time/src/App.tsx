import { ChangeEvent, useEffect, useMemo, useState } from "react";
import TimeDisplayer from "./TimeDisplayer";

type TimeDisplayerProps = {
    [key: string]: boolean;
};

const App = () => {
    const [selectedTimeZone, setSelectedTimeZone] = useState("");
    const [timeZones, setTimeZones] = useState([]);
    const [savedTimeZones, setSavedTimeZones] = useState<TimeDisplayerProps>({});
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        // Get all supported time zones using Intl API
        // @ts-expect-error
        // Intl.supportedValuesOf is not yet supported by TypeScript
        const allTimeZones = Intl.supportedValuesOf("timeZone");
        setTimeZones(allTimeZones);

        // Load saved time zones from localStorage
        const saved = JSON.parse(localStorage.getItem("timeZones") ?? "{}") || {};
        if (typeof saved !== "object" || Array.isArray(saved) || saved === null) {
            localStorage.removeItem("timeZones");
            return;
        }
        setSavedTimeZones(saved);
    }, []);

    const filteredTimeZones = useMemo(() => {
        return timeZones.filter((oneTimeZone) => {
            return !Object.keys(savedTimeZones).includes(oneTimeZone);
        });
    }, [timeZones, savedTimeZones]);

    const handleTimeZoneSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        if (!selected) return;
        setSelectedTimeZone(selected);

        setSavedTimeZones((savedTimeZones) => {
            const updatedTimeZones = { ...savedTimeZones, [selected]: true };
            localStorage.setItem("timeZones", JSON.stringify(updatedTimeZones));
            return updatedTimeZones;
        });
    };

    const handleDeleteTimeZone = (zoneToDelete: string) => {
        setSavedTimeZones((savedTimeZones) => {
            const { [zoneToDelete]: _none, ...updatedSavedTimeZones } = savedTimeZones;
            localStorage.setItem("timeZones", JSON.stringify(updatedSavedTimeZones));
            return updatedSavedTimeZones;
        });
    };

    const deleteAllTimzZone = () => {
        localStorage.removeItem("timeZones");
        setSavedTimeZones({});
    };

    const timer = () => setDate(new Date());

    useEffect(() => {
        const id = setInterval(timer, 1000);
        return () => clearInterval(id);
    }, [date]);

    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <div>
            <div>
                <span>Your Current Timezone: {currentTimeZone}</span>
                <h2>
                    <TimeDisplayer timeZone={currentTimeZone} date={date} />
                </h2>
            </div>
            <hr />
            <div>
                <select value={selectedTimeZone} onChange={handleTimeZoneSelect}>
                    <option value="">-- Select a Timezone --</option>
                    {filteredTimeZones.map((timeZone) => (
                        <option key={timeZone} value={timeZone}>
                            {timeZone}
                        </option>
                    ))}
                </select>
                <button title="Delete all" onClick={deleteAllTimzZone} style={{ marginLeft: "10px", color: "red" }}>
                    ❌
                </button>
            </div>
            <br />

            {Object.keys(savedTimeZones).length > 0 ? (
                Object.keys(savedTimeZones).map((zone) => (
                    <div key={zone} className="time-zone">
                        <TimeDisplayer timeZone={zone} date={date} />
                        <button
                            title={`Remove ${zone}`}
                            onClick={() => handleDeleteTimeZone(zone)}
                            style={{ marginLeft: "10px", color: "red" }}
                        >
                            ❌
                        </button>
                    </div>
                ))
            ) : (
                <p>No time zones saved yet.</p>
            )}
        </div>
    );
};

export default App;
