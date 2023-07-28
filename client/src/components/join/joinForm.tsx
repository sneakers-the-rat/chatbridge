import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';


import {Group} from "../../types/group";
import {JoinStep} from './joinStep';
import {JoinPlatform} from "./joinPlatform";
import {useState, useEffect} from "react";
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';
import {setBridgeLabel} from "../../api/bridge";
import {getSlackChannels} from "../../api/slack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

export interface JoinFormProps {
    group: Group
}

interface stepCompleteType {
    login: boolean;
    bridge: boolean;
    channel: boolean;
}

export const JoinForm = ({group}: JoinFormProps) => {
    const [platform, setPlatform] = useState<string>();
    const [channels, setChannels] = useState<string[]>();
    const [selectedChannel, setSelectedChannel] = useState<string>();
    const [bridge, setBridge] = useState<{
        Label: string;
        Protocol: string;
        team_name: string;
    }>();
    const [stepComplete, setStepComplete] = useState<stepCompleteType>({
        login: false,
        bridge: false,
        channel: false
    });

    useEffect(() => {
        if (bridge !== undefined){
            setStepComplete({...stepComplete, login:true})
        }
        if (channels === undefined){
            getSlackChannels(setChannels)
        }
    }, [bridge])

    const onSetBridge = (evt) => {
        setBridge({...bridge, Label:evt.target.value})
    }

    const updateBridgeLabel = () => {
        setBridgeLabel(bridge.Label, () => {setStepComplete({...stepComplete, bridge:true})})
    }

    const handleSelectChannel = (evt) => {

    }

    const joinChannel = () => {

    }

    return (
        <>
            <header className={'section-header'}>
                Joining group: <code>{group.name}</code>
            </header>
        <JoinStep
            title={"1) Login"}
            details={"Select your chat platform"}
            id={'login'}
            completed={stepComplete.login}
        >
            <JoinPlatform
                platformSetter = {setPlatform}
                bridgeSetter = {setBridge}
                completeSetter= {setStepComplete}
            />
        </JoinStep>
        <JoinStep
            title={"2) Set Bridge Label"}
            details={"A short identifier shown before your messages"}
            id={'bridge'}
            disabled={!stepComplete.login}
            completed={stepComplete.bridge}
        >
            <Grid container spacing={2} columns={4} alignItems="center">
                <Grid item xs={1}>
                    <Typography>Label:</Typography>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        value={bridge?.Label}
                        onChange={onSetBridge}>
                    </TextField>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant={"outlined"}
                        onClick={updateBridgeLabel}>
                        Update Label!
                    </Button>
                </Grid>
            </Grid>
        </JoinStep>
        <JoinStep
            title={"3) Select a channel!"}
            details={"The bot will join :)"}
            id={'bridge'}
            disabled={!stepComplete.login}
            completed={stepComplete.channel}
        >
            <div className={"list-row"}>
                <FormControl sx={{width: "50%"}}>
                    <InputLabel>Select Platform</InputLabel>
                    <Select
                        // value={platform}
                        onChange={(evt:any) => {setSelectedChannel(evt.target.value)}}
                        label={"Select Channel"}
                    >
                        {
                            channels ?
                                channels.map(chan => {
                                    return(<MenuItem value={chan} key={chan}>{chan}</MenuItem>)
                                })
                                : undefined
                        }

                    </Select>
                </FormControl>
                <Button
                    variant={"outlined"}
                    onClick={joinChannel}>
                    Join Channel
                </Button>
            </div>
            <Grid container spacing={2} columns={2} alignItems="center">
                <Grid item xs={1}>
                    <Typography>Label:</Typography>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        value={bridge?.Label}
                        onChange={onSetBridge}>
                    </TextField>
                </Grid>
                <Grid item xs={1}>
                    <Button
                        variant={"outlined"}
                        onClick={updateBridgeLabel}>
                        Update Label!
                    </Button>
                </Grid>
            </Grid>
        </JoinStep>
    </>
    )
}