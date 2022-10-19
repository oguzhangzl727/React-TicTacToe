import { createTheme } from '@mui/material';
import {purple,green} from '@mui/material/colors';


const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: green[500],
        },
    },
});

export default theme
