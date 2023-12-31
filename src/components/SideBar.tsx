import { Link as RouterLink, useNavigate } from "react-router-dom";

import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { closeSidebar } from "../utils";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TerrainOutlinedIcon from "@mui/icons-material/TerrainOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useAuth } from "../hooks";
import { Button } from "@mui/joy";

export default function Sidebar() {
  const { session, profile, signout } = useAuth();
  const navigate = useNavigate();

  //  if (!auth.session) {
  // auth.getSession();
  // }

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
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 1.5,
        py: 3,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "224px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "256px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",

          opacity: "calc(var(--SideNavigation-slideIn, 0) - 0.2)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography fontWeight="xl">escalada no ceará</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List
          sx={{
            "--ListItem-radius": "8px",
            "--List-gap": "4px",
            "--List-nestedInsetStart": "40px",
          }}
        >
          <ListItem>
            <ListItemButton component={RouterLink} to="/">
              <ListItemDecorator>
                <HomeOutlinedIcon sx={{ fontWeight: "lighter" }} />
              </ListItemDecorator>
              <ListItemContent>Página Inicial</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={RouterLink} to="/vias">
              <ListItemDecorator>
                <TerrainOutlinedIcon />
              </ListItemDecorator>
              <ListItemContent>Vias</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={RouterLink} to="/setores">
              <ListItemDecorator>
                <PlaceOutlinedIcon />
              </ListItemDecorator>
              <ListItemContent>Setores</ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton component={RouterLink} to="/escaladores">
              <ListItemDecorator>
                <GroupOutlinedIcon />
              </ListItemDecorator>
              <ListItemContent>Escaladores</ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": "8px",
            "--List-gap": "8px",
          }}
        ></List>
      </Box>
      <Divider />
      {session?.user.email ? (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Link
            underline="none"
            component={RouterLink}
            to="/perfil"
            sx={{ color: "text.primary" }}
          >
            <Avatar variant="outlined">
              {handleProfileName(profile?.name)}
            </Avatar>
          </Link>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Link
              underline="none"
              component={RouterLink}
              to="/perfil"
              sx={{ color: "text.primary" }}
            >
              <Typography fontSize="sm" fontWeight="lg">
                {profile?.name ? profile?.name : "Complete seu cadastro"}
              </Typography>
            </Link>
            <Typography level="body-xs">{session?.user?.email}</Typography>
          </Box>
          <IconButton variant="plain" color="danger" onClick={handleLogout}>
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "block", gap: 4, alignItems: "center" }}>
          <Button
            component={RouterLink}
            to="/entrar"
            color="neutral"
            sx={{ width: "100%", mb: 1 }}
          >
            Faça o Login
          </Button>

          <Button
            component={RouterLink}
            to="/cadastrar"
            color="neutral"
            sx={{ width: "100%" }}
          >
            Cadastre-se
          </Button>
        </Box>
      )}
    </Sheet>
  );
}
