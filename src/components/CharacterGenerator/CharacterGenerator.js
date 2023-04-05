import React, {useEffect, useState} from "react";
import {TextField, Container, Grid, Button, Paper} from '@mui/material';
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

export default function CharacterGenerator() {

    const { state, actions } = React.useContext(Store);

    const [backgrounds, setBackgrounds] = useState([]);

    const [damageTable,setDamageTable] = useState([]);

    const [characterName, setCharacterName] = useState("");

    const history = useHistory();

    let { path, url } = useRouteMatch();

    useEffect(()=>{
        actions.getBackgrounds();
    },[]);

    useEffect(()=>{
        if(state.backgrounds.length>0) {
            setBackgrounds(state.backgrounds)
        }
        console.log(state.backgrounds);

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

    const generatePdf = () => {

        let template = CharacterSheetTemplate(state.characterInfo, damageTable);

        let pdfInstance = pdf(<Document></Document>);
        pdfInstance.updateContainer(template);
        pdfInstance.toBlob()
        .then((blob)=>{
                var url = URL.createObjectURL(blob);
                window.open(url,"_blank");
        });
    }

    let goToSetupView =() =>{
        let characterInfo = {};
        let skill = throwDice(3)+3;
        let stamina = throwDice(6) + throwDice(6) + 12;
        let luck = throwDice(6) + 6;
        const baselinePossessions = ["a knife","a lantern & flasf of oil", "a rucksack","6 provisions"];
        let randomNumber0to36 = throwDice(36) - 1;
        let background = Object.assign({}, backgrounds[randomNumber0to36]);

        characterInfo.name = characterName;
        characterInfo.skill = skill;
        characterInfo.stamina = stamina;
        characterInfo.luck = luck;
        characterInfo.baselinePossessions = baselinePossessions;
        characterInfo.background = background;

        characterInfo.background.possessions = characterInfo.background.possessions.concat(characterInfo.baselinePossessions)
        console.log(characterInfo);
        actions.setCharacterInfo(characterInfo);
        history.push(`${url}/editCharacter`);
    }

    return <React.Fragment>
        <Container className="character-generator-container" maxWidth={false}>
            <Grid container>
                <Switch>
                    <Route exact path={path}>
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
                    </Route>
                    <Route path={`${path}/editCharacter`}>
                        <EditCharacter/>
                        <div className="button-container">
                            <Button onClick={generatePdf} variant="outlined" color="secondary">Generate Character</Button>
                        </div>
                    </Route>
                </Switch>
            </Grid>
        </Container>
    </React.Fragment>
}