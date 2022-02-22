import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import Home from '@/pages/Home'
import Workflow from '@/pages/Workflow'
import store from '@/store'

const theme = createTheme({
  palette: {
    primary: {
      light: '#aca5c4',
      main: '#6D6783',
      dark: '#2a263e',
    },
    secondary: {
      light: '#f1d69f',
      main: '#dba00c',
      dark: '#cf7b00',
    },
    background: {
      default: '#e4e4e4',
    },
    error: {
      main: '#bd3200',
    },
  },
})

const App: React.VFC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<Home />} index />
          <Route path='workflows/:id'>
            <Route element={<Workflow />} index />
            <Route element={<Workflow />} path='versions/:version' />
          </Route>
          <Route element={<div>no page</div>} path='*' />
        </Routes>
      </ThemeProvider>
    </Provider>
  )
}

export default App
