import * as React from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';

import ManagePanel from "./panels/managePanel";
import JoinPanel from "./panels/joinPanel";
import TabPanel from "./tabPanel";

const StyledTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: "#DED03A"
    }
})

export default function ModePanel() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
        <StyledTabs variant="fullWidth"
              value={value}
              className={"ModePanel"}
              onChange={handleChange}
              selectionFollowsFocus>
            {/*<TabsList className={"TabsList"}>*/}
                <Tab className={"Tab"} label={"Join Group"}></Tab>
                <Tab className={"Tab"} label={"Create Group"}></Tab>
            {/*</TabsList>*/}

        </StyledTabs>

        <TabPanel value={value} index={0}><JoinPanel/></TabPanel>
        <TabPanel value={value} index={1}><ManagePanel/></TabPanel>
        </Box>
    );
}
