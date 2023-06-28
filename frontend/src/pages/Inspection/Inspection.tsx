import {
  IonActionSheet,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCol, IonContent, IonFab, IonFabButton,
  IonGrid,
  IonHeader, IonIcon,
  IonPage, IonPopover, IonRow, IonTitle, IonToolbar
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
import { fetchTasks, fetchWorkers, fetchCurrentUser, addTask } from '../../api'
import { State, Tasks, TaskForm, Worker, User, Role, Task } from '../../types'


const Inspection: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, status, error } = useQuery<Tasks, Error>({ queryKey: ['items'], queryFn: fetchTasks });
  const { data: user, status: userStatus, error: userError } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const { data: workers, status: workersStatus, error: workersError } = useQuery<Worker[], Error>({ queryKey: ['workers'], queryFn: fetchWorkers });
  const { mutate, isError, error: addTaskError } = useMutation<Task, Error, FormData, unknown>({ mutationKey: ['addTask'], mutationFn: addTask });
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
    // Close the alert
    const task = new FormData()
    const assigned = (user && user.role === Role.EMPLOYEE) ? user.id : values.assigned
    task.append('vehReg', values.vehReg)
    task.append('note', values.note)
    values.images.length > 0 && Array.from(values.images).forEach((file, i) => {
      task.append('images', file, file.name)
    })
    task.append('assigned', assigned)
    mutate(task, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] })
      }
    })
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
          <>
            <IonGrid fixed={true} className='grid'>
              <IonRow className="card-row" >

                <IonCol>
                  <div className='card-container'>
                    <p>In Progress</p>
                    {data.filter(task => task.state === State.IN_PROGRESS).map((item) =>
                      < IonCard color="warning" button={true} onClick={inspectionMenu} key={item.id}>
                        <IonCardHeader>
                          <IonCardTitle className='cardTitle'>{item.vehReg}</IonCardTitle>
                          <IonCardSubtitle>Assigned to: {item.assigned.lastName}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>{item.note}</IonCardContent>
                      </IonCard>)}
                  </div>
                </IonCol>

                <IonCol>
                  <div className='card-container'>
                    <p>On Hold</p>
                    {data.filter(task => task.state === State.ON_HOLD).map((item) =>
                      < IonCard color="danger" button={true} onClick={inspectionMenu} key={item.id}>
                        <IonCardHeader>
                          <IonCardTitle className='cardTitle'>{item.vehReg}</IonCardTitle>
                          <IonCardSubtitle>Assigned to: {item.assigned.lastName}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>{item.note}</IonCardContent>
                      </IonCard>)}
                  </div>
                </IonCol>

                <IonCol>
                  <div className='card-container'>
                    <p>Car Wash</p>
                    {data.filter(task => task.state === State.CAR_WASH).map((item) =>
                      < IonCard color="secondary" button={true} onClick={inspectionMenu} key={item.id}>
                        <IonCardHeader>
                          <IonCardTitle className='cardTitle'>{item.vehReg}</IonCardTitle>
                          <IonCardSubtitle>Assigned to: {item.assigned.lastName}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>{item.note}</IonCardContent>
                      </IonCard>)}
                  </div>
                </IonCol>

                <IonCol>
                  <div className='card-container'>
                    <p>Done</p>
                    {data.filter(task => task.state === State.DONE).map((item) =>
                      < IonCard color="success" button={true} onClick={inspectionMenu} key={item.id}>
                        <IonCardHeader>
                          <IonCardTitle className='cardTitle'>{item.vehReg}</IonCardTitle>
                          <IonCardSubtitle>Assigned to: {item.assigned.lastName}</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>{item.note}</IonCardContent>
                      </IonCard>)}
                  </div>
                </IonCol>

              </IonRow>
            </IonGrid>
          </>}

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
