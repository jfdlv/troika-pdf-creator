import React from 'react';
import _ from "lodash";
import { Page, Text, View, Document, StyleSheet} from '@react-pdf/renderer';
const styles = StyleSheet.create({
    document: {
        width: "100%",
    },  
    page: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "flex-start",
    },  
    basicInfoContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "10px",
        flexGrow: 1,
        maxHeight: 100,
        marginBottom: 15,
        marginTop: "20px"
    },
    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxHeight: "600px",
        // padding: "10px",
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center"
    },
    attacksContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "10px",
        flexGrow: 1,
        maxHeight: 150
    },
    basicInfo: {
        display:"flex",
        flexDirection: "column",
        padding: "5px",
        width: "100%",
        maxHeight: 150,
        flexGrow: 1,
        justifyContent: "center"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        flexGrow: 1,
        minHeight: "50px",
        marginBottom: "5px"
    },
    field: {
        display: "flex",
        border: "1px solid black",
        flexDirection: "row",
        minHeight: "30px",
        width: "100%",
        flexGrow: 1,
        marginBottom: "5px",
        borderRadius: "5px"
    },
    fieldLabel: {
        borderRight: "1px solid black",
        padding: "5px;",
        flexGrow:1,
        minHeight: "23px",
        fontSize: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    fieldValue: {
        padding: "5px",
        flexGrow: 12,
        minHeight: "23px",
        fontSize: "13px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    special: {
        display:"flex",
        flexDirection: "column",
        padding: "5px",
        width: "100%",
        maxHeight: 200,
        flexGrow: 1,
        justifyContent: "center",
        alignContent: "center"
    },
    specialField: {
        width: "100%",
        border: "1px solid black",
        borderRadius: "5px",
        minHeight: 120,
        flexGrow: 1,
        display: "flex",
        justifyContent: "flex-end",
        textAlign: "center"
    },
    specialFieldLabel: {
        flexGrow: 1,
    },
    specialFieldValue: {
        flexGrow: 5,
        fontSize: "8px",
        padding: "5px",
        textAlign: "left"
    },  
    rowField: {
        minHeight: "50px",
        padding: "5px",
        border: "1px solid black",
        flexGrow: 1,
        margin: "3px",
        marginLeft: 0,
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column"
    },
    rowFieldLabel: {
        flexGrow: 1,
        fontSize: "10px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    rowFieldValueContainer:{
        flexGrow: 1,
        maxWidth: 80,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
    },
    rowFieldValue: {
        flexGrow: 1,
        maxWidth: 40,
        display: "flex",
        textAlign: "center",
        justifyContent: "center"
    },
    rowFieldCurrentValue: {
        border: "1px solid black",
        borderRadius: "5px",
        flexGrow:1
    },
    column: {
        display:"flex",
        flexDirection: "column",
        padding: "10px",
        width: "100%",
        flexGrow: 1,
        justifyContent: "center"
    },
    columnSection: {
        flexGrow: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    advancedSkillsContainer: {
        flexGrow:1,
        display: "flex",
        width: "100%"
    },
    tableContainer: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        fontSize: "12px"
    },
    tableContainerMiens: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        fontSize: "12px",
        maxWidth: "100px"
    },
    tableName: {
        flexGrow: 1,
        textAlign: "center",
        border: "1px solid black",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        fontSize: "15px",
        padding: "2px",
        minHeight: "20px"
    },
    tableRow: {
        flexGrow: 1,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        minHeight: "20px",
        border: "1px solid black",
        borderTop: 0
    },
    tableRowHeader: {
        flexGrow: 1,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        border: "1px solid black",
        borderTop: 0,
        maxHeight: "20px"
    },
    attackNameCell: {
        flexGrow: 1,
        borderRight: "1px solid black",
        padding: "2px",
        textAlign: "center"
    },
    attackNameValue: {
        maxWidth: "40%",
        padding: "2px"
    },
    abilityNameCell: {
        flexGrow: 1,
        borderRight: "1px solid black",
        padding: "2px",
        fontSize: "8px",
        textAlign: "center",
        justifyContent: "center"
    },
    abilityNameValue: {
        padding: "2px",
        maxWidth: "30%",
        textTransform: "capitalize"
    },
    headerTableCell: {
        flexGrow: 1,
        borderRight: "1px solid black",
        maxWidth: "50px",
        textAlign: "center",
        fontSize: "8px",
        padding: "2px"
    },
    lastHeaderTableCell: {
        flexGrow: 1,
        maxWidth: "50px",
        textAlign: "center",
        fontSize: "8px",
        padding: "2px"
    },
    tableCell: {
        flexGrow: 1,
        borderRight: "1px solid black",
        maxWidth: "50px",
        textAlign: "center",
        padding: "2px",
        justifyContent: "center"
    },
    lastTableCell: {
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        maxWidth: "50px",
        textAlign: "center",
        padding: "2px"
    },
    inventory: {
        padding: "5px",
        border: "1px solid black",
        borderRadius: "5px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
    },
    inventoryHeader: {
        flexGrow:1,
        width: "100%",
        textAlign: "center"
    },
    inventoryColumns: {
        display: "flex",
        flexDirection: "row",
        flexGrow: 7,
        width: "100%",
        fontSize: "8px",
        justifyContent: "flex-end",
        textTransform: "capitalize"
    },
    inventoryItem: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        marginBottom: "5px"
    },
    currencyContainer: {
        flexGrow: 1,
        display: "flex",
        width: "100%",
        flexDirection: "column",
        padding: "5px",
        justifyContent: "center"
    },
    currency: {
        flexGrow: 1,
        display: "flex",
        width: "100%",
        flexDirection: "column",
        padding: "5px",
        border: "1px solid black",
        borderRadius: "5px",
        maxHeight: "50px"
    },
    currencyLabel: {
        flexGrow: 1,
        textAlign: "center"
    },
    currencyValue: {
        flexGrow: 1,
        textAlign: "center"
    },
    provisionsContainer: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%"
    },
    provisions: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignContent: "flex-start"
    },
    provisionsHeader:{
        flexGrow: 1,
        textAlign:"center",
        fontSize: 14,
        maxHeight: "20px"
    },
    provisionsValues: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        maxHeight: "20px"
    },
    provision: {
        flexGrow: 1,
        // display: "flex",
        maxWidth: "20px",
        border: "1px solid black",
        borderRadius: "8px",
        margin: "2px"
    },
    provisionFilled: {
        flexGrow: 1,
        // display: "flex",
        maxWidth: "20px",
        border: "1px solid black",
        borderRadius: "8px",
        margin: "2px",
        backgroundColor: "black"
    },
    notesContainer: {
        flexGrow: 1,
        minHeight: "150px",
        border: "1px solid black",
        borderRadius: "5px",
        margin: "10px",
        display: "flex",
        flexDirection: "column"
    },
    notesLabel: {
        flexGrow: 1,
        textAlign: "center",
        padding: "5px"
    },
    notesValue: {
        flexGrow: 1,
        padding: "10px",
        display: "flex",
        flexDirection: "row",
        minHeight: "100px"
    }
});



