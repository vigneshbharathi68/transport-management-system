// Create a dashboard page for the transport frontend application that will have 4 navigateion actions at left navigation and it should be 10% of width of whole page and right side we will be showing the component based on teh option selection
import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Shipments } from "./Shipments.jsx";
import { Transports } from "./Transports.jsx";
import { VehiclesTypes } from "./VehiclesTypes.jsx";
import { Materials } from "./Materials.jsx";
const navigationItems = [
  { text: "Transports", component: <Transports /> },
  { text: "VehicleTypes", component: <VehiclesTypes /> },
  { text: "Materials", component: <Materials /> },
  { text: "Shipments", component: <Shipments /> },
];
export const Dashboard = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };
  return (
    <Box display="flex" height="100vh">
      <Box bgcolor="grey.200" p={1} width="15%">
        <Typography variant="h6" gutterBottom>
          Transport management System
        </Typography>
        <List>
          {navigationItems.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={selectedIndex === index}
                onClick={() => handleListItemClick(index)}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box flexGrow={1} p={2} overflow="auto">
        {navigationItems[selectedIndex].component}
      </Box>
    </Box>
  );
};
