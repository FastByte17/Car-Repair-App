import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/react'
import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { User } from '../../types';
import { fetchCurrentUser } from '../../api'
import { format, parseISO, differenceInHours } from 'date-fns'

type Props = {}

function Reports({ }: Props) {
    // Fetch user data and status from a query.
    const { data: user, status } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });

    // Define table column headers.
    const heads = [{ title: 'Date' }, { title: 'Hours' }]

    // Function to format the time difference between checkedOut and checkedIn.
    const formatDate = (checkedOut: Date, checkedIn: Date): string => {

        // Calculate the time difference in hours and minutes.
        const hoursDifference = differenceInHours(new Date(Date.parse(checkedOut.toString())), new Date(Date.parse(checkedIn.toString())))
        const formattedDifference = Math.floor(hoursDifference) + ':' + ((hoursDifference % 1) * 60).toFixed(0).padStart(2, '0');
        return formattedDifference

    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                    <IonTitle>Reports</IonTitle>
                </IonToolbar>
            </IonHeader>
            {status === 'success' && <IonContent fullscreen>
                <TableContainer>
                    <Table variant='striped' colorScheme='whiteAlpha'>
                        <Thead>
                            <Tr>{heads.map((head, i) =>
                                <Th key={i} color={'white'}>{head.title}</Th>
                            )}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {user?.report.filter((r) => r.checkedOut).map((rep) =>
                                <Tr key={rep.id}>
                                    <Td>{format(parseISO(rep.checkedIn.toString()), "dd.MM.yyyy")}</Td>
                                    <Td >{formatDate(rep.checkedOut, rep.checkedIn)}</Td>
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </IonContent>}
        </IonPage>

    )
}

export default Reports