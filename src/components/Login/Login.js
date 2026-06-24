import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginThunk } from '../../store/authSlice';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function Login({ open, setOpenLogin, handleClose }) {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setShowSpinner(true);
    setErrorMessage('');
    try {
      await dispatch(loginThunk(values)).unwrap();
      setOpenLogin(false);
    } catch (errorCode) {
      if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password');
      } else {
        setErrorMessage(String(errorCode));
      }
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: 'center' }}>Login</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
          <Grid container direction="row">
            <Grid item md={12}>
              <InputLabel style={{ marginBottom: '15px' }}>Email: </InputLabel>
              <Paper>
                <TextField
                  type="text"
                  id="emailField"
                  aria-label="email-field"
                  style={{ width: '100%' }}
                  {...register('email', {
                    required: 'Field required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Username should be an email' },
                  })}
                />
                {errors.email && <Alert severity="error">{errors.email.message}</Alert>}
              </Paper>
            </Grid>
            <Grid item md={12} style={{ marginTop: '15px' }}>
              <InputLabel style={{ marginBottom: '15px' }}>Password: </InputLabel>
              <Paper>
                <TextField
                  type="password"
                  id="pswField"
                  aria-label="password-field"
                  style={{ width: '100%' }}
                  {...register('password', { required: 'Field required' })}
                />
                {errors.password && <Alert severity="error">{errors.password.message}</Alert>}
              </Paper>
            </Grid>
          </Grid>
          {errorMessage.length > 0 && <Alert style={{ marginTop: '10px' }} severity="error">{errorMessage}</Alert>}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Login</Button>
            {showSpinner && <CircularProgress />}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
