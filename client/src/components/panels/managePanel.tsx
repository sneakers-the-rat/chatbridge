import React from 'react';
import {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import GroupPanel from "../groups/groupPanel";

export default function ManagePanel(){
    const [loggedIn, setLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [text, setText] = useState('');
    const [groups, setGroups] = useState([]);


    const submitToken = (login_type) => {
        fetch("api/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: text
            })
        }).then(
            result => result.json()
        ).then(
            response => {

                if (response.status !== "success"){
                    if  (login_type === 'initial') {
                        // Do nothing, we're just checking
                        return
                    }
                    setAuthError(true)
                    setLoggedIn(false)
                    setErrorText(response.message)
                    console.log('failed')
                } else if (response.status === "success") {
                    setLoggedIn(true)
                    setAuthError(false)
                    setErrorText('')
                    console.log('succeeded')
                }
                console.log(response)
            }
        )
    }

    const fetchGroups = () => {
        fetch('api/groups')
            .then(res => res.json())
            .then(res => {
                console.log('fetched groups', res)
                if (res.data !== undefined) {
                    setGroups(res.data)
                }
            })
    }

    const createGroup = () => {
        fetch("api/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: text,
                enable: true
            })
        })
            .then(req => req.json())
            .then(req => {
                console.log(req)
                if (req.status === "success"){
                    setAuthError(false);
                    setErrorText('');
                    setGroups([...groups, req.data])
                } else {
                    setAuthError(true);
                    setErrorText(req.message);
                }
            })
    }

    const handleClick = () => {
        if (!loggedIn){
            submitToken('');
        } else {
            createGroup();
        }
    }


    const textChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    // Call auth once when loaded to check session cookie
    useEffect(() => {
        submitToken('initial')
    }, [])

    // Fetch groups if we're logged in
    useEffect(() => {
        if (loggedIn) {
            console.log('fetching groups')
            fetchGroups()
        }
    }, [loggedIn])

    return(
        <div className={"Panel ManagePanel"}>
            <div className={"InputGroup"}>
            <TextField
                error={authError}
                helperText={errorText}
                className={"Input"}
                label={loggedIn ? "Create New Group" : "Log In With Admin Token"}
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
            {
                loggedIn ?
                    <GroupPanel
                        groups={groups}
                    />
                    :
                    null
            }
        </div>
    )
}