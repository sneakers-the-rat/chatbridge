import {useState} from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {setBridgeLabel} from "../../api/bridge";



export const JoinBridge = ({
    bridge, setBridge, setStepComplete, stepComplete
                           }) => {

    const [errored, setErrored] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')

    const updateBridgeLabel = () => {
        setBridgeLabel(bridge.Label, (res) => {
            if (res.status === 'success') {
                setErrored(false)
                setStepComplete({...stepComplete, bridge:true})
            } else {
                setErrored(true)
                setErrorMessage(res.message)
            }
        })
    }

    const onSetBridge = (evt) => {
        setBridge({...bridge, Label:evt.target.value})
    }

return (
    <div className={"list-row"}>
        {/*<FormControl sx={{width: "50%"}}>*/}
        {/*    <InputLabel>Bridge Label</InputLabel>*/}
            <TextField
                value={bridge ? bridge.Label : ''}
                onChange={onSetBridge}
                label={"Bridge Label"}
                error={errored}
                color={stepComplete.bridge ? 'success' : undefined}
                helperText={errored ? errorMessage : "A short label shown before messages from this bridge"}
            >
            </TextField>
            <Button
                variant={"outlined"}
                onClick={updateBridgeLabel}
                color={errored ? 'error': stepComplete.bridge ? 'success' : undefined}
            >
                {stepComplete.bridge ? 'Label Updated!' : 'Update Label!'}
            </Button>
    </div>
)

}
