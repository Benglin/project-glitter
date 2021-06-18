import { useEffect, useRef, useState } from "react";
import { Application } from "../Application";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const mainTheme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        padding: `${theme.spacing(2)}px`,
    },
}));

function ApplicationView() {
    const classes = useStyles();
    const applicationRef = useRef<Application>();
    const [frameRate, setFrameRate] = useState<number>(0);
    const [mediaReady, setMediaReady] = useState<boolean>(false);

    function handleFrameRateUpdated(fps: number): void {
        setFrameRate(fps);
    }

    useEffect(() => {
        if (!applicationRef.current) {
            const application = new Application();
            applicationRef.current = application;

            application.addEventListener(Application.MediaReady, () => {
                setMediaReady(true);
            });

            application.initialize().then((result: boolean) => {
                if (result) {
                    application.startRenderLoop(handleFrameRateUpdated);
                }
            });
        }
    }, []);

    return (
        <ThemeProvider theme={mainTheme}>
            <div className={classes.root}>
                <Typography variant="body2" color="textPrimary">
                    {mediaReady ? `Fps: ${frameRate.toFixed(2)}` : "Media Not Ready"}
                </Typography>
            </div>
        </ThemeProvider>
    );
}

export default ApplicationView;
