import React, {useState} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from "@mui/material/colors";
import GitHubIcon from '@mui/icons-material/GitHub';
import ModePanel from "./components/modePanel";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import InfoModal from "./components/modals/infoModal";
import {Info} from "@mui/icons-material";

const REPO_URL = "https://github.com/sneakers-the-rat/chatbridge"


const theme = createTheme({
    palette:{
        primary: yellow,
        mode: "dark",
    }
})






function App() {

    const [infoOpen, setInfoOpen] = useState(false);

    const handleInfo = () => {
        setInfoOpen(!infoOpen)
    }


        return (
      <ThemeProvider theme={theme}>
      <div className={"App-Container"}>
        <div className="App">
          <div className={"App-header-bar"}>
            <header className="App-header">
              ChatBridge
            </header>
              <div className={"header-padding"}/>
              <Button
                  className={"App-header-item"}
                variant="contained"
                aria-label={"source code"}
                color={"primary"}
                  onClick={handleInfo}
                >
                  INFO
              </Button>
              <Button
                  variant="contained"
                  aria-label={"source code"}
                  color={"primary"}
                  href={REPO_URL}
              >
                  <GitHubIcon/>
              </Button>

          </div>
          <ModePanel/>
            <InfoModal open={infoOpen} setOpen={setInfoOpen}/>
        </div>
      </div>
      </ThemeProvider>
  );
}

export default App;
