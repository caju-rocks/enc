import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { supabase } from "../../supabaseClient";

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Stack from '@mui/joy/Stack';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Snackbar from '@mui/joy/Snackbar';
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';
import { Tooltip } from "@mui/joy";

import QuestionMarkOutlined from "@mui/icons-material/QuestionMarkOutlined";

// import DropZone from './DropZone';
// import FileUpload from './FileUpload';
// import CountrySelector from './CountrySelector';

export default function ClimberInfo() {

  const { session, profile } = useAuth();
  const [is_conqueror, setIsConqueror] = useState(profile?.is_conqueror);
  const [is_partner, setIsPartner] = useState(profile?.is_partner);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const duration = 500;

  useEffect(() => {
    if (!session && !profile) {
      console.log(profile);
      setIsConqueror(session?.is_conqueror);
      setIsPartner(session?.is_partner);
    }
  }, [profile, session]);

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

    const name = profile?.name;
    const formData = new FormData(event.currentTarget);
    const is_conqueror = formData.get("is_conqueror");
    const is_partner = formData.get("is_partner");

    // TODO check why this is broken
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
        is_conqueror,
        is_partner,
      })
      .eq("id", session?.user.id)
      .select();
    if (error) {
      // setError(error.toString());
      setOpenError(true);
    } else {
      setOpenSuccess(true);
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
    <form method="post" onSubmit={handleSubmit}>
    <Box sx={{ flex: 1, width: '100%' }}>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography level="title-md">Escalador(a)</Typography>
            <Typography level="body-sm">
              Marque as opções que você se identifica
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 1 }}>
            <FormControl sx={{ display: { sm: "contents" } }}>
              <Tooltip placement="right" variant="outlined" title={
                <FormHelperText>
                  Ao selecionar Sim, seu nome será adicionado na lista de<br />
                  conquistadores e poderá ser utilizado sempre que alguém<br />
                  adicionar uma nova via.
                </FormHelperText>
              }>
                <FormLabel>
                  Já conquistou via<QuestionMarkOutlined fontSize="sm" />
                </FormLabel>
              </Tooltip>
              <FormLabel></FormLabel>
              <FormHelperText>
              </FormHelperText>
              <RadioGroup
                name="is_conqueror"
                value={is_conqueror}
                sx={{ gap: 2.0 }}
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
            </FormControl>

            <FormControl sx={{ display: { sm: "contents" } }}>
              <Tooltip placement="right" variant="outlined" title={
                <FormHelperText>
                  Ao selecionar Sim, seu nome será destacado na lista de <br />
                  escaladores, outros escaladores ficarão mais a <br />
                  vontade pra te chamar pra escalar.
                </FormHelperText>
              }>
                <FormLabel>
                  Está disponível para ser parceiro de escalada<QuestionMarkOutlined fontSize="sm" />
                </FormLabel>
              </Tooltip>
              <RadioGroup
                name="is_partner"
                value={is_partner}
                sx={{ gap: 2.0 }}
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
            </FormControl>
          </Stack>

          <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
              <Button size="sm" variant="outlined" color="neutral">
                Cancelar
              </Button>
              <Button size="sm" variant="solid" type="submit">
                Salvar
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
    </Box>
    </form>
    </>
  );
}