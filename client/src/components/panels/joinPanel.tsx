import React from 'react';
import {useState, useEffect} from "react";

import {JoinForm} from "../join/joinForm";
import {JoinGroup} from '../join/joinGroup';

import {Group} from "../../types/group";

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
