import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
    background: {
      default: "#f4f7fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "'Vazirmatn', Arial, sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
