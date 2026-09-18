import ReactDOM from 'react-dom/client'
import {
  BrowserRouter
} from 'react-router-dom'
import {
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material'

import App from './App'
import './index.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    background: {
      default: '#f4f6f8'
    }
  },
  typography: {
    fontFamily: 'Arial, sans-serif'
  }
})

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
)
