import {Grid} from "@mui/material";
import {TextField} from "@mui/material";


export const JoinBridge = ({
    bridge, setBridge
                           }) => {
    const onSetLabel = (label) => {
        setBridge({...bridge, Label:label})
    }

return (
    <Grid container spacing={2} columns={2}>
        <Grid item xs={1}>

        </Grid>
        <Grid item xs={1}>
            <TextField
                onChange={(event) => {onSetLabel(event.target.value)}}>

            </TextField>
        </Grid>
    </Grid>
)

}