import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./components/App/App";
import { start } from "./api";
start();

const root = createRoot(document.getElementById("root"));
root.render(<App />);
