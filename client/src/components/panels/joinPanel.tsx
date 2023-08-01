import React from 'react';
import {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {JoinForm} from "../join/joinForm";
import {Group} from "../../types/group";
import {groupInvite} from "../../api/groups";

export default function JoinPanel(){
    const [text, setText] = useState('');
    const [authError, setAuthError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [group, setGroup] = useState<Group>(undefined);

    const onGroupLogin = (response) => {
        if (response.status !== "success"){
            setAuthError(true);
            setErrorText(response.message);
            setGroup(undefined);
        } else if (response.status === "success"){
            setAuthError(false);
            setErrorText('');
            setGroup(response.data)
            console.log(response)
        }
    }

    const handleClick = () => {
        groupInvite(text, onGroupLogin)
    }

    const textChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
        setGroup(undefined)
    }
    return(
        <div className={"JoinPanel"}>
            <div className={"InputGroup"}>
                <TextField
                    error={authError}
                    helperText={errorText}
                    className={"Input"}
                    label={"Join with invite token"}
                    onChange={textChanged}
                />
                <Button
                    variant="contained"
                    onClick={handleClick}
                    color={authError ? "error" : undefined}
                >
                    Submit
                </Button>
            </div>
            { group ?
            <JoinForm
                group = {group}
                invite_token = {text}
            /> : undefined
            }
        </div>
    )
}