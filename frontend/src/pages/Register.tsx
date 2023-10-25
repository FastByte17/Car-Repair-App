import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonText, IonButton, InputChangeEventDetail, InputCustomEvent } from '@ionic/react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { register } from '../api'
import './Login.css'

const defaultState = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    pin: '',
}

const Register = () => {
    const [values, setValues] = useState(defaultState)
    const [error, setError] = useState('');

    useEffect(() => { }, [error])

    const handleInputChange = (event: InputCustomEvent<InputChangeEventDetail>) => {
        const { name, value } = event.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await register(values);
            const { token, user } = response
            if (token && user) {
                const now = new Date()
                const days = 30;
                const millisecondsInADay = 24 * 60 * 60 * 1000;
                const ttl = days * millisecondsInADay;

                const item = {
                    value: user.device,
                    expiry: now.getTime() + ttl,
                }
                localStorage.setItem('device', JSON.stringify(item))
                localStorage.setItem('token', token)
            }
            setValues(defaultState)
        } catch (e) {
            console.error(e)
            setError(e + '')
            setTimeout(() => {
                setError('')
            }, 3000)
        }

    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="loginTitle">Already have an account ?<Link className='linkStyle' to="/login">Login</Link></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" >
                <form onSubmit={handleSubmit}>
                    <IonItem >
                        <IonLabel position="floating">First Name</IonLabel>
                        <IonInput aria-label="firstName" name="firstName" type="text" value={values.firstName} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Last Name</IonLabel>
                        <IonInput aria-label="lastName" name="lastName" type="text" value={values.lastName} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Phone Number</IonLabel>
                        <IonInput aria-label="phoneNumber" name="phoneNumber" type="number" value={values.phoneNumber} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput aria-label="email" name="email" type="email" value={values.email} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput aria-label="password" name="password" type="password" value={values.password} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Confirm Password</IonLabel>
                        <IonInput aria-label="confirmPassword" name="confirmPassword" type="password" value={values.confirmPassword} onIonInput={handleInputChange} />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">PIN</IonLabel>
                        <IonInput aria-label="pin" name="pin" type="number" value={values.pin} onIonInput={handleInputChange} />
                    </IonItem>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <IonText color="danger">{error}</IonText>
                        <IonButton type="submit" className="ion-margin-top" color="primary">
                            Register
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    )
}

export default Register