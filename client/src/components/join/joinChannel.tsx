import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {stepCompleteType} from "./joinForm";

import {joinSlackChannel} from "../../api/slack";
import {useState} from "react";


export interface JoinChannelProps {
    channels: Array<{
        name: string;
        id: string;
        is_member: boolean;
    }>;
    selectedChannel: string;
    setSelectedChannel: CallableFunction;
    setStepComplete: CallableFunction;
    stepComplete: stepCompleteType
}

const JoinChannel = ({
    channels,
    selectedChannel,
    setSelectedChannel,
    setStepComplete,
    stepComplete
}: JoinChannelProps) => {
    console.log('joinchannel channels', channels)
    const [errored, setErrored] = useState(false);


    const onJoinChannel = (response) => {
        if (response.status === 'success'){
            setErrored(false)
            setStepComplete({...stepComplete, channel:true})
        } else {
            setErrored(true)
        }
    }

    const onChannelChanged = (evt:any) => {
        setStepComplete({...stepComplete, channel:false})
        setSelectedChannel(evt.target.value)
    }

    const onJoinButtonClicked = () => {
        let channel_id = channels.filter(chan => chan.name === selectedChannel)
            .map(chan => chan.id)[0]
        joinSlackChannel(channel_id, onJoinChannel)
    }

    return (
        <div className={"list-row"}>
            <FormControl sx={{width: "50%"}}>
                <InputLabel>Select Channel</InputLabel>
                <Select
                    // value={selectedChannel}
                    onChange={onChannelChanged}
                    label={"Select Channel"}
                    error={errored}
                    color={stepComplete.channel ? 'success': undefined}

                >
                    <MenuItem value={''} key={''}>Select Channel</MenuItem>
                    {
                    channels ?
                        channels.map(chan => chan.name)
                            .sort()
                            .map(chan => {
                            return(
                                <MenuItem
                                    value={chan}
                                    key={chan}
                                >
                                    {chan}
                                </MenuItem>)
                        })
                        : undefined
                    }

                </Select>
            </FormControl>
            <Button
                variant={"outlined"}
                onClick={onJoinButtonClicked}
                disabled={selectedChannel === ''}
                color={stepComplete.channel ? 'success': undefined}
            >
                {stepComplete.channel ? 'Channel Joined!' : 'Join Channel'}
            </Button>
        </div>
    )
}

export default JoinChannel