import * as React from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from "@mui/material/DialogContentText";

export interface InfoModalProps {
    open: boolean
    setOpen: CallableFunction
}

const InfoModal = ({
   open,
   setOpen
}: InfoModalProps) => {

    const handleClose = () => {
        setOpen(false)
    }


    return(
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={'body'}
        >
            <DialogTitle>
                ChatBridge INFO
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    ChatBridge is a tool for making groupchats that span multiple chat protocols and platforms.

                    It is a web frontend for <a href={"https://github.com/42wim/matterbridge"}>matterbridge</a> and manages the API logins for platforms like Slack and Discord to lower the barriers to
                    bridging.
                    <br/><br/>
                    This is ALPHA software and functionality is not guaranteed! The eventual goal is to make <a href={"https://a.gup.pe/"}>guppe groups</a> for proprietary chat platforms, where anyone can create and join groups with just an invite token.
                    For now, creating groups is limited to an administrator token until we can be more sure about the security and performance demands of running many matterbridge processes.
                </DialogContentText>
                <h3>Security & Privacy Notes</h3>
                <DialogContentText>
                    This tool is made by privacy advocates and activists. The developers have no interest in storing or monetizing your information, full stop. We will <span style={{"fontStyle":"italic"}}>never</span> abuse the app tokens created by logging into the ChatBridge App for anything except configuring the underlying matterbridge processes
                    <br/><br/>

                    To be as transparent as possible about the operation of the service:
                </DialogContentText>
                    <h4>What is stored</h4>
                <DialogContentText>
                    <ul>
                        <li>Slack/Discord: App login tokens that are generated for your workspace/server</li>
                        <li>Limited metadata about your bridged chat, specifically its name and unique ID (usually these are considered public anyway), and the short label you provide to the service</li>
                        <li>The names of channels you have bridged</li>
                    </ul>
                </DialogContentText>
                    <h4>What is NOT stored</h4>
            <DialogContentText>
                    <ul>
                        <li>Message content and metadata of any kind, even in debugging logs</li>
                        <li>No other metadata about your bridged chat except for that listed above - channel lists in the interface are requested and discarded during the API call</li>
                        <li>The bot access tokens can NOT access DMs or private channels</li>
                    </ul>
            </DialogContentText>
                    <h4>Security of Data at Rest</h4>
            <DialogContentText>
                Matterbridge relies on <code>.toml</code> files that contain the app tokens in plain text. This sets a hard limit on how secure the data can be at rest - ie. encryption at rest is not possible. The tokens that are granted to ChatBridge CAN be used to exfiltrate chat history of public channels for slack and discord if they were to be lost in a data breach. We therfore do NOT recommend you use ChatBridge in a context where the contents of your public channels or the membership in your chatroom becoming public could pose a risk to your members.
                <br/><br/>
                For the main development instance, the service is run as its own user, and the configuration files are stored such that only that user can read them. For the data to be breached, an attacker would need to compromise a root SSH key.
                <br/><br/>
                For information accessed through the chatbridge interface, we authenticate using ephemeral signed cookies that expire 24 hours after they are issued.
                <br/><br/>
                We of course can make no guarantee about security of data at any other instances that deploy ChatBridge.
                <br/><br/>
                To revoke access to ChatBridge at any time, you can uninstall the app from your slack workspace or discord server - this makes the access keys obsolete and will require them to be reissued if you choose to rejoin ChatBridge.
                </DialogContentText>
            </DialogContent>

        </Dialog>
    )
}

export default InfoModal