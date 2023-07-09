import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab3.css';
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchColumns, fetchWorkers } from '../api'
import { Columns, Worker, } from '../types';


const Summary: React.FC = () => {
    const { data: columns } = useQuery<Columns, Error>({ queryKey: ['columns'], queryFn: fetchColumns });
    const { data: workers } = useQuery<Worker[], Error>({ queryKey: ['workers'], queryFn: fetchWorkers });


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Summary</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Summary</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {columns && <TableContainer>
                    <Table variant='simple'>
                        <Thead >
                            <Tr>
                                <Th key={Date.now()} color={'white'}>Workers</Th>
                                {columns.map((column) => <Th key={column.id} color={'white'}>{column.title}</Th>)}
                            </Tr>
                        </Thead>
                        {workers && <Tbody>
                            {workers?.map((worker) => {
                                const inProgress = worker.MyTasks.filter(task => task.column.title === 'In Progress').length;
                                const onHold = worker.MyTasks.filter(task => task.column.title === 'On Hold').length;
                                const carWash = worker.MyTasks.filter(task => task.column.title === 'Car Wash').length;
                                const done = worker.MyTasks.filter(task => task.column.title === 'Done').length;
                                return (
                                    <Tr key={worker.id}>
                                        <Th color={'white'}>{worker.firstName} {worker.lastName}</Th>
                                        <Th color={'white'}>{inProgress}</Th>
                                        <Th color={'white'}>{onHold}</Th>
                                        <Th color={'white'}>{carWash}</Th>
                                        <Th color={'white'}>{done}</Th>
                                    </Tr>
                                )
                            })}
                        </Tbody>}
                    </Table>
                </TableContainer>}
            </IonContent>
        </IonPage>
    );
};

export default Summary;
