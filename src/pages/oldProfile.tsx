import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { supabase } from "../supabaseClient";

import Autocomplete from "@mui/joy/Autocomplete";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import { chipClasses } from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Typography from "@mui/joy/Typography";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";

import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import { STATE_ID_MAP } from "../utils";

export default function Profile() {
  // const auth = useAuth();
  const { session, profile } = useAuth();
  const [allStates, setAllStates] = useState([] as string[]);
  const [allCities, setAllCities] = useState([] as string[]);
  const [email, setEmail] = useState(session?.user?.email);
  const [name, setName] = useState(profile?.name);
  const [state, setState] = useState(profile?.state_name);
  const [city, setCity] = useState(profile?.city_name);
  const [is_conqueror, setIsConqueror] = useState(profile?.is_conqueror);
  const [is_partner, setIsPartner] = useState(profile?.is_partner);
  const [modalStatus, setModalStatus] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!session && !profile) {
      setEmail(session?.user?.email);
      setName(profile?.name);
      setState(profile?.state_name);
      setIsPartner(profile?.is_partner);
      setIsConqueror(profile?.is_conqueror);
      setCity(profile?.city_name);
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

  const handleIsConquerorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsConqueror(event.target.value);
  };

  const handleIsPartnerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPartner(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const is_conqueror = formData.get("is_conqueror");
    const is_partner = formData.get("is_partner");

    if (is_conqueror === "Sim") {
      console.log("salvando como conquistador");
      const { data, error } = await supabase.from("conquerors").upsert({
        id: session?.user?.id,
        name,
      });
      if (error) {
        console.warn(error);
      } else {
        console.log(data);
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        name,
        is_conqueror,
        is_partner,
        state_name: state,
        city_name: city,
        state_id: state.id,
      })
      .eq("id", session?.user.id)
      .select();
    if (error) {
      // setError(error.toString());
      console.warn(error);
    } else {
      setModalStatus(true);
      console.log(data);
    }
  };

  const refreshAfterSave = async () => {
    setModalStatus(false);
    navigate("/perfil");
  };

  return (
    <>
      <Modal open={modalStatus} onClose={refreshAfterSave}>
        <ModalDialog>
          <ModalClose />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Perfil salvo com sucesso
          </Typography>
          <Typography>
            <strong>Navegue</strong> um pouco pelo site e veja os croquis
            disponíveis.
          </Typography>
        </ModalDialog>
      </Modal>
      <Box
        sx={{
          flex: 1,
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
        }}
      >
        <Typography level="h1" fontSize="xl2" sx={{ mb: 1 }}>
          Meu perfil
        </Typography>
        <Tabs defaultValue={0} sx={{ bgcolor: "transparent" }}>
          <Box
            sx={{
              "--_shadow-height": "16px",
              height: 0,
              position: "sticky",
              top: "calc(48px - var(--main-paddingTop, 0px) + var(--Header-height, 0px) - (var(--_shadow-height) / 2))",
              zIndex: 1,
              "&::before": {
                content: '""',
                display: "block",
                position: "relative",
                zIndex: 1,
                height: "var(--_shadow-height)",
                background:
                  "radial-gradient(closest-side, rgba(0 0 0 / 0.12), transparent 100%)",
              },
            }}
          />
          <TabList
            sticky="top"
            variant="plain"
            sx={(theme) => ({
              "--Chip-minHeight": "20px",
              "--ListItem-minHeight": "48px",
              top: "calc(-1 * (var(--main-paddingTop, 0px) - var(--Header-height, 0px)))",
              zIndex: 10,
              width: "100%",
              overflow: "auto hidden",
              alignSelf: "flex-start",
              scrollSnapType: "inline",
              "&::after": {
                pointerEvents: "none",
                display: { xs: "block", sm: "none" },
                content: '""',
                position: "sticky",
                top: 0,
                width: 40,
                flex: "none",
                zIndex: 1,
                right: 0,
                borderBottom: "1px solid transparent",
                background: `linear-gradient(to left, ${theme.vars.palette.background.body}, rgb(0 0 0 / 0))`,
                backgroundClip: "content-box",
              },
              "&::-webkit-scrollbar": {
                width: 0,
                display: "none",
              },
              [`& .${tabClasses.root}`]: {
                "--focus-outline-offset": "-2px",
                "&:first-of-type": {
                  ml: "calc(-1 * var(--ListItem-paddingX))",
                },
                scrollSnapAlign: "start",
                bgcolor: "transparent",
                flex: "none",
                "&:hover": {
                  bgcolor: "transparent",
                },
                [`&.${tabClasses.selected}`]: {
                  color: "primary.plainColor",
                  bgcolor: "transparent",
                  [`& .${chipClasses.root}`]: theme.variants.solid.primary,
                },
              },
            })}
          >
            <Tab value={0}>Detalhes da conta</Tab>
          </TabList>
          <form method="post" onSubmit={handleSubmit}>
            <Box
              sx={{
                pt: 3,
                pb: 10,
                display: "grid",
                gridTemplateColumns: {
                  xs: "100%",
                  sm: "minmax(120px, 30%) 1fr",
                  lg: "280px 1fr minmax(120px, 208px)",
                },
                columnGap: { xs: 2, sm: 3, md: 4 },
                rowGap: { xs: 2, sm: 2.5 },
                "& > hr": {
                  gridColumn: "1/-1",
                },
              }}
            >
              <FormControl sx={{ display: { sm: "contents" } }}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  disabled
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <Divider role="presentation" />

              <FormLabel sx={{ display: { xs: "none", sm: "block" } }}>
                Nome
              </FormLabel>
              <Box sx={{ display: { xs: "contents", sm: "flex" }, gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel sx={{ display: { sm: "none" } }}>Nome</FormLabel>
                  <Input
                    name="name"
                    placeholder="Nome e sobrenome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
              </Box>

              <Divider role="presentation" />

              <FormLabel sx={{ display: { xs: "none", sm: "block" } }}>
                Estado e Cidade
              </FormLabel>
              <Box sx={{ display: { xs: "contents", sm: "flex" }, gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel sx={{ display: { sm: "none" } }}>Estado</FormLabel>
                  <Autocomplete
                    placeholder="Escolha o seu Estado de origem"
                    value={state}
                    options={allStates}
                    onChange={(_, newStateValue) => {
                      updateCities(newStateValue);
                      setState(newStateValue);
                    }}
                  />
                </FormControl>
                <FormControl sx={{ flex: 1 }}>
                  <FormLabel sx={{ display: { sm: "none" } }}>
                    Sobrenome
                  </FormLabel>
                  <Autocomplete
                    placeholder="Escolha a Cidade de origem"
                    value={city}
                    options={allCities}
                    onChange={(_, newCityValue) => {
                      setCity(newCityValue);
                    }}
                  />
                </FormControl>
              </Box>

              {/* <Box>
              <FormLabel>Your photo</FormLabel>
              <FormHelperText>This will be displayed on your profile.</FormHelperText>
            </Box> 
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2.5,
              }}
            >
              <Avatar
                size="lg"
                src="/static/images/avatar/1.jpg"
                sx={{ '--Avatar-size': '64px' }}
              />
            </Box>

            <Divider role="presentation" />
            */}

              <Divider role="presentation" />

              <FormControl sx={{ display: { sm: "contents" } }}>
                <FormLabel>Já conquistou via?</FormLabel>
                <RadioGroup
                  name="is_conqueror"
                  value={is_conqueror}
                  sx={{ gap: 1.0 }}
                >
                  <Sheet
                    key="Sim"
                    sx={{
                      p: 1,
                      borderRadius: "md",
                      boxShadow: "sm",
                    }}
                  >
                    <Radio
                      label="Sim"
                      overlay
                      disableIcon
                      checked={is_conqueror === "Sim"}
                      value="Sim"
                      onChange={handleIsConquerorChange}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            color: checked ? "text.primary" : "text.secondary",
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              "--variant-borderWidth": "2px",
                              "&&": {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                  <Sheet
                    key="Não"
                    sx={{
                      p: 1,
                      borderRadius: "md",
                      boxShadow: "sm",
                    }}
                  >
                    <Radio
                      label="Não"
                      overlay
                      disableIcon
                      checked={is_conqueror == "Não"}
                      value="Não"
                      onChange={handleIsConquerorChange}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            color: checked ? "text.primary" : "text.secondary",
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              "--variant-borderWidth": "2px",
                              "&&": {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                </RadioGroup>
                <FormHelperText>
                  Ao selecionar Sim, seu nome será adicionado na lista de
                  conquistadores e poderá ser utilizado sempre que alguém
                  adicionar uma nova via.
                </FormHelperText>
              </FormControl>

              <Divider role="presentation" />

              <FormControl sx={{ display: { sm: "contents" } }}>
                <FormLabel>
                  Está disponível para ser parceiro de escalada?
                </FormLabel>
                <RadioGroup
                  name="is_partner"
                  value={is_partner}
                  sx={{ gap: 1.0 }}
                >
                  <Sheet
                    key="Sim"
                    sx={{
                      p: 1,
                      borderRadius: "md",
                      boxShadow: "sm",
                    }}
                  >
                    <Radio
                      label="Sim"
                      overlay
                      disableIcon
                      checked={is_partner === "Sim"}
                      value="Sim"
                      onChange={handleIsPartnerChange}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            color: checked ? "text.primary" : "text.secondary",
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              "--variant-borderWidth": "2px",
                              "&&": {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                  <Sheet
                    key="Não"
                    sx={{
                      p: 1,
                      borderRadius: "md",
                      boxShadow: "sm",
                    }}
                  >
                    <Radio
                      label="Não"
                      overlay
                      disableIcon
                      checked={is_partner == "Não"}
                      value="Não"
                      onChange={handleIsPartnerChange}
                      slotProps={{
                        label: ({ checked }) => ({
                          sx: {
                            color: checked ? "text.primary" : "text.secondary",
                          },
                        }),
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              "--variant-borderWidth": "2px",
                              "&&": {
                                // && to increase the specificity to win the base :hover styles
                                borderColor: theme.vars.palette.primary[500],
                              },
                            }),
                          }),
                        }),
                      }}
                    />
                  </Sheet>
                </RadioGroup>
                <FormHelperText>
                  Ao selecionar Sim, seu nome será destacado na lista de
                  escaladores, outros escaladores ficarão mais a vontade pra te
                  chamar pra escalar.
                </FormHelperText>
              </FormControl>

              <Divider role="presentation" />

              <Box
                sx={{
                  gridColumn: "1/-1",
                  justifySelf: "flex-end",
                  display: "flex",
                  gap: 1,
                }}
              >
                <Button variant="outlined" color="neutral">
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </Box>
            </Box>
          </form>
        </Tabs>
      </Box>
    </>
  );
}
