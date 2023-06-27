import {
  IonActionSheet,
  IonAlert,
  IonButton,
  IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCol, IonContent, IonFab, IonFabButton,
  IonGrid,
  IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList,
  IonMenu, IonMenuButton, IonPage, IonPopover, IonRow, IonSelect,
  IonSelectOption, IonTextarea, IonTitle, IonToolbar
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import '../Tab2.css';
import { useState, useEffect } from 'react';
import {
  add,
  checkmarkCircleOutline, closeCircleOutline, constructOutline, createOutline, hourglassOutline,
  informationCircleOutline,
  playForwardOutline, receiptOutline, waterOutline
} from 'ionicons/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../../api'
import { State, Tasks } from '../../types'

const Inspection: React.FC = () => {
  const { data, status, error } = useQuery<Tasks, Error>({ queryKey: ['items'], queryFn: fetchTasks });
  const [selectListVisible, setSelectListVisible] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [regNumber, setRegNumber] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    // Perform any necessary actions with the entered data
    console.log('Vehicle Reg Number:', regNumber);
    console.log('Selected Option:', selectedOption);
    console.log('Notes:', notes);

    // Close the alert
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
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Vehicle Reg Number</IonLabel>
                <IonInput
                  value={regNumber}
                  placeholder="Vehicle Reg Number"
                  onIonChange={(e) => setRegNumber(e.detail.value!)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel>Select an option:</IonLabel>
                <IonSelect
                  value={selectedOption}
                  placeholder="Select option"
                  onIonChange={(e) => setSelectedOption(e.detail.value)}>
                  <IonSelectOption value="Option 1">Option 1</IonSelectOption>
                  <IonSelectOption value="Option 2">Option 2</IonSelectOption>
                  <IonSelectOption value="Option 3">Option 3</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Notes:</IonLabel>
                <IonTextarea
                  value={notes}
                  onIonChange={(e) => setNotes(e.detail.value!)}
                ></IonTextarea>
              </IonItem>
            </IonList>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
              <IonButton onClick={handleCancel}>Cancel</IonButton>
              <IonButton onClick={handleSave}>Save</IonButton>
            </div>
          </IonContent>
        </IonPopover>

      </IonContent>
    </IonPage >
  );
};

export default Inspection;
