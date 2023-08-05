import {useState, useEffect} from "react";

import Button from '@mui/material/Button';

import {JoinStep} from './joinStep';
import {JoinLogin} from "./joinLogin";
import {JoinBridge} from "./joinBridge";
import JoinChannel from "./joinChannel";
import {createChannel} from "../../api/channel";
import {Group} from "../../types/group";
import {bridgeType} from "../../types/bridge";

export interface JoinFormProps {
    group?: Group
}

export interface stepCompleteType {
    login: boolean;
    bridge: boolean;
    channel: boolean;
}

export interface stepErrorType {
    login: string;
    bridge: string;
    channel: string;
}

export const JoinForm = ({group}: JoinFormProps) => {
    // The platform selected to log in to
    const [platform, setPlatform] = useState<string>();
    const [bridge, setBridge] = useState<bridgeType>();
    const [selectedChannel, setSelectedChannel] = useState<string>('');

    const [stepComplete, setStepComplete] = useState<stepCompleteType>({
        login: false,
        bridge: false,
        channel: false
    });

    const [bridgeCreated, setBridgeCreated] = useState(false);
    const [bridgeErrorMessage, setBridgeErrorMessage] = useState('');


    const createBridgedChannel = () => {
        createChannel(selectedChannel, bridge.id, group.invite_token, onBridgedChannelCreated)
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
            <JoinLogin
                platform={platform}
                setPlatform = {setPlatform}
                bridge={bridge}
                setBridge = {setBridge}
                stepComplete = {stepComplete}
                setStepComplete = {setStepComplete}
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
                platform={platform}
                bridge={bridge}
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
