import React, {useContext, useState} from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useFormik} from 'formik';
import {Store} from "../../AppState/Store";

import Alert from '@mui/material/Alert';

export default function Login(props)  {

  const { actions } = useContext(Store);

  const  [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log(values);
      setShowSpinner(true);
      actions.logIn(values,
        { setShowSpinner, setErrorMessage },
        {setOpenLogin: props.setOpenLogin});
    },
    validate: (values) => {
      let errors = {}
      if (!values.email) errors.email = 'Field required'
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
        errors.email = 'Username should be an email'
      if (!values.password) errors.password = 'Field required'
      return errors
    },
  })

  return <Dialog open={props.open} onClose={props.handleClose}>
  <DialogTitle style={{textAlign: "center"}}>Login</DialogTitle>
  <DialogContent>
    <form onSubmit={formik.handleSubmit} data-testid="login-form">
        <Grid container direction="row" >
        {/* <div className="mb-3"> */}
          <Grid item md={12}>
            <InputLabel style={{marginBottom: "15px"}}>Email: </InputLabel>
            <Paper>
              <TextField  
                type="text"
                className="form-control"
                id="emailField"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                aria-label="email-field"
                style={{width: "100%"}}
                />
              {formik.errors.email ? (
                <Alert severity="error">{formik.errors.email}</Alert>
                ) : null}
            </Paper>
          </Grid>
        {/* </div> */}
        {/* <div className="mb-3"> */}
          <Grid item md={12} style={{marginTop: "15px"}}>
            <InputLabel style={{marginBottom: "15px"}}>Password: </InputLabel>
            <Paper>
              <TextField
                type="password"
                className="form-control"
                id="pswField"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                aria-label="password-field"
                style={{width: "100%"}}
                />
              {formik.errors.password ? (
                <Alert severity="error">{formik.errors.password}</Alert>
                ) : null}
            </Paper>
          </Grid> 
        </Grid>
        {errorMessage.length>0 && <Alert style={{marginTop: "10px"}} severity="error">{errorMessage}</Alert>}
        <DialogActions>
          <Button onClick={props.handleClose}>Cancel</Button>
          <Button type="submit">Login</Button>
          {showSpinner && <CircularProgress />}
        </DialogActions>
    </form>
  </DialogContent>
</Dialog>
}