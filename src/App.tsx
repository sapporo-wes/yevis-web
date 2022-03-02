import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router-dom'

import Detail from '@/pages/Detail'
import Home from '@/pages/Home'
import store from '@/store'

const theme = createTheme({
  palette: {
    background: {
      default: '#e4e4e4',
    },
    error: {
      main: '#bd3200',
    },
    primary: {
      dark: '#2a263e',
      light: '#aca5c4',
      main: '#6D6783',
    },
    secondary: {
      dark: '#cf7b00',
      light: '#f1d69f',
      main: '#dba00c',
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
            <Route element={<Detail />} index />
            <Route element={<Detail />} path='versions/:version' />
          </Route>
          <Route element={<div>no page</div>} path='*' />
        </Routes>
      </ThemeProvider>
    </Provider>
  )
}

export default App
