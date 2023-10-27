import {
    Container,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Text,
    Stack,
    OrderedList,
    ListItem
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Columns, Task } from '../../types'
import { useQueryClient } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';




type Props = {
    isDetailOpen: boolean,
    onDetailClose: () => void,
    card: { taskId: string, columnId: string },
}

export default function Detail({ isDetailOpen, onDetailClose, card }: Props) {
    const queryClient = useQueryClient();
    const [value, setValue] = useState<Task | null>()
    const [status, setStatus] = useState<string | ''>('')

    useEffect(() => {
        const columns = queryClient.getQueryData<Columns>(['columns'])
        const currentColumn = columns?.find(column => column.id === card.columnId)
        const currentCard = currentColumn?.tasks.find(task => task.id === card.taskId);
        setValue(currentCard ?? null)
        setStatus(currentColumn?.title ?? '')
    }, [card])


    return (
        <Modal
            isOpen={isDetailOpen}
            onClose={onDetailClose}>
            <ModalOverlay />
            {value && <ModalContent bgColor={'#1f1f1f'} color={'#ffff'}>
                <ModalHeader paddingLeft={'17px'}>{value.vehReg}</ModalHeader>
                <Container className='dialogue' maxH={'550px'} overflow={'scroll'}>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Status</Text>
                        <Text fontSize={'lg'}>{status}</Text>
                    </Stack>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Assigned Worker</Text>
                        <Text fontSize={'lg'}>{value.assigned.firstName} {value.assigned.lastName}</Text>
                    </Stack>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Last Updated</Text>
                        <Text fontSize={'lg'}>{new Date(value.updatedAt).toDateString()}</Text>
                    </Stack>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Notes</Text>
                        <Text fontSize={'lg'}>{value.note}</Text>
                    </Stack>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>History</Text>
                        <OrderedList>{value.history.map((record, i) => {
                            let startDate: Date;
                            let endDate: Date;
                            if (value.history[i + 1]?.changedAt) {
                                startDate = new Date(record.changedAt)
                                endDate = new Date(value.history[i + 1].changedAt)
                            } else {
                                startDate = new Date(record.changedAt)
                                endDate = new Date(Date.now())
                            }
                            const duration = formatDistance(startDate, endDate);
                            return (
                                <ListItem key={record.id}>
                                    Worker: {record.assignedWorker} ----
                                    Time: {new Date(record.changedAt).toDateString()} ----
                                    Duration: {duration} ----
                                    Status: {record.status}
                                </ListItem>
                            )
                        })}
                        </OrderedList>
                    </Stack>
                </Container>
            </ModalContent>}
        </Modal >
    )
}