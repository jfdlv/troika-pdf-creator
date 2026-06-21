import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { useFormik } from 'formik';

export default function Login({ open, setOpenLogin, handleClose }) {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: async (values) => {
      setShowSpinner(true);
      setErrorMessage('');
      try {
        await dispatch(loginThunk(values)).unwrap();
        setOpenLogin(false);
      } catch (errorCode) {
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          setErrorMessage("Invalid email or password");
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
        errors.email = 'Username should be an email';
      if (!values.password) errors.password = 'Field required';
      return errors;
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>Login</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} data-testid="login-form">
          <Grid container direction="row">
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
                />
                {formik.errors.password && <Alert severity="error">{formik.errors.password}</Alert>}
              </Paper>
            </Grid>
          </Grid>
          {errorMessage.length > 0 && <Alert style={{ marginTop: "10px" }} severity="error">{errorMessage}</Alert>}
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
