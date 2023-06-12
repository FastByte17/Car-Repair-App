import {
  IonActionSheet,
  IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCol, IonContent, IonHeader, IonList, IonMenu, IonMenuButton, IonPage,
  IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import '../Tab2.css';
import { useState } from 'react';

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
            },
            {
              text: 'Inspection',
              handler: () => {
                console.log('Inspection is selected');
                close();
              },
            },
            {
              text: 'On Hold',
              handler: () => {
                console.log('On Hold is selected');
                close();
              },
            },
            {
              text: 'Quick Fix',
              handler: () => {
                console.log('Quick Fix is selected');
                close();
              },
            },
            {
              text: 'Wash',
              handler: () => {
                console.log('Wash is selected');
                close();
              },
            },
            {
              text: 'Done',
              handler: () => {
                console.log('Done is selected');
                close();
              },
            },
            {
              text: 'Billed',
              handler: () => {
                console.log('Billed is selected');
                close();
              },
            },
            {
              text: 'Cancelled',
              handler: () => {
                console.log('Cancelled is selected');
                close();
              },
            }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Inspection;
