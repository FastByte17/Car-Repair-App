import {
    IonCard, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
} from '@ionic/react';
import {
    Text,
    Container
} from '@chakra-ui/react'
import { DraggableStyleType, Column, User } from '../../types'
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useQueryClient } from '@tanstack/react-query';




type Props = {
    inspectionMenu: (taskId: string, columnId: string) => void,
    column: Column
}


const getItemStyle = (_isDragging: boolean, draggableStyle: DraggableStyleType) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: '4px 0px',
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "inherit",
    opacity: isDraggingOver ? 0.8 : 1,
    minHeight: 'fit-content',
    padding: '.2px',
});


const Card = ({ inspectionMenu, column }: Props) => {
    // Fetch user data from a query.
    const user = useQueryClient().getQueryData<User>(['user']);

    // Determine the color of the card based on the column title.
    const color = column.title === "In Progress" ? "warning" : (column.title === "On Hold" ? "danger" : (column.title === "Car Wash" ? "secondary" : "success"));

    return (
        <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
                <Container
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {column.tasks.filter(task => user?.role === 'ADMIN' ? true : !task.isHidden).map((task, index) => (
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
                                    <Text className='cardTitle'>{task.vehReg}</Text>
                                    <Text>{task.assigned.lastName}</Text>
                                    <Text fontSize={'sm'} noOfLines={2}>{task.note}</Text>
                                </IonCard>
                            )}
                        </Draggable >
                    ))}
                    {snapshot.isUsingPlaceholder && <div
                        style={{
                            opacity: 0, // Adjust the opacity of the placeholder
                            background: 'transparent', // Set the background color of the placeholder to transparent
                        }}
                    >
                        {provided.placeholder}
                    </div>}
                </Container>
            )}
        </Droppable >
    )
}

export default Card;