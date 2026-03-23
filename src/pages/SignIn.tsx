import React from 'react';

import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { Divider } from '@mui/joy';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAuth();
  const from = location.state?.from?.pathname || "/vias";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") || "";
    const password = formData.get("password") || "";
    const credential = {
      email, password
    };

    auth.signin(credential, () => {
      navigate(from, { replace: true });
    })
  };

  return (
    <>
    <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
    >
        Encontre croquis, escaladores e dicas sobre os setores
    </Typography>

    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, alignSelf: 'stretch' }}>
        <Input 
          size="lg" 
          type="email" 
          name="email" 
          placeholder="digite seu email" 
          sx={{ alignSelf: 'stretch', mt: 2 }} 
          required />
        <Input size="lg" type="password" name="password" placeholder="digite sua senha" required />
        <Button size="lg" type="submit">
          Acessar
        </Button>
        <Link fontSize="sm" href="/cadastrar" fontWeight="lg">
          Clique aqui se você esqueceu sua senha.
        </Link>
    </Box>
    <Divider />
    <Box
      sx={{
        display: 'grid',
        alignSelf: 'stretch'
      }}
    >
        <Button size="lg" color="success" component={RouterLink} to="/cadastrar">
          Ainda não tem uma conta? Crie uma agora
        </Button>
    </Box>   
    </>
  );
}
