import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonText, IonImg, InputCustomEvent, InputChangeEventDetail } from '@ionic/react';
import './Login.css'
import { login } from '../api'
import { Link, useHistory } from 'react-router-dom';

const defaultValues = {
  email: '',
  password: '',
}

const Login: React.FC = (props) => {
  // State to manage the PIN input.
  const [pin, setPin] = useState('');

  // State to manage login form inputs with default values.
  const [loginInputs, setLoginInputs] = useState(defaultValues);

  // State to manage error messages.
  const [error, setError] = useState('');

  // Get the device ID from local storage.
  const deviceId = localStorage.getItem('device')

  // Access the routing history.
  const history = useHistory();


  useEffect(() => { }, [error])

  // Function to handle input changes in the form fields.
  const handleInputChange = (event: InputCustomEvent<InputChangeEventDetail>) => {
    const { name, value } = event.target;
    if (name === 'pin') {
      setPin(value + '');
    } else {
      setLoginInputs((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  };

  // Function to retrieve device ID from local storage with expiry check.
  const getWithExpiry = () => {
    if (!deviceId) {
      return null
    }
    const item = JSON.parse(deviceId)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem('device')
      return null
    }
    return item.value
  }

  // Function to handle form submission.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = deviceId ? { pin, device: (JSON.parse(deviceId).value) as string } : loginInputs
      const response = await login(data);
      const { token, user } = response
      const deviceIdExists = getWithExpiry()
      if (token && user) {
        if (!deviceIdExists) {
          const now = new Date()
          const days = 30;
          const millisecondsInADay = 24 * 60 * 60 * 1000;
          const ttl = days * millisecondsInADay;
          const item = {
            value: user.device,
            expiry: now.getTime() + ttl,
          }
          localStorage.setItem('device', JSON.stringify(item))
        }

        localStorage.setItem('token', token)
      }
    } catch (e) {
      console.error(e)
      setError(e + '')
      setTimeout(() => {
        setError('')
      }, 3000)
    } finally {
      setLoginInputs(defaultValues)
      setPin('')
      history.push('/inspection')

    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="loginTitle">Welcome to Car Repair App!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          {deviceId ? (
            // Render PIN input if device ID exists.
            <IonItem>
              <IonLabel position="floating">Enter Pin Code</IonLabel>
              <IonInput type="number" name='pin' value={pin} maxlength={4} onIonInput={handleInputChange} pattern="[0-9]*" style={{ width: '100%' }} />
            </IonItem>
          ) :
            (
              // Render email and password inputs if no device ID.
              <div>
                <IonItem>
                  <IonLabel position="floating">email</IonLabel>
                  <IonInput type="email" name='email' value={loginInputs.email} onIonInput={handleInputChange} style={{ width: '100%' }} />
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">password</IonLabel>
                  <IonInput type="password" name='password' value={loginInputs.password} onIonInput={handleInputChange} style={{ width: '100%' }} />
                </IonItem>
              </div>
            )}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <IonText color="danger">{error}</IonText>
            <IonButton type="submit" className="ion-margin-top" color="primary">
              Login
            </IonButton>
            <IonTitle className="loginTitle">Don't have an account?
              <Link to='/register' className='linkStyle'>Register Now!</Link>
            </IonTitle>
          </div>
        </form>
      </IonContent>
    </IonPage >
  );
};

export default Login;
