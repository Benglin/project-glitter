import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ApplicationView from "./components/ApplicationView";
import reportWebVitals from "./reportWebVitals";
import { Application } from "./Application";

ReactDOM.render(
    <React.StrictMode>
        <ApplicationView />
    </React.StrictMode>,
    document.getElementById("application-view-root")
);

const application = new Application();
application.initialize().then((result: boolean) => {
    if (result) {
        application.startRenderLoop();
    }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
