/*
Select which platform you're joining from!
 */

import React, {useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {SlackLogin} from "../platforms/slackLogin";
import {DiscordLogin} from "../platforms/discordLogin";

enum PLATFORMS {
    Slack = 'Slack',
    Discord = 'Discord'
}

export const JoinLogin = ({
    platform,
    setPlatform,
    bridge,
    setBridge,
    stepComplete,
    setStepComplete
 }) => {


    const handleSelect = (event) => {
        setBridge(undefined);
        setPlatform(event.target.value);
    }

    useEffect(() => {
      if (bridge !== undefined) {
        setStepComplete({...stepComplete, login:true})
      }
    },[bridge])


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
                    <MenuItem value={'Discord'}>Discord</MenuItem>

                </Select>
            </FormControl>
            {
                platform === "Slack" ? <SlackLogin
                    bridge={bridge}
                    setBridge={setBridge}
                />
                : platform === "Discord" ?   <DiscordLogin
                            bridge={bridge}
                            setBridge={setBridge}
                        />
                : <div style={{width: "50%"}}></div>
            }

        </div>
    )
}
