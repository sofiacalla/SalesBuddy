/**
 * Application Entry Point
 * 
 * This file mounts the React application to the DOM.
 * It renders the root App component into the 'root' element defined in index.html.
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
