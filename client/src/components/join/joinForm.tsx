import Typography from "@mui/material/Typography";

import {Group} from "../../types/group";
import {JoinPlatform} from "./joinPlatform";
import {useState} from "react";


export interface JoinFormProps {
    group: Group
}

export const JoinForm = ({group}: JoinFormProps) => {
    const [platform, setPlatform] = useState();

    return (
        <>
            <header className={'section-header'}>
                Joining group: <code>{group.name}</code>
            </header>
        <JoinPlatform
            platformSetter = {setPlatform}
        ></JoinPlatform>
        </>
    )
}