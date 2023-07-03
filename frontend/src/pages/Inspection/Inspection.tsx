import {
  IonActionSheet,
  IonContent, IonFab, IonFabButton,
  IonGrid,
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
  Container

} from '@chakra-ui/react'
import '../Tab2.css';
import { useState, FormEvent } from 'react';
import {
  add,
  checkmarkCircleOutline, closeCircleOutline, constructOutline, createOutline, hourglassOutline,
  informationCircleOutline,
  playForwardOutline, receiptOutline, waterOutline
} from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchColumns, fetchWorkers, fetchCurrentUser, addTask, addColumn, reOrder } from '../../api'
import { Columns, TaskForm, Worker, User, Role, Task, Column, ColumnFormInput, reOrderInput } from '../../types'
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Card from './Card'


const Inspection: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast()
  const { data: columns, status, error } = useQuery<Columns, Error>({ queryKey: ['columns'], queryFn: fetchColumns });
  const { data: user, status: userStatus, error: userError } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const { data: workers, status: workersStatus, error: workersError } = useQuery<Worker[], Error>({ queryKey: ['workers'], queryFn: fetchWorkers });
  const { mutate, isError, error: addTaskError } = useMutation<Task, Error, FormData, unknown>({ mutationKey: ['addTask'], mutationFn: addTask });
  const { mutate: createColumn } = useMutation<Column, Error, ColumnFormInput, unknown>({ mutationKey: ['addColumn'], mutationFn: addColumn });
  const { mutate: reorderTasks } = useMutation<Task[], Error, reOrderInput, unknown>({ mutationKey: ['reorderTasks'], mutationFn: reOrder });
  const [selectListVisible, setSelectListVisible] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
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
      task.append('vehReg', values.vehReg)
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
    setShowPopover(false);
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

  const handleCancel = () => {
    // Close the popover without saving
    setShowPopover(false);
  };

  const inspectionMenu = () => {
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
      reorderTasks({ columnId: result.destination.droppableId, taskId: result.draggableId, newPosition: (result.destination.index + 1) }, {
        onSuccess: () => {
          queryClient.setQueryData(['columns'], newColumns)
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

        <>
          <IonActionSheet
            isOpen={selectListVisible}
            onDidDismiss={closeInspectionMenu}
            cssClass="my-action-sheet"
            buttons={[
              {
                text: 'History',
                handler: () => {
                  console.log('History is selected');
                  close();
                },
                icon: informationCircleOutline,
              },
              {
                text: 'In Progress',
                handler: () => {
                  console.log('In Progress is selected');
                  close();
                },
                icon: constructOutline,
              },
              {
                text: 'Inspection',
                handler: () => {
                  console.log('Inspection is selected');
                  close();
                },
                icon: createOutline,
              },
              {
                text: 'On Hold',
                handler: () => {
                  console.log('On Hold is selected');
                  close();
                },
                icon: hourglassOutline,
              },
              {
                text: 'Quick Fix',
                handler: () => {
                  console.log('Quick Fix is selected');
                  close();
                },
                icon: playForwardOutline,
              },
              {
                text: 'Wash',
                handler: () => {
                  console.log('Wash is selected');
                  close();
                },
                icon: waterOutline,
              },
              {
                text: 'Done',
                handler: () => {
                  console.log('Done is selected');
                  close();
                },
                icon: checkmarkCircleOutline,
              },
              {
                text: 'Billed',
                handler: () => {
                  console.log('Billed is selected');
                  close();
                },
                icon: receiptOutline,
              },
              {
                text: 'Cancelled',
                handler: () => {
                  console.log('Cancelled is selected');
                  close();
                },
                icon: closeCircleOutline,
              }
            ]}
          />
        </>

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => setShowPopover(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonPopover
          isOpen={showPopover}
          side='top'
          alignment='center'
          onDidDismiss={() => setShowPopover(false)}>
          <IonContent>
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
              <Flex gap={2} margin={4 | 0}>
                <Button colorScheme='red' type='button' onClick={handleCancel}>Cancel</Button>
                <Button colorScheme='blue' type='submit'>Save</Button>
                {isError && <FormErrorMessage marginTop={2}>{addTaskError.message}</FormErrorMessage>}
              </Flex>
            </form>
          </IonContent>
        </IonPopover>

      </IonContent >
    </IonPage >
  );
};

export default Inspection;
