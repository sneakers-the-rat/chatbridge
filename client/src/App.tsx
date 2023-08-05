import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from "@mui/material/colors";


const theme = createTheme({
    palette:{
        primary: yellow,
        mode: "dark"
    }
})

import ModePanel from "./components/modePanel";

function App() {
  return (
      <ThemeProvider theme={theme}>
      <div className={"App-Container"}>
        <div className="App">
          <header className="App-header">
            ChatBridge
          </header>
          <ModePanel/>
        </div>
      </div>
      </ThemeProvider>
  );
}

export default App;
