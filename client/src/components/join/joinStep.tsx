import * as React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export interface JoinStepProps {
    children: any;
    id: string;
    title?: string;
    details?: string;
    completed?: boolean;
    disabled?: boolean
}

export function JoinStep(
    {
        children,
        id,
        title = '',
        details = '',
        completed = false,
        disabled = false
    }: JoinStepProps){

    return(
    <Accordion
        disabled={disabled}
        id={id}
    >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
        >
            <Typography sx={details === '' ?
                {
                    width:'66%',
                    flexGrow: 1
                }
                :
                {
                    width:'33%',
                    flexShrink: 0
                }
            }>
                { title }
            </Typography>
            {details !== '' ?
            <Typography sx={{ color: 'text.secondary', flexGrow: 1 }}>
                { details }
            </Typography>
            : undefined}
            {
                completed ?
                    <TaskAltIcon color={"success"}/>
                    :
                    <RadioButtonUncheckedIcon/>
            }
        </AccordionSummary>
        <AccordionDetails>
                { children }
        </AccordionDetails>
    </Accordion>
    )

}
