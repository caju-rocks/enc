import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { RequireAuth } from "./auth";

import { BaseLayout } from "./layouts/DefaultLayout.tsx";
import { AuthLayout } from "./layouts/AuthLayout.tsx";
import HomeLayout from "./layouts/HomeLayout";

import { useAuth } from "./hooks.ts";

import Home from "./pages/Home.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Profile from "./pages/Profile.tsx";
import ClimbRoutes from "./pages/routes/Routes.tsx";
import AddClimbRoutes from "./pages/routes/AddRoute.tsx";
import Climbers from "./pages/climbers/Climbers.tsx";
import Sectors from "./pages/sectors/Sectors.tsx";
import SingleSector from "./pages/sectors/SingleSector.tsx";
import AddSectors from "./pages/sectors/AddSector.tsx";
import AddConquerors from "./pages/AddConquerors.tsx";

function App() {
  const { session, profile, getSession, getProfile } = useAuth();

  useEffect(() => {
    if (getSession && !session) {
      getSession();
    }
  }, [getSession, session]);

  useEffect(() => {
    if (!profile && session) {
      getProfile(session?.user?.id);
    }
  }, [getProfile, profile, session]);

  return (
    <>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<BaseLayout />}>
          <Route path="/vias" element={<ClimbRoutes />} />
          <Route
            path="/vias/adicionar"
            element={
              <RequireAuth>
                <AddClimbRoutes />
              </RequireAuth>
            }
          />
          <Route path="/escaladores" element={<Climbers />} />
          <Route
            path="/conquistadores/adicionar"
            element={
              <RequireAuth>
                <AddConquerors />
              </RequireAuth>
            }
          />
          <Route path="/setores" element={<Sectors />} />
          <Route path="/setores/:slug" element={<SingleSector />} />
          <Route
            path="/setores/adicionar"
            element={
              <RequireAuth>
                <AddSectors />
              </RequireAuth>
            }
          />
          <Route path="/perfil" element={<Profile />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/entrar" element={<SignIn />} />
          <Route path="/cadastrar" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
