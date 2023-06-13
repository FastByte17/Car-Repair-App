import {
  IonActionSheet,
  IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonList, IonMenu, IonMenuButton, IonPage,
  IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import '../Tab2.css';
import { useState } from 'react';
import {
  checkmarkCircleOutline, closeCircleOutline, constructOutline, createOutline, hourglassOutline,
  playForwardOutline, receiptOutline, waterOutline
} from 'ionicons/icons';

const Inspection: React.FC = () => {

  const [selectListVisible, setSelectListVisible] = useState(false);

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

        <h1>Entered</h1>
        <IonCard color="light" button={true} onClick={inspectionMenu}>
          <IonCardHeader>
            <IonCardTitle>Card Title</IonCardTitle>
            <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>Card Content</IonCardContent>
        </IonCard>
        <>
          <IonActionSheet
            isOpen={selectListVisible}
            onDidDismiss={closeInspectionMenu}
            cssClass="my-action-sheet"
            buttons={[
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
      </IonContent>
    </IonPage>
  );
};

export default Inspection;
