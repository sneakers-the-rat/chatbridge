import React from 'react';
import {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {JoinForm} from "../join/joinForm";
import {Group} from "../../types/group";

export default function JoinPanel(){
    const [text, setText] = useState('');
    const [authError, setAuthError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [group, setGroup] = useState<Group>(undefined);

    const getGroup = () => {
        fetch('api/groups/invite', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: text
            })
        })
            .then(result => result.json())
            .then(
                response => {
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
        )
    }

    const handleClick = () => {
        getGroup()
    }

    const textChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
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
                    // disabled={loggedIn}
                    // color={loggedIn ? "success" : undefined}
                    // type={loggedIn ? "password" : undefined}
                />
                <Button
                    variant="contained"
                    onClick={handleClick}
                    color={authError ? "error" : undefined}
                    // disabled={loggedIn}
                >
                    Submit
                </Button>
            </div>
            { group ?
            <JoinForm
                group = {group}
            /> : undefined
            }
        </div>
    )
}