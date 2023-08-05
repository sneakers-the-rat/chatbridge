import React, {useEffect, useRef, useState} from 'react'

import Button from "@mui/material/Button";

import {getSlackInstallURL} from "../../api/slack";
import {getBridgeByStateToken} from "../../api/bridge";

export const SlackLogin = ({
  bridge,
  setBridge
}) => {
  const [installLink, setInstallLink] = useState();
  const [installStarted, setInstallStarted] = useState(false)
  const pingTimeout = useRef(null);

  const openInstallTab = () => {
    window.open(installLink, '_blank').focus();
    setInstallStarted(true)
  }

  useEffect(() => {
      getSlackInstallURL(handleInstallLink)
  }, [])

  const handleInstallLink = (url) => {
    setInstallLink(url);
  }

  useEffect(() => {
    const pingForBridge = () => {
      if (bridge === undefined) {
        getBridgeByStateToken(setBridge);
        pingTimeout.current = setTimeout(pingForBridge, 1000);
      }
    }
    if (installStarted) {
      if (bridge === undefined){
        pingForBridge()
      }

    }
    return () => {clearInterval(pingTimeout.current)}


  }, [installStarted, bridge])

  return(
    <Button
      variant={"outlined"}
      onClick={openInstallTab}
      color={bridge !== undefined ? 'success': undefined}
      disabled={installLink === undefined}
    >
      {installLink === undefined ? 'Waiting for Install Link...' : 'Add to Slack'}
    </Button>
  )
}
