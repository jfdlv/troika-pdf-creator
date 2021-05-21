import React, {useEffect, useState} from "react";
import {TextField, Container, Grid, Button} from '@material-ui/core';
import {Document, pdf} from '@react-pdf/renderer';
import {
    Route,
    Switch,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import "firebase/firestore";

import {Store} from "../../Store";
import CharacterSheetTemplate from "../../pdf-templates/CharacterSheetTemplate";
import EditCharacter from "./EditCharacter";
import axios from "axios";

import "./CharacterGenerator.css";

export default function CharacterGenerator() {

    const { state, dispatch } = React.useContext(Store);

    const [backgrounds, setBackgrounds] = useState([]);

    const [damageTable,setDamageTable] = useState([]);

    const [characterName, setCharacterName] = useState("");

    const history = useHistory();

    let { path, url } = useRouteMatch();

    useEffect(()=>{
        let backgroundsArray = [];
        let damageTable = {};
    
        axios.get("backgrounds.json").then((response)=>{
            console.log(backgroundsArray);
            backgroundsArray = response.data;
            setBackgrounds(backgroundsArray);
        });

        axios.get("damageTable.json").then((response)=>{
            console.log(response);
            damageTable = response.data;
            setDamageTable(damageTable);
        });


    },[]);

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

        dispatch({type: "SET_CHARACTER_INFO", payload: characterInfo});
        history.push(`${url}/editCharacter`);
    }

    return <React.Fragment>
        <Container className="character-generator-container" maxWidth={false}>
            <Grid container>
                <Switch>
                    <Route exact path={path}>
                        <Container>
                            <Grid item md={12}>
                                <TextField fullWidth label="Character Name" value={characterName} onChange={(event)=>{setCharacterName(event.target.value)}}/>
                            </Grid>
                            <Grid container>
                                <Grid item md={12} style={{textAlign: "right", marginTop: "10px"}}>
                                    <Button onClick={goToSetupView} variant="contained">Next Step</Button>
                                </Grid>
                            </Grid>
                        </Container>
                    </Route>
                    <Route path={`${path}/editCharacter`}>
                        <EditCharacter/>
                        <Container>
                            <Grid item md={12} style={{textAlign: "right", marginTop: "10px"}}>
                                <Button onClick={generatePdf} variant="contained">Generate Character</Button>
                            </Grid>
                        </Container>
                    </Route>
                </Switch>
            </Grid>
        </Container>
    </React.Fragment>
}