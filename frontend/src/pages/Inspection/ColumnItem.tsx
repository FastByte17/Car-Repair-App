import { Container, Input, Button, ToastId, Menu, MenuButton, MenuList, MenuItem, IconButton, Icon, useToast, useOutsideClick } from '@chakra-ui/react'
import React, { FormEvent } from 'react'
import { AiOutlineEllipsis } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Columns, Column, EditColumn } from '../../types'
import Card from './Card'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteColumn, editColumn } from '../../api'
import EditableLabel from './EditableLabel';




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
    // Initialize mutation functions and query client for managing columns.
    const { mutate: deleteCol } = useMutation<Column, Error, string, unknown>({ mutationKey: ['deleteColumn'], mutationFn: deleteColumn });
    const { mutate: editCol } = useMutation<Column, Error, EditColumn, unknown>({ mutationKey: ['editColumn'], mutationFn: editColumn });
    const queryClient = useQueryClient();
    const toast = useToast()


    // Function to delete a column in the database.
    const deleteColumnInDb = (id: string) => {
        deleteCol(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['columns'] })
                toast({
                    title: 'column was deleted',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        })
    }

    // Function to edit a column in the database.
    const editColumnInDb = (title: string, id: string) => {
        if (!title || title.length > 11) {
            return toast({
                title: 'title must be max 11 characters',
                status: 'info',
                duration: 4000,
                isClosable: true,
            })
        }

        editCol({ title, id }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['columns'] })
                toast({
                    title: 'column was edited',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }
        })
    }

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
                                                <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <EditableLabel
                                                        text={item.title}
                                                        onSave={editColumnInDb}
                                                        provided={provided}
                                                        column={item}
                                                    />
                                                    <Menu>
                                                        <MenuButton
                                                            background='#4a4848'
                                                            as={IconButton}
                                                            aria-label='Options'
                                                            icon={<Icon as={AiOutlineEllipsis} boxSize={7} />}
                                                            variant='outline'
                                                            size={'xs'}
                                                        />
                                                        <MenuList background='#1f1f1f'>
                                                            <MenuItem background='#1f1f1f' icon={<Icon as={MdDelete} />} onClick={() => deleteColumnInDb(item.id)}>
                                                                Delete
                                                            </MenuItem>
                                                        </MenuList>
                                                    </Menu>
                                                </Container>
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