import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { connect } from "./state/arenaStore.js";
import { startStory } from "./story/director.js";
import "./styles.css";

connect();
startStory();
createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
