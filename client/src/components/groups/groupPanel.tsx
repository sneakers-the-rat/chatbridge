import React from 'react';
import {useState, useEffect} from "react";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from "@mui/material/TableRow";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Typography from "@mui/material/Typography";

import GroupRow from "./groupRow";

export default function GroupPanel({
    groups
}){

    return(
        <div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Group</TableCell>
                            <TableCell align="right">Created At</TableCell>
                            <TableCell align="right">Invite Token</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {groups ? groups.map((group) => (
                            <GroupRow
                                name={group.name}
                                id={group.id}
                                invite_token={group.invite_token}
                                created_at={group.created_at}
                            ></GroupRow>
                            )) : undefined}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}