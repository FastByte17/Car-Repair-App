import React, { useState } from 'react';
import { IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const PinCodeLogin: React.FC = () => {
    const [pin, setPin] = useState<string>('');

    const handleInputChange = (event: CustomEvent) => {
        setPin(event.detail.value!);
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
                        <IonInput type="password" value={pin} onIonChange={handleInputChange} maxlength={4} />
                    </IonItem>
                    <button type="submit" className="ion-margin-top ion-button ion-button-solid ion-button-color-primary">
                        Login
                    </button>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default PinCodeLogin;
