import "./SearchField.css";
import { useState } from "react";

const SearchField = (props) => {
    const [value, setValue] = useState("");
    const handleChange = (e) => setValue(e.target.value);
    return (
        <div className="searchBox">
            <input
                type="text"
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        props.update(value);
                    }
                }}
                value={value}
                onChange={handleChange}
            />
            <button
                onClick={() => {
                    props.update(value);
                }}
            >
                go
            </button>
        </div>
    );
};

export default SearchField;
