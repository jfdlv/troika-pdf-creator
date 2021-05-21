import React, {useState, useRef} from "react";
import {TextField, Container, Grid, ListItemSecondaryAction, IconButton, Button, Input, InputLabel} from '@material-ui/core';
import cloneDeep from 'lodash/cloneDeep';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { pdf} from '@react-pdf/renderer';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

import './Background.css';

const styles = StyleSheet.create({
  document:{
    width: 900
  },
  page: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#FFFCEE'
  },
  section: {
    width: 400,
    flexGrow: 1,
    marginRight: 0,
  },
  section2: {
    width: 400,
    flexGrow: 1,
    textAlign: "left",
    padding: 20,
    marginLeft: 0
  },
  backgroundName:  {
    fontSize: 20,
    width: 250,
    textDecoration: "underline",
    textTransform: "capitalize",
    textAlign: "left"
  },
  description: {
    fontSize: 13,
    margin: 5,
    padding: 5,
    border: "1px solid lightgrey",
    borderRadius: 5,
    marginTop: 10
  },
  subtitle: {
    fontSize: 15,
    textDecoration: "underline",
    margin: 5
  },
  possessions: {
    margin: 5
  },  
  possession: {
    fontSize: 14,
    marginTop: 5
  },
  advancedSkills: {
    margin: 5
  },
  advancedSkill: {
    fontSize: 14,
    marginTop: 5
  },
  special: {
    fontSize: 13,
    margin: 5,
    padding: 5,
    marginTop: 10
  },
  imageContainer: {
    width: 250,
    marginLeft: 50,
    padding: 20
  },
  image: {
    width: "100%"
  }
});

