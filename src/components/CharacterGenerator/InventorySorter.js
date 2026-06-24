import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCharacterInfo } from '../../store/characterSlice';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { List, ListItem, ListItemText } from "@mui/material";
import DragHandleIcon from '@mui/icons-material/DragHandle';

export default function InventorySorter() {
  const dispatch = useDispatch();
  const characterInfo = useSelector((state) => state.character.characterInfo);
  const [possessions, setPossessions] = useState([]);

  useEffect(() => {
    if (characterInfo.background?.possessions) {
      setPossessions(characterInfo.background.possessions);
    }
  }, [characterInfo.background?.possessions]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = reorder(possessions, result.source.index, result.destination.index);
    setPossessions(items);
    dispatch(setCharacterInfo({
      ...characterInfo,
      background: {
        ...characterInfo.background,
        possessions: items,
      },
    }));
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    ...draggableStyle,
    ...(isDragging && { background: "rgb(235,235,235)" }),
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <List ref={provided.innerRef} {...provided.droppableProps} style={{ width: "100%" }}>
            {possessions && possessions.length > 0 && possessions.map((item, index) => (
              <Draggable key={`item${index}`} draggableId={`item${index}`} index={index}>
                {(provided, snapshot) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                    secondaryAction={<DragHandleIcon />}
                  >
                    <ListItemText
                      primary={item.toLowerCase()}
                      style={{ textTransform: "capitalize" }}
                    />
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}
