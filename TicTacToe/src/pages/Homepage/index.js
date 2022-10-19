import React from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 140,
    },
    centerText: {
        textAlign: "center"
    },
}));

const Homepage = () => {

    const classes = useStyles()

    return <Container>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography className={classes.centerText}>Hosgeldiniz</Typography>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography>Sol</Typography>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper className={classes.paper}>
                    <Typography>Sağ</Typography>
                </Paper>
            </Grid>
        </Grid>
    </Container>
}

export default Homepage
