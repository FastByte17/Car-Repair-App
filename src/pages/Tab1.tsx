import React, { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';

const Tab1: React.FC = () => {
  const [pin, setPin] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (event: CustomEvent) => {
    const value = event.detail.value;
    if (!/^[0-9]*$/.test(value)) {
      setPasswordError('Password must only contain numbers.');
    } else {
      setPasswordError('');
    }
    setPin(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle pin code login logic here
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pin Code Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Enter Pin Code</IonLabel>
            <IonInput type="password" value={pin} maxlength={4} onIonChange={handleInputChange} pattern="[0-9]*" style={{ width: '100%' }} />
            <IonText color="danger">{passwordError}</IonText>
          </IonItem>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IonButton type="submit" className="ion-margin-top" color="primary">
              Login
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
