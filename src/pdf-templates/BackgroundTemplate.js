import React, {useReducer, useEffect} from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 20,
    padding: 20,
    flexGrow: 1
  },
  backgroundName:  {
    fontSize: 20,
    textAlign: "center",
    textDecoration: "underline",
    textTransform: "capitalize"
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
  }
});

const initialState = ""


function backgroundImageReducer(state,action) {
  switch (action.type) {
    case 'new_image_url':
      return action.payload;
    default: 
      return initialState;
  }
}

// Create Document Component
export const BackgroundTemplate = (props) => {

  // // let img = backgroundImage ? backgroundImage : "";
  // const [currentImage, dispatch] = useReducer(backgroundImageReducer, initialState);


  // useEffect(()=>{
  //   if(props.backgroundImage !== currentImage) {
  //     dispatch({type: 'new_image_url', payload: props.backgroundImage});
  //   }
  // })



  return <Document>
    <Page size="A4">
      <View style={styles.section}>
        <Text style={styles.backgroundName}>
            {props.data.name}          
        </Text>
        <Text style={styles.description}>
            {props.data.description}            
        </Text>
        <Text style={styles.subtitle}> 
            Possessions
        </Text>
        <View style={styles.possessions}>
          {
            props.data.possessions && props.data.possessions.map((possession,index) => {
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
            props.data.advancedSkills && props.data.advancedSkills.map((advancedSkill,index) => {
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
        {props.data.special}            
        </Text>
          
          <Image alt="no image" src={{uri: props.currentImage, method: 'GET', headers: {}, body:''}}/>
      </View>
    </Page>
  </Document>
};

