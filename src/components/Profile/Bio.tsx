import { useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { supabase } from "../../supabaseClient";

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormHelperText from '@mui/joy/FormHelperText';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

export default function Bio() {

  const { session, profile } = useAuth();

  useEffect(() => {
    if (!session && !profile) {
      console.log("ieeii");
    }
  }, [profile, session]);

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Card>
        <Box sx={{ mb: 1 }}>
          <Typography level="title-md">Bio</Typography>
          <Typography level="body-sm">
            Escreva uma pequena biografia para aparecer no seu perfil
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={2} sx={{ my: 1 }}>
          <Textarea
            size="sm"
            minRows={4}
            sx={{ mt: 1.5 }}
            defaultValue=""
          />
        </Stack>
        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
            <Button size="sm" variant="outlined" color="neutral">
              Cancelar
            </Button>
            <Button size="sm" variant="solid">
              Salvar
            </Button>
          </CardActions>
        </CardOverflow>
      </Card>
    </Box>
  );
}