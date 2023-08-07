import React, {useState} from 'react';

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import {groupInvite} from '../../api/groups'
import {Group} from '../../types/group'


export interface JoinGroupProps {
  group: Group;
  setGroup: React.Dispatch<React.SetStateAction<Group>>
}

export const JoinGroup = ({
  group,
  setGroup
}: JoinGroupProps) => {
  const [text, setText] = useState('');
  const [authError, setAuthError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const onGroupLogin = (response) => {
    if (response.status !== "success"){
      setAuthError(true);
      setErrorText(response.message);
      setGroup(undefined);
    } else if (response.status === "success"){
      setAuthError(false);
      setErrorText('');
      setGroup(response.data)
    }
  }

  const handleClick = () => {
    groupInvite(text, onGroupLogin)
  }

  const textChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value)
    setGroup(undefined)
  }
  return (
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
  )
}
