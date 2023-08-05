import {useEffect, useState} from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import {stepCompleteType} from "./joinForm";
import {getSlackChannels, joinSlackChannel} from "../../api/slack";
import {getDiscordChannels} from "../../api/discord";

import {channelsType} from "../../types/channel";
import {bridgeType} from "../../types/bridge";


export interface JoinChannelProps {
    platform: string;
    bridge: bridgeType;
    selectedChannel: string;
    setSelectedChannel: CallableFunction;
    setStepComplete: CallableFunction;
    stepComplete: stepCompleteType
}

const JoinChannel = ({
    platform,
    bridge,
    selectedChannel,
    setSelectedChannel,
    setStepComplete,
    stepComplete
}: JoinChannelProps) => {
    const [errored, setErrored] = useState(false);
    const [channels, setChannels] = useState<channelsType[]>();


    useEffect(() => {
        if (bridge){
            switch(platform){
                case "Slack":
                    getSlackChannels(setChannels)
                    break
                case "Discord":
                    getDiscordChannels(setChannels)
                    break
            }
        }
    }, [platform, bridge])

    const onJoinChannel = (response) => {
        if (response.status === 'success'){
            setErrored(false)
            setStepComplete({...stepComplete, channel:true})
        } else {
            setErrored(true)
        }
    }

    const onChannelChanged = (evt:any) => {
        if (platform === "Discord"){
            // Discord bots are in all channels by default - selecting one here completes the step
            setStepComplete({...stepComplete, channel:true})
        } else {
            // Otherwise, we need to do something to join the channel, so selecting means we have yet to join it.
            setStepComplete({...stepComplete, channel: false})
        }
        setSelectedChannel(evt.target.value)
    }

    const onJoinButtonClicked = () => {
        switch(platform){
            case "Slack":
                let channel_id = channels.filter(chan => chan.name === selectedChannel)
                  .map(chan => chan.id)[0]
                joinSlackChannel(channel_id, onJoinChannel)
        }

    }

    return (
        <div className={"list-row"}>
            <FormControl sx={{width: platform === "Slack" ? "50%" : "100%"}}>
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
            {platform === "Slack" ?
            <Button
                variant={"outlined"}
                onClick={onJoinButtonClicked}
                disabled={selectedChannel === ''}
                color={stepComplete.channel ? 'success': undefined}
            >
                {stepComplete.channel ? 'Channel Joined!' : 'Join Channel'}
            </Button>
            : null }
        </div>
    )
}

export default JoinChannel
