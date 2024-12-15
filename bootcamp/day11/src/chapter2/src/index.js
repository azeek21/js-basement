import { createRoot } from "react-dom/client"
import { App } from "./App";
import React from "react";
import "./styles/index.css";
require('file-loader?name=[name].[ext]!../index.html');

createRoot(document.getElementById('root')).render(
	<App />
)