export default function Background() {
  
    const [state, setState] = useState(
      {
        name: "",
        description: "",
        possessions: [],
        advancedSkills: [],
        special: "",
        imgUrl: ""
      }
    );

    let handleNameChange = (event)  => {
        let newState = cloneDeep(state);
        newState.name = event.target.value;
        setState(newState);
    }
  
    let handleDescriptionChange = (event)  => {
      let newState = cloneDeep(state);
      newState.description = event.target.value;
      setState(newState);
    }

    let handleSpecialChange = (event)  => {
        let newState = cloneDeep(state);
        newState.special = event.target.value;
        setState(newState);
    }
  
    let handlePossessionsAdd = () => {
      let newState = cloneDeep(state);
      let newItem = possessionRef.current.value;
      newState.possessions.push(newItem);
      setState(newState);
    }
  
    let handleAdvancedSkillAdd = () => {
      let newState = cloneDeep(state);
      let newItem = ` ${advancedSkillLevelRef.current.value} ${advancedSkillRef.current.value}`;
      newState.advancedSkills.push(newItem);
      setState(newState);
    }
  
    let handleOnDeletePossession = (index) => {
        let newState = cloneDeep(state);
        newState.possessions.splice(index,1);
        setState(newState);
    }

    let handleOnDeleteAdvncdSkill = (index) => {
        let newState = cloneDeep(state);
        newState.advancedSkills.splice(index,1);
        setState(newState);
    }

    let readUrl = (event) => {
        let newState = cloneDeep(state);
        if (event.target.files && event.target.files[0]) {

          var file = event.target.files[0];

          window.URL = window.webkitURL || window.URL; // Vendor prefixed in Chrome.

          var img = document.getElementById('image-holder');

          var imgURL =  window.URL.createObjectURL(file)

          img.setAttribute("src",imgURL);
          newState.imgUrl = imgURL;
          setState(newState);
      }
    }

    let printPdf = () => {
      let backgroundTemplate = (<Document style={styles.document}>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}   >
              <View style={styles.imageContainer}   >
                  <Image styles={styles.image} alt="no image" src={state.imgUrl}/>
              </View>
          </View>
          <View style={styles.section2}>
              <Text style={styles.backgroundName}>{state.name}</Text>
            
              <Text style={styles.description}>
              {state.description}            
              </Text>
            
              <Text style={styles.subtitle}> 
              Possessions
              </Text>
              
              <View style={styles.possessions}>
              {
                state.possessions && state.possessions.map((possession,index) => {
                  return <Text key={`${possession}${index}`} style={styles.possession}>
                  &bull; {possession}
                  </Text>
                })
              }
              </View>
              

              <Text style={styles.subtitle}>
              Advanced Skills
              </Text>
              <View style={styles.advancedSkills}>
              {
                state.advancedSkills && state.advancedSkills.map((advancedSkill,index) => {
                  return <Text key={`${advancedSkill}${index}`} style={styles.possession}>
                  {advancedSkill}
                  </Text>
                })
              }
              </View>
              
              <Text style={styles.subtitle}> 
              Special
              </Text>
              
              <Text style={styles.special}>
              {state.special}            
              </Text>
          </View>
        </Page>
      </Document>)

      let pdfInstance = pdf(<Document></Document>);
      pdfInstance.updateContainer(backgroundTemplate);
      pdfInstance.toBlob()
      .then((blob)=>{
            var url = URL.createObjectURL(blob);
            window.open(url,"_blank");
      });
    } 

    const advancedSkillRef = useRef();
    const advancedSkillLevelRef = useRef();
    const possessionRef = useRef();
  
    return <React.Fragment>
      <Container className="background-container">
            <form>
                  {/* <InputLabel>Description:</InputLabel> */}
                  <Grid container>
                    
                    <h2>Create Troika Background</h2>

                    <Grid item md={12} style={{marginTop: "10px"}}>
                      <TextField fullWidth={true} label="Background Name" type="text" id="name" value={state.name} onChange={handleNameChange} variant="outlined"/>
                    </Grid>

                    <Grid item md={12} style={{marginTop: "10px"}}>
                      <TextField fullWidth={true} label="Description" type="text" id="description" multiline rows={4} value={state.description} onChange={handleDescriptionChange} variant="outlined"/>
                    </Grid>
                    
                    <Grid container spacing={1} className="possessions-container">
                      <Grid item md={11}>
                        <TextField fullWidth={true} label="Possessions:" type="text" id="possession" variant="outlined" inputRef={possessionRef}/>
                      </Grid>
                      <Grid className="button-container" item md={1} style={{textAlign: "center", verticalAlign: "middle"}}> 
                          <Button variant="contained" onClick={handlePossessionsAdd}>Add</Button>
                      </Grid>
                      <Grid item md={12}>
                        <List aria-label="secondary mailbox folders">
                          {state.possessions && state.possessions.map((item, index)=>{
                              return <ListItem key={`${item}${index}`}>
                                      <ListItemText primary={item} />
                                      <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={()=>{handleOnDeletePossession(index)}}>
                                          <DeleteIcon />
                                        </IconButton>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                          })}
                        </List>
                      </Grid>
                    </Grid>
                    
                    <Grid container spacing={1} className="advanced-skills-container">
                        <Grid item md={5}>
                          <TextField  fullWidth={true} label="Advanced Skill:" type="text" id="advancedSkill" variant="outlined" inputRef={advancedSkillRef}/>
                        </Grid>
                        <Grid item md={5}>
                          <TextField fullWidth={true} label="Level:" type="number" id="advancedSkillLevel" variant="outlined" inputRef={advancedSkillLevelRef}/>
                        </Grid>
                        <Grid item md={2} className="button-container"> 
                          <Button variant="contained" onClick={handleAdvancedSkillAdd}>Add</Button>
                        </Grid>
                        <Grid item md={12}>
                          <List aria-label="secondary mailbox folders">
                            {state.advancedSkills && state.advancedSkills.map((item, index)=>{
                              return <ListItem key={`${item}${index}`}>
                                      <ListItemText primary={item} />
                                      <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={()=>{handleOnDeleteAdvncdSkill(index)}}>
                                          <DeleteIcon/>
                                        </IconButton>
                                      </ListItemSecondaryAction>
                                    </ListItem>
                              })
                            }
                          </List>
                        </Grid>
                    </Grid>

                    <Grid item md={12} className="special-container" style={{marginTop: "10px", marginBottom: "10px"}}>
                      <TextField fullWidth={true} label="Special" type="text" id="special" value={state.special} onChange={handleSpecialChange} variant="outlined"/>
                    </Grid>

                    <Grid item md={12} className="file-input-container">
                      <InputLabel>Background Image: </InputLabel>
                      <Input type="file" accept="image/*" onChange={readUrl} id="" />
                      <img src="" alt="" style={{width:"50px", height: "50px"}} id="image-holder"/>
                    </Grid>

                    <div className="print-button-container">
                      <Button onClick={printPdf} variant="contained">Print</Button>
                      {/* <BlobProvider document={pdfTemplate}>
                      {({ blob, url }) => {
                        return <Button href={url} target="_blank" variant="contained">Print</Button>
                      }}
                      </BlobProvider> */}
                    </div>
                </Grid>
            </form>
      </Container>
    </React.Fragment>;
}