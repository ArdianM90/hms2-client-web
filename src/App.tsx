import AppRouter from "./routes/AppRouter";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

function App() {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
