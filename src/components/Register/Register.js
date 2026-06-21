import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { useFormik } from 'formik';
import './Register.scss';

function Register({ open, setOpenRegister, handleClose }) {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: { email: '', password: '', repeatPassword: '' },
    onSubmit: async (values) => {
      setShowSpinner(true);
      setErrorMessage('');
      try {
        await dispatch(registerThunk(values)).unwrap();
        setOpenRegister(false);
      } catch (errorCode) {
        if (errorCode === 'auth/email-already-in-use') {
          setErrorMessage("EMAIL ALREADY IN USE");
        } else if (errorCode === 'auth/weak-password') {
          setErrorMessage('PASSWORD IS TOO WEAK');
        } else {
          setErrorMessage(String(errorCode));
        }
      } finally {
        setShowSpinner(false);
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = 'Field required';
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
        errors.email = 'Not a valid email';
      if (!values.password) errors.password = 'Field required';
      if (!values.repeatPassword) errors.repeatPassword = 'Field required';
      if (values.repeatPassword !== values.password) errors.passwordsNotEqual = "Passwords need to match";
      return errors;
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>Register</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} data-testid="register-form" className='register-form'>
          <Grid container>
            <Grid item md={12}>
              <InputLabel style={{ marginBottom: "15px" }}>Email: </InputLabel>
              <Paper>
                <TextField
                  type="text"
                  id="emailField"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  aria-label="email-field"
                  style={{ width: "100%" }}
                />
                {formik.errors.email && <Alert severity="error">{formik.errors.email}</Alert>}
              </Paper>
            </Grid>
            <Grid item md={12} style={{ marginTop: "15px" }}>
              <InputLabel style={{ marginBottom: "15px" }}>Password: </InputLabel>
              <Paper>
                <TextField
                  type="password"
                  id="pswField"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  aria-label="password-field"
                  style={{ width: "100%" }}
                  autoComplete='new-password'
                />
                {formik.errors.password && <Alert severity="error">{formik.errors.password}</Alert>}
              </Paper>
            </Grid>
            <Grid item md={12} style={{ marginTop: "15px" }}>
              <InputLabel style={{ marginBottom: "15px" }}>Repeat Password: </InputLabel>
              <Paper>
                <TextField
                  type="password"
                  id="rpswField"
                  name="repeatPassword"
                  onChange={formik.handleChange}
                  value={formik.values.repeatPassword}
                  aria-label="repeat-password-field"
                  style={{ width: "100%" }}
                  autoComplete='new-password'
                />
                {formik.errors.repeatPassword && <Alert severity="error">{formik.errors.repeatPassword}</Alert>}
              </Paper>
            </Grid>
          </Grid>
          {errorMessage.length > 0 && <Alert style={{ marginTop: "10px" }} severity="error">{errorMessage}</Alert>}
          {formik.errors.passwordsNotEqual && <Alert style={{ marginTop: "10px" }} severity="error">{formik.errors.passwordsNotEqual}</Alert>}
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
