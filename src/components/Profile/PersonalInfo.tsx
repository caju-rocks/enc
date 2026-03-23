import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { supabase } from "../../supabaseClient";

import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Snackbar from '@mui/joy/Snackbar';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Autocomplete } from "@mui/joy";

import { STATE_ID_MAP } from "../../utils";

export default function PersonalInfo() {

  const { session, profile } = useAuth();
  const [name, setName] = useState(profile?.name);
  const [email, setEmail] = useState(session?.user?.email);
  const [state, setState] = useState(profile?.state_name);
  const [city, setCity] = useState(profile?.city_name);
  const [allStates, setAllStates] = useState([] as string[]);
  const [allCities, setAllCities] = useState([] as string[]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const duration = 500;

  useEffect(() => {
    if (!session && !profile) {
        setEmail(session?.user?.email);
        setName(profile?.name);
        setState(profile?.state_name);
    }
  }, [profile, session]);

  useEffect(() => {
    const fetchData = async () => {
      const statesResponse = await supabase.from("states").select("name");

      setAllStates(statesResponse?.data?.map((state) => state.name) || []);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (state) {
      const fetchData = async () => {
        const citiesResponse = await supabase
          .from("cities")
          .select("name")
          .eq("state_id", STATE_ID_MAP[state as keyof typeof STATE_ID_MAP]);

        setAllCities(citiesResponse?.data?.map((city) => city.name) || []);
      };
      fetchData();
    }
  }, [state]);

  const updateCities = async (state: string) => {
    const fetchData = async () => {
      const citiesResponse = await supabase
        .from("cities")
        .select("name")
        .eq("state_id", STATE_ID_MAP[state as keyof typeof STATE_ID_MAP]);

      setAllCities(citiesResponse?.data?.map((city) => city.name) || []);
    };
    fetchData();
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("oiii");
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        state_name: state,
        city_name: city,
        state_id: state.id,
      })
      .eq("id", session?.user.id)
      .select();
    if (error) {
      console.warn(error);
    } else {
      console.log(data);
    }
  };

  return (
    <>
      <Snackbar
        open={openSuccess}
        color="success"
        autoHideDuration={duration}
        variant="solid"
        endDecorator={
          <Button
            onClick={() => setOpenSuccess(false)}
            size="sm"
            variant="soft"
            color="success"
          >
            Fechar 
          </Button>
        }
      >
        Informações salvas.
      </Snackbar>
      <Snackbar
        open={openError}
        color="danger"
        autoHideDuration={duration}
        variant="solid"
        endDecorator={
          <Button
            onClick={() => setOpenError(false)}
            size="sm"
            variant="soft"
            color="danger"
          >
            Fechar 
          </Button>
        }
      >
        Acontenceu algum problema.
      </Snackbar>
    <form method="post" onSubmit={handleSubmit}></form>
    <Box sx={{ flex: 1, width: '100%' }}>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Informação pessoal</Typography>
            <Typography level="body-sm">
              Complemente as informações abaixo. Elas ficam visíveis para os outros usuários.
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={3}
            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
              >
                <Avatar
                    variant="outlined"
                    size="sm" >
                    {handleProfileName(profile?.name)}
                </Avatar>
              </AspectRatio>
              {/* <IconButton
                aria-label="upload de nova foto"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: 'background.body',
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: '50%',
                  left: 100,
                  top: 170,
                  boxShadow: 'sm',
                }}
              >
                <EditRoundedIcon />
              </IconButton> */}
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack spacing={1}>
                <FormLabel>Nome</FormLabel>
                <FormControl
                  sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                >
                  <Input size="sm" placeholder="nome e sobrenome" sx={{ flexGrow: 1 }} value={name} />
                </FormControl>

                <FormLabel>Email</FormLabel>
                <FormControl
                  sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                >
                  <Input size="sm" type="email" disabled placeholder="email" startDecorator={<EmailRoundedIcon />} sx={{ flexGrow: 1 }} value={email} onChange={(e) => setEmail(e.target.value)}/>
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={2}>
                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Autocomplete
                    size="sm"
                    placeholder="Escolha o seu Estado..."
                    value={state}
                    options={allStates}
                    onChange={(_, newStateValue) => {
                      updateCities(newStateValue);
                      setState(newStateValue);
                    }}
                  >
                  </Autocomplete>
                </FormControl>
                <FormControl sx={{ flexGrow: 1 }}>
                  <FormLabel>Cidade</FormLabel>
                  <Autocomplete
                    size="sm"
                    placeholder="agora a cidade..."
                    value={city}
                    options={allCities}
                    onChange={(_, newCityValue) => { setCity(newCityValue); }}
                  >
                  </Autocomplete>
                </FormControl>
              </Stack>
              <div>
                {/* <CountrySelector /> */}
              </div>
            </Stack>
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            sx={{ display: { xs: 'flex', md: 'none' }, my: 1 }}
          >
            <Stack direction="row" spacing={2}>
              <Stack direction="column" spacing={1}>
                <AspectRatio
                  ratio="1"
                  maxHeight={108}
                  sx={{ flex: 1, minWidth: 108, borderRadius: '100%' }}
                >
                    <Avatar
                        variant="outlined"
                        size="sm" >
                        {handleProfileName(profile?.name)}
                    </Avatar>
                </AspectRatio>
                {/* <IconButton
                  aria-label="upload de nova foto"
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  sx={{
                    bgcolor: 'background.body',
                    position: 'absolute',
                    zIndex: 2,
                    borderRadius: '50%',
                    left: 85,
                    top: 180,
                    boxShadow: 'sm',
                  }}
                >
                  <EditRoundedIcon />
                </IconButton> */}
              </Stack>
              <Stack spacing={1} sx={{ flexGrow: 1 }}>
                <FormLabel>Nome</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: 'flex-column',
                      md: 'flex-row',
                    },
                    gap: 2,
                  }}
                >
                  <Input size="sm" placeholder="nome e sobrenome" />
                </FormControl>
                <FormLabel>E-mail</FormLabel>
                <FormControl
                  sx={{
                    display: {
                      sm: 'flex-column',
                      md: 'flex-row',
                    },
                    gap: 2,
                  }}
                >
                  <Input size="sm" placeholder="e-mail" value={email} />
                </FormControl>
              </Stack>
            </Stack>
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <Autocomplete
                size="sm"
                placeholder="Escolha o seu Estado..."
                value={state}
                options={allStates}
                onChange={(_, newStateValue) => {
                  updateCities(newStateValue);
                  setState(newStateValue);
                }}
              >
              </Autocomplete>
            </FormControl>
            <FormControl sx={{ flexGrow: 1 }}>
              <FormLabel>Cidade</FormLabel>
              <Autocomplete
                size="sm"
                placeholder="agora a cidade..."
                value={city}
                options={allCities}
                onChange={(_, newCityValue) => { setCity(newCityValue); }}
              >
              </Autocomplete>
            </FormControl>
            <div>
              {/* <CountrySelector /> */}
            </div>
          </Stack>
          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button size="sm" variant="solid" type="submit">
                Salvar
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
    </Box>
    </>
  );
}