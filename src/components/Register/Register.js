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
import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';

import './Register.scss';

function Register({open, setOpenRegister, handleClose}) {
  const { actions } = useContext(Store);

  const  [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    onSubmit: (values) => {
      console.log(values);
      setShowSpinner(true);
      actions.register(values,
        { setShowSpinner, setErrorMessage },
        {setOpenRegister: setOpenRegister});
    },
    validate: (values) => {
      let errors = {}
      if (!values.email) errors.email = 'Field required'
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
        errors.email = 'Not a valid email'
      if (!values.password) errors.password = 'Field required'
      if (!values.repeatPassword) errors.repeatPassword = 'Field required'
      if (values.repeatPassword !== values.password) errors.passwordsNotEqual = "Passwords need to match"
      return errors
    },
  })

  return <Dialog open={open} onClose={handleClose}>
          <DialogTitle style={{textAlign: "center"}}>Register</DialogTitle>
            <DialogContent>
              <form onSubmit={formik.handleSubmit} data-testid="register-form" className='register-form'>
                <Grid container>
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
                      <InputLabel style={{marginBottom: "15px"}}>
                      Password: 
                      </InputLabel>
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
                          autoComplete='new-password'
                          />
                        {formik.errors.password ? (
                          <Alert severity="error">{formik.errors.password}</Alert>
                          ) : null}
                      </Paper>
                    </Grid> 
                    <Grid item md={12} style={{marginTop: "15px"}}> 
                      <InputLabel  style={{marginBottom: "15px"}}>
                        Repeat Password: 
                      </InputLabel>
                      <Paper>
                      <TextField
                          type="password"
                          className="form-control"
                          id="rpswField"
                          name="repeatPassword"
                          onChange={formik.handleChange}
                          value={formik.values.repeatPassword}
                          aria-label="repeat-password-field"
                          style={{width: "100%"}}
                          autoComplete='new-password'
                          />
                        {formik.errors.repeatPassword ? (
                          <Alert severity="error">{formik.errors.repeatPassword}</Alert>
                          ) : null}
                        
                      </Paper>
                    </Grid>
                  </Grid>
                  {errorMessage.length>0 && <Alert style={{marginTop: "10px"}} severity="error">{errorMessage}</Alert>}
                  {!isEmpty(formik.errors) && formik.errors.passwordsNotEqual && <Alert style={{marginTop: "10px"}} severity="error">{formik.errors.passwordsNotEqual}</Alert>}
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Create account</Button>
                    {showSpinner && <CircularProgress />}
                  </DialogActions>
              </form>
            </DialogContent>
          </Dialog>
}

export default Register;