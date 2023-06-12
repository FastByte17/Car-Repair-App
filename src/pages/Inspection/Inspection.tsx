import {
  IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCol, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage,
  IonRow, IonTitle, IonToolbar
} from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './Tab2.css';

const Inspection: React.FC = () => {
  return (
    <><IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Inspection Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">This is the menu content.</IonContent>
    </IonMenu><IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Inspection</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <h1>Entered</h1>

          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>Card Title</IonCardTitle>
              <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>Card Content</IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage></>
  );
};

export default Inspection;
