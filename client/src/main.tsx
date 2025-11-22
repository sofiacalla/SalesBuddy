/**
 * Application Entry Point
 * 
 * This file serves as the bridge between the HTML host page and the React application.
 * It is responsible for finding the root DOM element and mounting the React component tree.
 */

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Mount the React Application
 * 
 * We use the 'createRoot' API from React 18+ to enable concurrent features.
 * The 'root' element is defined in the /client/index.html file.
 * The non-null assertion (!) is used because we know the element exists in our static HTML.
 */
createRoot(document.getElementById("root")!).render(<App />);