export default function CharacterSheetTemplate(characterInfo, damageTable) {

    let advancedSkillsObject = {};
    let weaponsArray = [];
    let possessions = Object.assign([],characterInfo.background.possessions);

    // characterInfo.background.possessions = characterInfo.background.possessions.concat(characterInfo.baselinePossessions)

    for (var advancedSkill in characterInfo.background.advancedSkills) {
        advancedSkillsObject[advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2')] = characterInfo.background.advancedSkills[advancedSkill];
        let formattedSkill = advancedSkill.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        if(formattedSkill.includes("Fighting")){
            let weaponName = formattedSkill.replace("Fighting","");
            weaponName = weaponName.replace(" ","");
            weaponsArray.push(weaponName);
        }
    }
    
    if(possessions.length < 12) {
        let lengthDiff = 12 - possessions.length;
        for(let i = 0; i<lengthDiff; i++){
            possessions.push(' ');
        }
    }

    if(weaponsArray.length < 5) {
        let lengthDiffWeaponsArray = 5 - weaponsArray.length;
        for(let i = 0; i<lengthDiffWeaponsArray; i++){
            weaponsArray.push(' ');
        }
    } 
    
    if(Object.keys(advancedSkillsObject).length < 12) {
        let difference = 12 - Object.keys(advancedSkillsObject).length;
        for(var i = 0; i<difference; i++) {
            advancedSkillsObject[`noValue${i}`] = "";
        }
    }

    return <Document style={styles.document}>
        <Page size="letter" style={styles.page}>
        <View style={styles.basicInfoContainer}>
            <View style={styles.basicInfo}>
                <View style={styles.field}>
                    <View style={styles.fieldLabel}>
                        <Text>Name: </Text>
                    </View>
                    <View style={styles.fieldValue}>
                        <Text>{characterInfo.name}</Text>
                    </View>
                </View>
                <View style={styles.field}>
                    <View style={styles.fieldLabel}>
                        <Text>Background: </Text>
                    </View>
                    <View style={styles.fieldValue}>
                        <Text style={{maxWidth: "150px"}}>{characterInfo.background.backgroundName.toLowerCase()}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.rowField}>
                    <View style={styles.rowFieldLabel}>
                            <Text>
                                Skill
                            </Text>
                        </View>
                        <View style={styles.rowFieldValueContainer}> 
                            <View style={styles.rowFieldValue}>
                                <Text style={{fontSize: "25px"}}>
                                    {characterInfo.skill}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowField}>
                        <View style={styles.rowFieldLabel}>
                            <Text>
                                Stamina
                            </Text>
                        </View>
                        <View style={styles.rowFieldValueContainer}> 
                            <View style={styles.rowFieldValue}>
                                <Text style={{fontSize: "25px"}}>
                                    {characterInfo.stamina}
                                </Text>
                            </View>
                            <View style={styles.rowFieldCurrentValue}>

                            </View>
                        </View>
                    </View>
                    <View style={styles.rowField}>
                        <View style={styles.rowFieldLabel}>
                            <Text>
                                Luck
                            </Text>
                        </View>
                        <View style={styles.rowFieldValueContainer}>
                            <View style={styles.rowFieldValue}>
                                <Text style={{fontSize: "25px"}}>
                                    {characterInfo.luck}
                                </Text>
                            </View>
                            <View style={styles.rowFieldCurrentValue}>

                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.special}>
                <View style={styles.specialField}>
                    <Text style={styles.specialFieldValue}>
                        {characterInfo.background.special}
                    </Text>
                    <Text style={styles.specialFieldLabel}>Special</Text>
                </View>
            </View>
        </View>

        {weaponsArray.length > 0 && <View style={styles.attacksContainer}>  
            <View style={styles.tableContainer}>
                <View style={styles.tableName}>
                    <Text>Attacks</Text>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.attackNameCell}>
                        <Text style={styles.attackNameValue}></Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>1</Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>2</Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>3</Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>4</Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>5</Text>
                    </View>
                    <View style={styles.headerTableCell}>
                        <Text>6</Text>
                    </View>
                    <View style={styles.lastHeaderTableCell}>
                        <Text>7+</Text>
                    </View>
                </View>
                {
                    weaponsArray.map((value,index)=>{
                        console.log(value)
                        return <View style={styles.tableRow} key={`weapon${index}`}>
                        <View style={styles.attackNameCell}>
                            <Text style={styles.attackNameValue}>{value}</Text>
                        </View>

                        {damageTable[value.toLowerCase()] && damageTable[value.toLowerCase()].map((value,index)=>{
                            return  <View style={styles.tableCell} key={`damage${index}`}>
                                        <Text>{value}</Text>
                                    </View>    
                        })}
                        {!damageTable[value.toLowerCase()] && <React.Fragment>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text></Text>
                            </View>
                            <View style={styles.lastTableCell}>
                                <Text></Text>
                            </View>
                        </React.Fragment>}
                    </View>
                    })
                }
                
            </View>
        </View> }

        {/* Columns */}
        <View style={styles.container}>
            <View style={styles.column}> 
                <View style={styles.columnSection}>
                    <View style={styles.advancedSkillsContainer}>
                        

                    <View style={styles.tableContainer}>
                        <View style={styles.tableName}>
                            <Text>Advanced Skills/Spells</Text>
                        </View>
                        <View style={styles.tableRowHeader}>
                            <View style={styles.abilityNameCell}>
                                <Text style={styles.abilityNameValue}></Text>
                            </View>
                            <View style={styles.headerTableCell}>
                                <Text>Rank</Text>
                            </View>
                            <View style={styles.headerTableCell}>
                                <Text>Skill</Text>
                            </View>
                            <View style={styles.lastHeaderTableCell}>
                                <Text>Total</Text>
                            </View>
                        </View>
                        {
                            _.map(advancedSkillsObject, (value, key)=>{
                                return <View style={styles.tableRow} key={`advancedSkill${key}`}>
                                <View style={styles.abilityNameCell}>
                                    <Text style={styles.abilityNameValue}>{value ? key : ""}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{value ? value : ""}</Text>
                                </View>
                                <View style={styles.tableCell}>
                                    <Text>{characterInfo.skill}</Text>
                                </View>
                                <View style={styles.lastTableCell}>
                                    <Text>{value ? value + characterInfo.skill : ""}</Text>
                                </View>
                            </View>
                            })
                        }
                    </View>
                    </View>
                </View>
            </View>
            <View style={styles.column}>
                <View style={styles.columnSection}>
                    <View style={styles.inventory}>
                        <View style={styles.inventoryHeader}>
                            <Text>Inventory</Text>
                        </View>
                        <View style={styles.inventoryColumns}>
                            <View style={styles.column}>
                               {possessions.map(
                                   (element, index) => {
                                        return <View style={styles.inventoryItem} key={`possession${index}`}>
                                            <Text style={{flexGrow: 1}}>{index+1}</Text> 
                                            <Text style={{flexGrow: 7, borderBottom: "1px solid black", maxWidth: "100px", wordWrap: "break-word"}}>{element.toLowerCase()}</Text>
                                        </View>
                                   }
                               )}
                            </View>
                            <View style={styles.column}>
                                <View style={styles.currencyContainer} >
                                    <View style={styles.currency}>
                                        <View style={styles.cyrrencyLabel}>
                                                <Text style={{fontSize: 15, textAlign: "center"}}>Currency</Text>
                                        </View>
                                        <View style={styles.cyrrencyValue}>
                                                <Text>3d6 sp</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.provisionsContainer}>
                                    <View style={styles.provisions}>
                                        <View style={styles.provisionsHeader}>
                                            <Text>Provisions</Text>
                                        </View>
                                        <View style={styles.provisionsValues}>
                                            <View style={styles.provisionFilled}>
                                            </View>
                                            <View style={styles.provisionFilled} >
                                            </View>
                                            <View style={styles.provisionFilled}>
                                            </View>
                                            <View style={styles.provisionFilled} >
                                            </View>
                                            <View style={styles.provisionFilled}>
                                            </View>
                                            <View style={styles.provisionFilled} >
                                            </View>
                                        </View>
                                        <View style={styles.provisionsValues}>
                                            <View style={styles.provision}>
                                            </View>
                                            <View style={styles.provision} >
                                            </View>
                                            <View style={styles.provision}>
                                            </View>
                                            <View style={styles.provision} >
                                            </View>
                                            <View style={styles.provision}>
                                            </View>
                                            <View style={styles.provision} >
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>            
            </View>
        </View>
        
        <View style={styles.container} wrap={false}>
            <View style={styles.notesContainer}>
                <View style={styles.notesLabel}>
                    <Text>Wearing / Notes / Miens</Text>
                </View>
                <View style={styles.notesValue}>
                    {characterInfo.background.mien && 
                        <React.Fragment>
                            <View style={styles.column}>
                                <View style={styles.tableContainerMiens}>
                                    <View style={styles.tableName}>
                                        <Text>Mien</Text>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCell}>
                                            <Text>Index</Text>
                                        </View>
                                        <View style={styles.lastTableCell}>
                                            <Text>Value</Text>
                                        </View>
                                    </View>
                                    {
                                        characterInfo.background.mien.map((value, index)=>{
                                            return <View style={styles.tableRow} key={`mien${index}`}>
                                                <View style={styles.tableCell}>
                                                    <Text>{index}</Text>
                                                </View>
                                                <View style={styles.lastTableCell}>
                                                    <Text>{value}</Text>
                                                </View>
                                        </View>
                                        })
                                    }
                                </View>
                            </View>
                            <View style={styles.column}>
                                <Text>{characterInfo.notes}</Text>
                            </View>
                        </React.Fragment>
                    }
                    {!characterInfo.background.mien && 
                        <View style={styles.column}>
                            <Text>{characterInfo.notes}</Text>
                        </View>
                    }
                    {/* <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis voluptatum quas temporibus maxime id aperiam ad, vero cum illum fuga explicabo qui, dolorem non reiciendis et omnis veniam minima magni.</Text> */}
                </View>
            </View>
        </View>
        
        </Page>
    </Document>
}