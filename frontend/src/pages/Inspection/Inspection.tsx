import {
  IonActionSheet,
  IonContent, IonFab, IonFabButton,
  IonHeader, IonIcon,
  IonPage, IonPopover, IonTitle, IonToolbar
} from '@ionic/react';
import {
  FormLabel,
  Input,
  FormErrorMessage,
  Select,
  Textarea,
  Button,
  Box,
  Flex,
  useToast,
  Container,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@chakra-ui/react'
import '../Tab2.css';
import { useState, FormEvent } from 'react';
import { add, trash, create, informationCircle } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchColumns, fetchWorkers, fetchCurrentUser, addTask, addColumn, reOrder, deleteTask } from '../../api'
import { Columns, TaskForm, Worker, User, Role, Task, Column, ColumnFormInput, reOrderInput } from '../../types'
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Card from './Card'
import EditTask from './EditTask';
import Detail from './Detail';


const Inspection: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { data: columns, status, error } = useQuery<Columns, Error>({ queryKey: ['columns'], queryFn: fetchColumns });
  const { data: user, status: userStatus } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const { data: workers, status: workersStatus } = useQuery<Worker[], Error>({ queryKey: ['workers'], queryFn: fetchWorkers });
  const { mutate, isError, error: addTaskError } = useMutation<Task, Error, FormData, unknown>({ mutationKey: ['addTask'], mutationFn: addTask });
  const { mutate: createColumn } = useMutation<Column, Error, ColumnFormInput, unknown>({ mutationKey: ['addColumn'], mutationFn: addColumn });
  const { mutate: reorderTasks } = useMutation<Task[], Error, reOrderInput, unknown>({ mutationKey: ['reorderTasks'], mutationFn: reOrder });
  const { mutate: deleteATask } = useMutation<Task, Error, string, unknown>({ mutationKey: ['deleteTask'], mutationFn: deleteTask });
  const [selectListVisible, setSelectListVisible] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState({
    taskId: '',
    columnId: '',
  });
  const [values, setValues] = useState<TaskForm>({
    vehReg: '',
    note: '',
    images: [],
    assigned: '',
  });



  const addTaskToDb = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!columns || columns.length < 0) {
      toast({
        title: 'Create a column before creating a task',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      const task = new FormData()
      const assigned = (user && user.role === Role.EMPLOYEE) ? user.id : values.assigned
      task.append('vehReg', values.vehReg.toUpperCase())
      task.append('note', values.note)
      values.images.length > 0 && Array.from(values.images).forEach((file) => {
        task.append('images', file, file.name)
      })
      task.append('assigned', assigned)
      task.append('column', columns[0].id.toString())
      mutate(task, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns'] })
        }
      })
    }
    onClose();
  };

  const addColumnToDb = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!columnTitle) {
      return toast({
        title: 'Column must have a title',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }


    createColumn({ title: columnTitle }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['columns'] })
      },
    })
  }


  const inspectionMenu = (taskId: string, columnId: string) => {
    setSelectedCard({ taskId, columnId });
    setSelectListVisible(true);
  };

  const closeInspectionMenu = () => {
    setSelectListVisible(false);
  };

  const onDragEnd = (result: DropResult) => {

    // dropped outside the list
    if (!result.destination) {
      return;
    }


    // dropped in the same place
    if (result.source.droppableId === result.destination.droppableId && result.source.index === result.destination.index) {
      return;
    }

    if (columns) {
      const newColumns = Array.from(columns)
      const sourceColumn = newColumns.find(column => column.id === result.source.droppableId)
      const destinationColumn = newColumns.find(column => column.id === result.destination?.droppableId)
      if (sourceColumn && destinationColumn) {
        const newTask = sourceColumn.tasks.find(task => task.id === result.draggableId)
        if (sourceColumn === destinationColumn && newTask) {
          newColumns[newColumns.indexOf(sourceColumn)].tasks.splice(result.source.index, 1)
          newColumns[newColumns.indexOf(sourceColumn)].tasks.splice(result.destination.index, 0, newTask)
        } else {
          if (newTask) {
            newColumns[newColumns.indexOf(sourceColumn)].tasks.splice(result.source.index, 1)
            newColumns[newColumns.indexOf(destinationColumn)].tasks.splice(result.destination.index, 0, newTask)
          }
        }
      }

      reorderTasks({ columnId: result.destination.droppableId, taskId: result.draggableId, newPosition: (result.destination.index + 1), columnTitle: destinationColumn?.title ?? '' }, {
        onSuccess: () => {
          queryClient.setQueryData(['columns'], newColumns)
          queryClient.invalidateQueries({ queryKey: ['columns'] })
        }
      })
    }

  }

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    opacity: isDraggingOver ? 0.8 : 1,
  });


  return (
    <IonPage >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inspection</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inspection</IonTitle>
          </IonToolbar>
        </IonHeader>

        {status === 'error' && <p>Error fetching data: {error?.message}</p>}
        {status === 'loading' && <p>Loading...</p>}
        {status === 'success' &&
          <Container className="column-container" >
            <DragDropContext onDragEnd={onDragEnd}>
              {columns.map((item, _index) => (
                <Droppable droppableId={item.id} key={item.id}>
                  {(provided, snapshot) => (
                    <Container
                      className='column-item'
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <p>{item.title}</p>
                      <Card tasks={item.tasks} inspectionMenu={inspectionMenu} columnTitle={item.title} />
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
                </Droppable>

              ))}
              <Container className='column-item'>
                <form onSubmit={addColumnToDb} className='column-input'>
                  <Input placeholder='add column' value={columnTitle} onChange={({ target }) => setColumnTitle(target.value)} />
                  <Button type='submit'>Add column</Button>
                </form>
              </Container>
            </DragDropContext>
          </Container>
        }

        <EditTask
          showEditModal={isEditOpen}
          onCloseEditModal={onEditClose}
          userStatus={userStatus}
          workersStatus={workersStatus}
          user={user}
          workers={workers}
          card={selectedCard}
        />

        <Detail
          isDetailOpen={isDetailOpen}
          onDetailClose={onDetailClose}
          card={selectedCard} />

        <>
          <IonActionSheet
            isOpen={selectListVisible}
            onDidDismiss={closeInspectionMenu}
            cssClass="my-action-sheet"
            buttons={[
              {
                text: 'Delete',
                handler: async () => {
                  if (selectedCard.taskId) {
                    deleteATask(selectedCard.taskId, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['columns'] })
                        toast({
                          title: 'task was deleted',
                          status: 'error',
                          duration: 5000,
                          isClosable: true,
                        })
                      }
                    })
                  }
                  close();
                },
                icon: trash,
              },
              {
                text: 'Edit',
                handler: () => {
                  onEditOpen();
                },
                icon: create,
              },
              {
                text: 'Details',
                handler: () => {
                  onDetailOpen()
                },
                icon: informationCircle,
              },
            ]}
          />
        </>

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={onOpen}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Task</ModalHeader>
            <Container className="ion-padding dialogue">
              <form onSubmit={addTaskToDb}>
                <Box margin={2}>
                  <FormLabel>Vehicle Reg Number</FormLabel>
                  <Input type='text' placeholder='ABC-123' isRequired={true} value={values.vehReg} onChange={(e) => setValues({ ...values, vehReg: e.target.value })} />
                  <FormErrorMessage>{''}</FormErrorMessage>
                </Box>
                <Box margin={2}>
                  <FormLabel mb='8px'>Notes</FormLabel>
                  <Textarea
                    resize={'none'}
                    isRequired={true}
                    value={values.note}
                    onChange={(e) => setValues({ ...values, note: e.target.value })}
                    placeholder='Write note'
                    size='sm'
                  />
                </Box>
                <Box>
                  <Input type='file' name='images' onChange={({ target }) =>
                    setValues({ ...values, images: target.files ? target.files : [] })
                  } />
                  <FormErrorMessage>{''}</FormErrorMessage>
                </Box>
                {userStatus === 'success' && (user.role === Role.MANAGER || user.role === Role.ADMIN) && <Box margin={2}>
                  <FormLabel>Assign to Worker:</FormLabel>
                  <Select placeholder='Select worker' value={values.assigned} onChange={(e) => setValues({ ...values, assigned: e.target.value })} isRequired={true}>
                    {workersStatus === 'success' && workers.map((worker) =>
                      <option value={worker.id} key={worker.id}>{worker.firstName} {worker.lastName}</option>
                    )}
                  </Select>
                  <FormErrorMessage>{''}</FormErrorMessage>
                </Box>}
                <ModalFooter>
                  <Flex gap={2} margin={4 | 0}>
                    <Button colorScheme='red' type='button' onClick={onClose}>Cancel</Button>
                    <Button colorScheme='blue' type='submit'>Save</Button>
                    {isError && <FormErrorMessage marginTop={2}>{addTaskError.message}</FormErrorMessage>}
                  </Flex>
                </ModalFooter>
              </form>
            </Container>
          </ModalContent>
        </Modal>
      </IonContent >
    </IonPage >
  );
};

export default Inspection;
