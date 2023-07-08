import {
    Container,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Text,
    Stack
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Columns, Task } from '../../types'
import { useQueryClient } from '@tanstack/react-query';



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
            {value && <ModalContent>
                <ModalHeader paddingLeft={'17px'}>{value.vehReg}</ModalHeader>
                <Container className='dialogue'>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Status</Text>
                        <Text fontSize={'lg'}>{status}</Text>
                    </Stack>
                    <Stack spacing={1} marginBottom={5}>
                        <Text>Assigned Worker</Text>
                        <Text>{value.assigned.firstName} {value.assigned.lastName}</Text>
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
                        <Text fontSize={'lg'} >History</Text>
                        <Text fontSize={'lg'}>{ }</Text>
                    </Stack>
                </Container>
            </ModalContent>}
        </Modal >
    )
}