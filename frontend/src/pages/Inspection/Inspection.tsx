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
import { fetchColumns, fetchWorkers, fetchCurrentUser, addTask } from '../../api'
import { Columns, TaskForm, Worker, User, Role, Task, Column } from '../../types'
import Card from './Card'


const Inspection: React.FC = () => {
  const queryClient = useQueryClient();
  const toast = useToast()
  const { data: columns, status, error } = useQuery<Columns, Error>({ queryKey: ['columns'], queryFn: fetchColumns });
  const { data: user, status: userStatus, error: userError } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const { data: workers, status: workersStatus, error: workersError } = useQuery<Worker[], Error>({ queryKey: ['workers'], queryFn: fetchWorkers });
  const { mutate, isError, error: addTaskError } = useMutation<Task, Error, FormData, unknown>({ mutationKey: ['addTask'], mutationFn: addTask });
  //const { mutate: addColumn, error: addColumnError } = useMutation({ mutationKey: ['addColumn'], mutationFn: addTask });
  const [selectListVisible, setSelectListVisible] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [values, setValues] = useState<TaskForm>({
    vehReg: '',
    note: '',
    images: [],
    assigned: '',
  });

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
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




  return (
    <IonPage>
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
            {columns.map(item => (
              <Container key={item.id} className='card-container'>
                <p>{item.title}</p>
                <Card tasks={item.tasks} inspectionMenu={inspectionMenu} />
              </Container>
            ))}
            <Container className='card-container add-column'>
              <Button colorScheme='blue'>Add column</Button>
            </Container>
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
            <form onSubmit={handleSave}>
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
