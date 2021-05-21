import React, { useContext, useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {Store} from "../../Store";

// fake data generator
// const getItems = count =>
//   Array.from({ length: count }, (v, k) => k).map(k => ({
//     id: `item-${k}`,
//     primary: `item ${k}`,
//     secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined
//   }));

// a little function to help us with reordering the result

export default function Inventory() {

  const {state, dispatch} = useContext(Store);

  const [possessions, setPossessions] = useState([]);

  useEffect(()=>{
    setPossessions(state.characterInfo.background.possessions)
  }, [state.characterInfo.background.possessions])

  const onDragEnd = (result)  => {

    let updatedCharacterInfo = {};
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(result.source.index);
    console.log(result.destination.index);

    const items = reorder(
      possessions,
      result.source.index,
      result.destination.index
    );

    updatedCharacterInfo =  Object.assign({}, state.characterInfo);

    updatedCharacterInfo.background.possessions = items;
    
    dispatch({type:"SET_CHARACTER_INFO", payload: updatedCharacterInfo});
    setPossessions(items);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
  
    ...(isDragging && {
      background: "rgb(235,235,235)"
    })
  });

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  // render() {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <RootRef rootRef={provided.innerRef}>
              <List style={{width: "100%"}}>
                {possessions && possessions.length > 0 && possessions.map((item, index) => {
                  return <Draggable key={`item${index}`} draggableId={`item${index}`} index={index}>
                    {(provided, snapshot) => (
                      <ListItem
                        ContainerComponent="li"
                        ContainerProps={{ ref: provided.innerRef }}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <ListItemText
                          primary={item}
                        />
                        <ListItemSecondaryAction>
                            <DragHandleIcon />
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                  })}
                {provided.placeholder}
              </List>
            </RootRef>
          )}
        </Droppable>
      </DragDropContext>
    );
  // }
}
