import { useEffect, useRef, useState } from "react";
import { Application } from "../Application";
import "./ApplicationView.css";

function ApplicationView() {
    const applicationRef = useRef<Application>();
    const [mediaReady, setMediaReady] = useState<boolean>(false);

    useEffect(() => {
        if (!applicationRef.current) {
            const application = new Application();
            applicationRef.current = application;

            application.addEventListener(Application.MediaReady, () => {
                setMediaReady(true);
            });

            application.initialize().then((result: boolean) => {
                if (result) {
                    application.startRenderLoop();
                }
            });
        }
    }, []);

    return <div>{mediaReady ? "Media Ready" : "Media Not Ready"}</div>;
}

export default ApplicationView;
