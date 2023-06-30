import React from 'react'
import {
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
} from '@ionic/react';
import { Tasks, DraggableStyleType } from '../../types'
import { Draggable } from "react-beautiful-dnd";



type Props = {
    tasks: Tasks,
    inspectionMenu: () => void,
}


const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyleType) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,
    // change background colour if dragging
    //background: isDragging ? "lightgreen" : "lightgrey",
    // styles we need to apply on draggables
    ...draggableStyle
});

const Card = ({ tasks, inspectionMenu }: Props) => {
    return (

        <div>
            {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                        <IonCard
                            color="warning"
                            button={true}
                            onClick={inspectionMenu}
                            key={task.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                            )}
                        >
                            <IonCardHeader>
                                <IonCardTitle className='cardTitle'>{task.vehReg}</IonCardTitle>
                                <IonCardSubtitle>Assigned to: {task.assigned.lastName}</IonCardSubtitle>
                            </IonCardHeader>
                            <IonCardContent>{task.note}</IonCardContent>
                        </IonCard>
                    )}
                </Draggable >
            ))}
        </div>
    )
}

export default Card;