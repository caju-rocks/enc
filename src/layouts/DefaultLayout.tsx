import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { CssVarsProvider } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
import homeTheme from './theme';

import Box from '@mui/joy/Box';

import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import Sidebar from '../components/Sidebar';

export const BaseLayout:FC = () => {

  return (
    <>
      <CssVarsProvider
        defaultMode="light" 
        disableTransitionOnChange
        theme={homeTheme}
      >
      <GlobalStyles styles={{ }} />
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh'}}>
        <AppHeader />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={(theme) => ({
            '--main-paddingTop': {
              xs: `calc(${theme.spacing(2)} + var(--Header-height, 0px))`,
              md: '32px',
            },
            px: {
              xs: 2,
              md: 3,
            },
            pt: 'var(--main-paddingTop)',
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
            overflow: 'auto',
          })}
        >
          <Outlet />
          <AppFooter />
        </Box>
      </Box>

      </CssVarsProvider>
    </>
  )
}