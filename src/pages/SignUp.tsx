import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Typography  from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';

export default function SignUp() {
  const [modalStatus, setModalStatus] = useState(false);
  // const [session, setSession] = useState('');
  // const [error, setError] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const { data, error } = await 
    supabase.auth.signUp({
      email: formData.get('email')?.toString() || "",
      password: formData.get('password')?.toString() || ""
    })
    if (error) {
      // setError(error.toString());
      console.warn(error);
    } else {
      console.log(data);
      setModalStatus(true);
      // setSession(data.session);
    //   await supabase
    //     .from('profiles')
    //     .insert([
    //       { 
    //         auth_user_id: data?.session?.user.id,
    //         first_name: formData.get('first_name'),
    //         last_name: formData.get('last_name'),
    //         is_conqueror: formData.get('is_conqueror')
    //       }
    //     ]);
    //  if (formData.get('is_conqueror')) {
    //    console.log("the user is also a conqueror, saving");
    //    await supabase
    //     .from('conquerors')
    //     .insert([
    //       {
    //         first_name: formData.get('first_name'),
    //         last_name: formData.get('last_name'),
    //       }
    //     ]);
    //  } else {
    //   console.log("nothing to do here");
    //  }
    }
  };

  const redirectAfterSignUp = async () => {
    setModalStatus(false);
    navigate("/entrar");
  }
  return (
    <>
      <Modal open={modalStatus} onClose={redirectAfterSignUp}>
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
            Cadastro realizado com sucesso
          </Typography>
          <Typography><strong>Agora você</strong> só precisa confirmar o e-mail cadastrado.</Typography>
        </ModalDialog>
      </Modal>

      <Typography color="primary" fontSize="lg" fontWeight="lg">
          Faça parte dessa comunidade!
      </Typography>
      <Typography
          level="h1"
          fontWeight="xl"
          fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
          Crie sua conta, preencha o formulário abaixo
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2, alignSelf: 'stretch' }}>
        <Input 
          size="lg" 
          type="text" 
          name="nome" 
          placeholder="digite seu nome" 
          sx={{ alignSelf: 'stretch', mt: 2 }} 
          required />
        <Input 
          size="lg" 
          type="email" 
          name="email" 
          placeholder="digite seu email" 
          required />
        <Input size="lg" type="password" name="password" placeholder="digite sua senha" required />
        <Button size="lg" type="submit">
          Cadastrar 
        </Button>
    </Box>

    </>
  );
}