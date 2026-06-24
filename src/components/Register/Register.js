import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { registerThunk } from '../../store/authSlice';
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
import './Register.scss';

function Register({ open, setOpenRegister, handleClose }) {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', repeatPassword: '' },
  });

  const onSubmit = async (values) => {
    setShowSpinner(true);
    setErrorMessage('');
    try {
      await dispatch(registerThunk(values)).unwrap();
      setOpenRegister(false);
    } catch (errorCode) {
      if (errorCode === 'auth/email-already-in-use') {
        setErrorMessage('EMAIL ALREADY IN USE');
      } else if (errorCode === 'auth/weak-password') {
        setErrorMessage('PASSWORD IS TOO WEAK');
      } else {
        setErrorMessage(String(errorCode));
      }
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: 'center' }}>Register</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} data-testid="register-form" className="register-form">
          <Grid container>
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
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Not a valid email' },
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
                  autoComplete="new-password"
                  {...register('password', { required: 'Field required' })}
                />
                {errors.password && <Alert severity="error">{errors.password.message}</Alert>}
              </Paper>
            </Grid>
            <Grid item md={12} style={{ marginTop: '15px' }}>
              <InputLabel style={{ marginBottom: '15px' }}>Repeat Password: </InputLabel>
              <Paper>
                <TextField
                  type="password"
                  id="rpswField"
                  aria-label="repeat-password-field"
                  style={{ width: '100%' }}
                  autoComplete="new-password"
                  {...register('repeatPassword', {
                    required: 'Field required',
                    validate: (val) => val === watch('password') || 'Passwords need to match',
                  })}
                />
                {errors.repeatPassword && <Alert severity="error">{errors.repeatPassword.message}</Alert>}
              </Paper>
            </Grid>
          </Grid>
          {errorMessage.length > 0 && <Alert style={{ marginTop: '10px' }} severity="error">{errorMessage}</Alert>}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Create account</Button>
            {showSpinner && <CircularProgress />}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Register;
