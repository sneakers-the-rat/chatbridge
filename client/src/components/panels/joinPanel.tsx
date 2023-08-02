import React from 'react';
import {useState, useEffect} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {JoinForm} from "../join/joinForm";
import {JoinGroup} from '../join/joinGroup';

import {Group} from "../../types/group";
import {groupInvite} from "../../api/groups";

export default function JoinPanel(){
    const [group, setGroup] = useState<Group>(undefined);

    return(
        <div className={"JoinPanel"}>
            <JoinGroup
                group={group}
                setGroup={setGroup}
            />
            { group ?
            <JoinForm
                group = {group}
            /> : undefined
            }
        </div>
    )
}
