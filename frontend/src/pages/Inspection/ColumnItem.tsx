import { Container, Input, Button, Text, ToastId } from '@chakra-ui/react'
import React, { FormEvent } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Columns } from '../../types'
import Card from './Card'


type Props = {
    status: string,
    error: Error | null,
    columns: Columns | undefined,
    onDragEnd: (result: DropResult) => void,
    addColumnToDb: (e: FormEvent<HTMLFormElement>) => ToastId | undefined,
    columnTitle: string,
    setColumnTitle: React.Dispatch<React.SetStateAction<string>>,
    inspectionMenu: (taskId: string, columnId: string) => void,
}

const getListStyle = (isDraggingOver: boolean) => ({
    background: "inherit",
    opacity: isDraggingOver ? 0.8 : 1,
});


const ColumnItem = ({ status, error, columns, onDragEnd, inspectionMenu, addColumnToDb, columnTitle, setColumnTitle }: Props) => {
    return (
        <>
            {status === 'error' && <p>Error fetching data: {error?.message}</p>}
            {status === 'loading' && <p>Loading...</p>}
            {status === 'success' && columns &&
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId='all-columns'
                        direction='horizontal'
                        type='column'>
                        {(provided, snapshot) => (
                            <Container
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="column-container"
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {columns.map((item, index) => (
                                    <Draggable draggableId={item.id} index={index} key={item.id}>
                                        {(provided) => (
                                            <Container
                                                className='column-item'
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}
                                            >
                                                <Text {...provided.dragHandleProps} fontSize={['lg', 'xl', '2xl', '4xl']}>{item.title}</Text>
                                                <Card inspectionMenu={inspectionMenu} column={item} />
                                            </Container>
                                        )}
                                    </Draggable>
                                ))}
                                {snapshot.isUsingPlaceholder && <div
                                    style={{
                                        opacity: 0, // Adjust the opacity of the placeholder
                                        background: 'transparent', // Set the background color of the placeholder to transparent
                                    }}
                                >
                                    {provided.placeholder}
                                </div>}
                                <Container className='column-item'>
                                    <form onSubmit={addColumnToDb} className='column-input'>
                                        <Input placeholder='add column' value={columnTitle} onChange={({ target }) => setColumnTitle(target.value)} />
                                        <Button type='submit'>Add column</Button>
                                    </form>
                                </Container>
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            }
        </>)
}

export default ColumnItem