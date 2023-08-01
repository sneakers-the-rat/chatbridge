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
import {createChannel} from "../../api/channel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import {JoinBridge} from "./joinBridge";
import JoinChannel from "./joinChannel";

export interface JoinFormProps {
    group?: Group
    invite_token: string
}

export interface stepCompleteType {
    login: boolean;
    bridge: boolean;
    channel: boolean;
}

export const JoinForm = ({group, invite_token}: JoinFormProps) => {
    const [bridgeCreated, setBridgeCreated] = useState(false);
    const [bridgeErrorMessage, setBridgeErrorMessage] = useState('');
    const [platform, setPlatform] = useState<string>();
    const [channels, setChannels] = useState<Array<{
        name: string;
        id: string;
        is_member: boolean;
    }>
    >();
    const [selectedChannel, setSelectedChannel] = useState<string>('');
    const [bridge, setBridge] = useState<{
        Label: string;
        Protocol: string;
        team_name: string;
        id: string;
    }>();
    const [stepComplete, setStepComplete] = useState<stepCompleteType>({
        login: false,
        bridge: false,
        channel: false
    });

    const createBridgedChannel = () => {
        createChannel(selectedChannel, bridge.id, invite_token, onBridgedChannelCreated)
    }

    const onBridgedChannelCreated = (result) => {
        if (result.status === 'success'){
            setBridgeCreated(true)
            setBridgeErrorMessage('')
        } else {
            setBridgeCreated(false)
            setBridgeErrorMessage(result.message)
        }
    }

    useEffect(() => {
        if (bridge !== undefined){
            setStepComplete({...stepComplete, login:true})
        }
        if (bridge !== undefined && channels === undefined){
            getSlackChannels(setChannels)
        }
    }, [bridge])

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
            title={"2) Configure Bridge"}
            details={"Settings for all channels bridged from this platform"}
            id={'bridge'}
            disabled={!stepComplete.login}
            completed={stepComplete.bridge}
        >
            <JoinBridge
                bridge={bridge}
                setBridge={setBridge}
                setStepComplete={setStepComplete}
                stepComplete={stepComplete}
            />
        </JoinStep>
        <JoinStep
            title={"3) Select a channel!"}
            details={"The bot will join :)"}
            id={'channel'}
            disabled={!stepComplete.login}
            completed={stepComplete.channel}
        >
            <JoinChannel
                channels={channels}
                selectedChannel={selectedChannel}
                setSelectedChannel={setSelectedChannel}
                setStepComplete={setStepComplete}
                stepComplete={stepComplete}
            />
        </JoinStep>
        <Button
            className={'create-button'}
            sx={{marginTop: "1em"}}
            variant={"outlined"}
            disabled={group === undefined || !stepComplete.login || !stepComplete.bridge || !stepComplete.channel}
            onClick={createBridgedChannel}
            color={bridgeErrorMessage !== '' ? 'error' : bridgeCreated ? 'success' : undefined}
        >
            {bridgeErrorMessage !== '' ? bridgeErrorMessage : bridgeCreated ? 'Bridge Created!' : 'Create New Bridge' }
        </Button>
    </>
    )
}