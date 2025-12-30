import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Shipments } from "./pages/Shipments.jsx";
import { Container } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Container maxWidth="xl" sx={{ p: 0, m: 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
          </Routes>
        </Container>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
