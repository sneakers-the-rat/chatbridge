import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export interface GroupRowProps {
    name: string;
    id: string;
    invite_token: string;
    created_at: string;
}

export default function GroupRow(
    {name, id, invite_token, created_at}: GroupRowProps
){
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
        </TableRow>
    )

}