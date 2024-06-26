import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
/* import './Tab3.css'; */
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchColumns, fetchWorkers } from '../api'
import { Columns, Worker, } from '../types';


const Summary: React.FC = () => {
    // Fetch columns data using a query.
    const { data: columns } = useQuery<Columns, Error>({ queryKey: ['columns'], queryFn: fetchColumns });

    // Fetch workers data using a query.
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

                {/* Check if columns data is available before rendering the table. */}
                {columns && <TableContainer>
                    <Table variant='striped' colorScheme='whiteAlpha'>
                        <Thead >
                            <Tr>
                                <Th key={Date.now()} color={'white'}>Workers</Th>

                                {/* Render table headers for each column. */}
                                {columns.map((column) => <Th key={column.id} color={'white'}>{column.title}</Th>)}
                            </Tr>
                        </Thead>
                        {workers && <Tbody>

                            {/* Map through workers and display their tasks in respective columns. */}
                            {workers?.map((worker) => {
                                return (
                                    <Tr key={worker.id}>
                                        <Td color={'white'}>{worker.firstName} {worker.lastName}</Td>

                                        {/* Map through columns to show the number of tasks in each column for the worker. */}
                                        {columns.map((column) => (
                                            <Td color={'white'} key={column.id}>{worker.MyTasks.filter(task => task.column.title === column.title).length}</Td>
                                        ))}
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
