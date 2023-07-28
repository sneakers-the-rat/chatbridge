/*
Select which platform you're joining from!
 */

import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from "@mui/material/Button";

import {getSlackInstallURL} from "../../api/slack";
import {getBridgeByStateToken} from "../../api/bridge";
import {JoinSlack} from "../panels/joinSlack";

enum PLATFORMS {
    Slack = 'Slack'
}

export const JoinPlatform = ({
    platformSetter,
    bridgeSetter,
    completeSetter
 }) => {
    const [platform, setPlatform] = useState<PLATFORMS>();
    const [installLink, setInstallLink] = useState();
    const [stateToken, setStateToken] = useState();
    const [bridge, setBridge] = useState();

    const pingTimeout = useRef(null);

    const handleSelect = (event) => {
        setPlatform(event.target.value);
        platformSetter(event.target.value);
    }

    useEffect(() => {
        if (platform === "Slack") {
            console.log('Getting slack URL')
            getSlackInstallURL(handleInstallLink)
        }
    }, [platform])

    const handleInstallLink = (url, state_token) => {
        setInstallLink(url);
        setStateToken(state_token);
        // pingForBridge()
    }

    // const pingForBridge = () =>{
    //     if (bridge === undefined){
    //         console.log('bridge is', bridge)
    //         getBridgeByStateToken(setBridge);
    //         setTimeout(pingForBridge, 1000);
    //     }
    // }

    useEffect(() => {
        const pingForBridge = () => {
            if (bridge === undefined) {
                console.log('bridge is', bridge);
                getBridgeByStateToken(setBridge);

                pingTimeout.current = setTimeout(pingForBridge, 1000);
            }
        }
        if (stateToken !== undefined) {
            if (bridge === undefined){
                pingForBridge()
                // pingTimeout.current = setInterval(pingForBridge, 1000)
            }

        }
        return () => {clearInterval(pingTimeout.current)}

        // if (stateToken !== undefined){
        //     if (bridge === undefined){
        //         console.log('bridge is', bridge)
        //         pingTimeout.current = setTimeout(() => {
        //             getBridgeByStateToken(setBridge);
        //         }, 1000)
        //         // setTimeout(pingForBridge, 1000);
        //     }
        // }

    }, [stateToken, bridge])

    useEffect(() => {
        bridgeSetter(bridge)
    }, [bridge])

    // useEffect(() => {
    //
    // }, [installLink])

    const openInstallTab = () => {

        window.open(installLink, '_blank').focus();
    }

    return(
        <div className={"list-row"}>
            <FormControl sx={{width: "50%"}}>
                <InputLabel>Select Platform</InputLabel>
                <Select
                    // value={platform}
                    onChange={handleSelect}
                    label={"Select Platform"}
                    >
                    <MenuItem value={'Slack'}>Slack</MenuItem>
                    
            </Select>
            </FormControl>
            {
                installLink && platform == "Slack" ?
                    <Button
                        variant={"outlined"}
                        onClick={openInstallTab}>
                        Add to Slack
                    </Button>
                : <div style={{width: "50%"}}></div>
            }

        </div>
    )
}