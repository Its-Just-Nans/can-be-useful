interface TimeDisplayerProps {
    timeZone: string;
    date: Date;
}

const TimeDisplayer = ({ timeZone, date }: TimeDisplayerProps) => {
    const currDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone,
        hourCycle: "h24",
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(date);
    const currHour = new Intl.DateTimeFormat("fr-FR", {
        timeZone: timeZone,
        timeStyle: "long",
    }).format(date);

    return (
        <div>
            <div>{timeZone}</div>
            <div>
                {currDate} {currHour}
            </div>
        </div>
    );
};

export default TimeDisplayer;
