import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/characterSlice';
import { addCharacterThunk } from '../../store/authSlice';
import { Container, Grid, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { generateCharacterSheetPdf } from "../../pdf-templates/CharacterSheetTemplate";
import EditCharacter from "./EditCharacter";
import isEmpty from "lodash/isEmpty";
import "./CharacterGenerator.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CharacterGenerator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backgrounds = useSelector((state) => state.data.backgrounds);
  const damageTable = useSelector((state) => state.data.damageTable);
  const spells = useSelector((state) => state.data.spells);
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const [openDialog, setOpenDialog] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (backgrounds.length > 0) {
      generateNewCharacter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgrounds]);

  const throwDice = (dice) => Math.floor(Math.random() * dice) + 1;

  const generateNewCharacter = () => {
    const skill = throwDice(3) + 3;
    const stamina = throwDice(6) + throwDice(6) + 12;
    const luck = throwDice(6) + 6;
    const silverPence = throwDice(6) + throwDice(6);
    const randomIndex = throwDice(36) - 1;
    const background = Object.assign({}, backgrounds[randomIndex]);

    background.possessions = [...(background.possessions || []), "a knife", "a lantern & flask of oil", "a rucksack"];
    background.provisionsCount = background.provisionsCount || 6;

    // Replace random spells with actual spells from dataslice
    if (spells && spells.length > 0) {
      const advancedSkills = { ...background.advancedSkills };
      const randomSpellEntries = Object.entries(advancedSkills).filter(([key]) => /random/i.test(key));

      randomSpellEntries.forEach(([key, rank]) => {
        const randomSpell = spells[throwDice(spells.length) - 1];
        const newSkillName = 'spell' + randomSpell.name.replace(/\s+/g, '');
        delete advancedSkills[key];
        advancedSkills[newSkillName] = rank;
      });

      background.advancedSkills = advancedSkills;
    }

    dispatch(setCharacterInfo({
      name: "",
      skill,
      stamina,
      luck,
      background,
      provisionsChecked: new Array(14).fill(false).map((_, i) => i < (background.provisionsCount || 6)),
      monies: [{ "Silver Pence": silverPence }],
      currentStamina: stamina,
    }));
  };

  const saveCharacter = async () => {
    setOpenDialog(false);
    setShowSpinner(true);
    try {
      await dispatch(addCharacterThunk({ uid: currentUser.uid, characterInfo })).unwrap();
      navigate("/virtualSheet");
    } catch {
      setErrorMessage("Error saving character. Please try again.");
    } finally {
      setShowSpinner(false);
    }
  };

  const printPdf = () => {
    generateCharacterSheetPdf(characterInfo, damageTable);
  };

  return (
    <React.Fragment>
      <Container className="character-generator-container" maxWidth={false}>
        <Grid container>
          <EditCharacter />
          {errorMessage.length > 0 && (
            <Alert style={{ marginTop: "10px" }} severity="error">{errorMessage}</Alert>
          )}
          <div className="button-container">
            {showSpinner && <CircularProgress style={{ height: "30px", width: "30px" }} />}
            {currentUser && !isEmpty(characterInfo) && (
              <Button onClick={() => setOpenDialog(true)} variant="outlined" color="secondary">
                Save Character
              </Button>
            )}
            {!isEmpty(characterInfo) && (
              <Button onClick={printPdf} variant="outlined" color="secondary">
                Print Character
              </Button>
            )}
          </div>
        </Grid>

        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenDialog(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Save Character?</DialogTitle>
          <DialogActions>
            <Button onClick={saveCharacter}>Yes</Button>
            <Button onClick={() => setOpenDialog(false)}>No</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}
