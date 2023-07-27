/*
Select which platform you're joining from!
 */

import React, {useState} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {JoinSlack} from "../panels/joinSlack";

const PLATFORMS = {
    'Slack': JoinSlack
}

export const JoinPlatform = ({
    platformSetter
 }) => {
    const [platform, setPlatform] = useState()

    const handleSelect = (event) => {
        setPlatform(event.target.value);
        platformSetter(event.target.value);
    }

    return(
        <div className={"list-row"}>
            <FormControl fullWidth>
                <InputLabel>Select Platform</InputLabel>
                <Select
                    value={platform}
                    onChange={handleSelect}
                    label={"Select Platform"}
                    >
                    <MenuItem value={'slack'}>Slack</MenuItem>
                    
            </Select>
            </FormControl>

        </div>
    )
}