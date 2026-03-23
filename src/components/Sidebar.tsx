import * as React from 'react';

import { Link as RouterLink, useNavigate } from "react-router-dom";

import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TerrainOutlinedIcon from '@mui/icons-material/TerrainOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';

import { useAuth } from "../hooks";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {

  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const { session, profile, signout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    signout(() => navigate("/"));
  };

  const handleProfileName = (name: string) => {
    if (name) {
      const initials = name.match(/\b(\w)/g);
      if (initials === null) {
        return null;
      }
      return initials.join("");
    }
  };
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.4s',
        zIndex: 10000,
        height: '100dvh',
        width: 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography level="title-lg">Esc. no Ceará</Typography>
        <ColorSchemeToggle sx={{ ml: 'auto' }} />
      </Box>

      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            '--List-nestedInsetStart': '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton component={RouterLink} to="/">
              <HomeOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Página Inicial</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={RouterLink} to="/vias">
              <TerrainOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Vias</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={RouterLink} to="/setores">
              <PlaceOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Setores</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton component={RouterLink} to="/escaladores">
              <GroupOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Escaladores</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          {session?.user.email ? (
          <ListItem nested>
            <Toggler
              defaultExpanded
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <ManageAccountsOutlinedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Conta</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={{ transform: open ? 'rotate(180deg)' : 'none' }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton component={RouterLink} to="/perfil">
                    Meu Perfil
                  </ListItemButton>
                </ListItem>

                {/* <ListItem>
                  <ListItemButton>Criar novo usuário</ListItemButton>
                </ListItem> */}

              </List>
            </Toggler>
          </ListItem>
          ) : (
          <ListItem>
            <ListItemButton component={RouterLink} to="/entrar">
              <LoginOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Entrar / Cadastrar</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          )}

          <Divider orientation='horizontal' />
          <ListItem>
            <ListItemButton component={RouterLink} to="/#">
              <SupportOutlinedIcon />
              <ListItemContent>
                <Typography level="title-sm">Suporte</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': '8px',
            mb: 2,
          }}
        >
        </List>

        {/* <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: 'none' }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="title-sm">Used space</Typography>
            <IconButton size="sm">
              <CloseOutlinedIcon />
            </IconButton>
          </Stack>
          <Typography level="body-xs">
            Your team has used 80% of your available space. Need more?
          </Typography>
          <LinearProgress variant="outlined" value={80} determinate sx={{ my: 1 }} />
          <Button size="sm" variant="solid">
            Upgrade plan
          </Button>
        </Card> */}

      </Box>

      {session?.user.email ? (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>

        <Avatar
          variant="outlined"
          size="sm" >
            {handleProfileName(profile?.name)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{profile?.name}</Typography>
          <Typography level="body-xs">{session?.user?.email}</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral" onClick={handleLogout}>
          <LogoutOutlinedIcon />
        </IconButton>
      </Box>
      ) : (<></>)}
    </Sheet>
  );
}
