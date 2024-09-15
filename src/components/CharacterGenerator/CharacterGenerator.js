import React, {useEffect, useState} from "react";
import { Container, Grid, Button } from '@mui/material';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {Document, pdf} from '@react-pdf/renderer';
import {
    Route,
    Switch,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import {Store} from "../../AppState/Store";
import CharacterSheetTemplate from "../../pdf-templates/CharacterSheetTemplate";
import EditCharacter from "./EditCharacter";

import "./CharacterGenerator.scss";
import isEmpty from "lodash/isEmpty";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export default function CharacterGenerator() {

    const { state, actions } = React.useContext(Store);
    
    const [openDialog, setOpenDialog] = React.useState(false);

    // const [backgrounds, setBackgrounds] = useState([]);

    const [damageTable,setDamageTable] = useState([]);

    const  [showSpinner, setShowSpinner] = useState(false);
  
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();

    let { path } = useRouteMatch();

    useEffect(()=>{
        if(state.backgrounds.length>0) {
            generateNewCharacter();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[state.backgrounds])

    useEffect(()=>{
        if(!isEmpty(state.damageTable)) {
            setDamageTable(state.damageTable)
        }
        console.log(state.damageTable);
    },[state.damageTable])

    const throwDice = (dice) => {
       return Math.floor(Math.random() * (1 + dice - 1)) + 1
    }

    const handleOpen = () => {
        setOpenDialog(true);
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const saveCharacter = () => {
        setOpenDialog(false);
        actions.addCharacter({ setShowSpinner, setErrorMessage, goToCharacters: ()=>{ history.push("/userCharacters")} });
    }

    const printPdf = () => {

        let template = CharacterSheetTemplate(state.characterInfo, damageTable);

        let pdfInstance = pdf(<Document></Document>);
        pdfInstance.updateContainer(template);
        pdfInstance.toBlob()
        .then((blob)=>{
                var url = URL.createObjectURL(blob);
                window.open(url,"_blank");
        });
    }

    let generateNewCharacter =() =>{
        let characterInfo = {};
        let skill = throwDice(3)+3;
        let stamina = throwDice(6) + throwDice(6) + 12;
        let luck = throwDice(6) + 6;
        const baselinePossessions = ["a knife","a lantern & flasf of oil", "a rucksack","6 provisions"];
        let randomNumber0to36 = throwDice(36) - 1;
        let background = Object.assign({}, state.backgrounds[randomNumber0to36]);

        characterInfo.name = "";
        characterInfo.skill = skill;
        characterInfo.stamina = stamina;
        characterInfo.luck = luck;
        characterInfo.baselinePossessions = baselinePossessions;
        characterInfo.background = background;

        characterInfo.background.possessions = characterInfo.background.possessions.concat(characterInfo.baselinePossessions)
        console.log(characterInfo);
        actions.setCharacterInfo(characterInfo);
    }

    return <React.Fragment>
        <Container className="character-generator-container" maxWidth={false}>
            <Grid container>
                <Switch>
                    {/* <Route exact path={path}>
                        <Container style={{marginTop: "10px"}}>
                            <Grid item md={12}>
                                <Paper>
                                    <TextField fullWidth label="Character Name" value={characterName} onChange={(event)=>{setCharacterName(event.target.value)}}/>
                                </Paper>
                            </Grid>
                            <Grid container>
                                <Grid item md={12} style={{textAlign: "right", marginTop: "10px"}}>
                                    <Button onClick={goToSetupView} variant="outlined" color="secondary">Next Step</Button>
                                </Grid>
                            </Grid>
                        </Container>
                    </Route> */}
                    {/* <Route path={`${path}/editCharacter`}> */}
                    <Route exact path={path}>
                        <EditCharacter/>
                        {errorMessage.length>0 && <Alert style={{marginTop: "10px"}} severity="error">{errorMessage}</Alert>}
                        <div className="button-container">
                            {showSpinner && <CircularProgress style={{height:"30px", width: "30px"}}/>}
                            {state.currentUser && <Button onClick={handleOpen} variant="outlined" color="secondary">Save Character</Button>}
                            <Button onClick={printPdf} variant="outlined" color="secondary">Print Character</Button>
                        </div>
                    </Route>
                </Switch>
            </Grid>

            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle> Save Character?</DialogTitle>
                <DialogActions>
                    <Button onClick={saveCharacter}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>
        </Container>
    </React.Fragment>
}