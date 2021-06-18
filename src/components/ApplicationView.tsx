import { useEffect, useRef, useState } from "react";
import { Application } from "../Application";

import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";

import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const mainTheme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        height: `calc(100% - ${theme.spacing(4)}px)`,
        padding: `${theme.spacing(2)}px`,
    },
    header: {},
    content: {
        flexGrow: 1,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    footerLeft: {},
    footerRight: {},
    iconButton: {
        margin: `0px`,
        padding: `0px`,
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
                <div className={classes.header}>
                    <Typography variant="body2" color="textPrimary">
                        {mediaReady ? `Fps: ${frameRate.toFixed(2)}` : "Media Not Ready"}
                    </Typography>
                </div>
                <div className={classes.content}></div>
                <div className={classes.footer}>
                    <div className={classes.footerLeft}>
                        <Typography variant="body2" color="textPrimary">
                            {mediaReady ? "Click to play 'Bajan Canadian (Minecraft Mix)'" : ""}
                        </Typography>
                    </div>
                    <div className={classes.footerRight}>
                        <IconButton
                            aria-label="delete"
                            className={classes.iconButton}
                            target="_blank"
                            href="https://github.com/benglin/project-glitter"
                        >
                            <GitHubIcon color="secondary" fontSize="large" />
                        </IconButton>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default ApplicationView;
