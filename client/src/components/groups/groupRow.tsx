import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import IconButton from "@mui/material/IconButton"

import {deleteGroup} from "../../api/groups";

export interface GroupRowProps {
    name: string;
    id: string;
    invite_token: string;
    created_at: string;
    fetchGroups: CallableFunction;
}

export default function GroupRow(
    {name, id, invite_token, created_at, fetchGroups}: GroupRowProps
){
    const handleDeleteGroup = () => {
        deleteGroup(id, deleteGroupCallback)
    }

    const deleteGroupCallback = () => {
        fetchGroups()
    }

    return(
        <TableRow
            key={id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell component="th" scope="row">
                {name}
            </TableCell>
            <TableCell align="right">{created_at}</TableCell>
            <TableCell align="right">{invite_token}</TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={handleDeleteGroup}
                >
                    <DeleteForeverIcon/>
                </IconButton>
            </TableCell>
        </TableRow>
    )

}
