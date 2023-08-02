/*
Select which platform you're joining from!
 */

import React, {useEffect, useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {SlackLogin} from "../platforms/slackLogin";

enum PLATFORMS {
    Slack = 'Slack'
}

export const JoinLogin = ({
    platform,
    setPlatform,
    bridge,
    setBridge,
    stepComplete,
    setStepComplete
 }) => {
    const [loginComponent, setLoginComponent] = useState(<></>);


    const handleSelect = (event) => {
        setBridge(undefined);
        setPlatform(event.target.value);
    }

    useEffect(() => {
      switch(platform){
        case "Slack":
          setLoginComponent(<SlackLogin
            bridge={bridge}
            setBridge={setBridge}
          />)
        default:
          setLoginComponent(<></>)

      }
    }, [platform])

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

                </Select>
            </FormControl>
            {
                platform ? loginComponent : <div style={{width: "50%"}}></div>
            }

        </div>
    )
}
