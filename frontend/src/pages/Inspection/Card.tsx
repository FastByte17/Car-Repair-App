import React from 'react'
import {
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
} from '@ionic/react';
import { Tasks, DraggableStyleType } from '../../types'
import { Draggable } from "react-beautiful-dnd";



type Props = {
    tasks: Tasks,
    inspectionMenu: (taskId: string, columnId: string) => void,
    columnTitle: string
}


const getItemStyle = (isDragging: boolean, draggableStyle: DraggableStyleType) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 8 * 2,
    margin: `0 0 ${8}px 0`,
    ...draggableStyle
});

const Card = ({ tasks, inspectionMenu, columnTitle }: Props) => {
    const color = columnTitle === "In Progress" ? "warning" : (columnTitle === "On Hold" ? "danger" : (columnTitle === "Car Wash" ? "secondary" : "success"));
    return (
        <div>
            {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                        <IonCard
                            color={color}
                            button={true}
                            onClick={() => inspectionMenu(task.id, task.columnId)}
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