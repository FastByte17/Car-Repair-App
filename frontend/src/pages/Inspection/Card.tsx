import React from 'react'
import {
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
    IonCardTitle,
} from '@ionic/react';
import { Tasks } from '../../types'


type Props = {
    tasks: Tasks,
    inspectionMenu: () => void,
}

const Card = ({ tasks, inspectionMenu }: Props) => {
    return (

        <div>{tasks.map((task) => (
            <IonCard color="warning" button={true} onClick={inspectionMenu} key={task.id}>
                <IonCardHeader>
                    <IonCardTitle className='cardTitle'>{task.vehReg}</IonCardTitle>
                    <IonCardSubtitle>Assigned to: {task.assigned.lastName}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>{task.note}</IonCardContent>
            </IonCard>
        ))}
        </div>
    )
}

export default Card;