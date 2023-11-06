import {
    FormLabel,
    Input,
    FormErrorMessage,
    Select,
    Textarea,
    Button,
    Box,
    Flex,
    Container,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
} from '@chakra-ui/react'
import { useState, FormEvent, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editTask } from '../../api'
import { TaskForm, Role, User, Worker, Task, Columns } from '../../types'

type Props = {
    showEditModal: boolean,
    onCloseEditModal: () => void,
    userStatus: string,
    workersStatus: string,
    user: User | undefined,
    workers: Worker[] | undefined,
    card: { taskId: string, columnId: string },
}

type Input = {
    body: FormData,
    id: string,
}

export default function EditTask({ showEditModal, onCloseEditModal, userStatus, workersStatus, user, workers, card }: Props) {
    const queryClient = useQueryClient();
    const { mutate, isError, error } = useMutation<Task, Error, Input, unknown>({ mutationKey: ['editTask'], mutationFn: editTask });
    const [values, setValues] = useState<TaskForm>({
        vehReg: '',
        note: '',
        images: [],
        assigned: '',
    })

    // useEffect to pre-fill form values with data from the selected task.
    useEffect(() => {
        const columns = queryClient.getQueryData<Columns>(['columns'])
        const currentCard = columns?.find(column => column.id === card.columnId)?.tasks.find(task => task.id === card.taskId);
        setValues({
            vehReg: currentCard?.vehReg || '',
            note: currentCard?.note || '',
            images: [],
            assigned: currentCard?.assigned ? `${currentCard.assigned.firstName} ${currentCard.assigned.lastName}` : '',
        })
    }, [card])

    // Function to edit a task in the database.
    const editTaskInDb = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prepare the task data to be updated.
        const task = new FormData()
        const assigned = (user && user.role === Role.EMPLOYEE) ? user.id : values.assigned
        task.append('vehReg', values.vehReg.toUpperCase())
        task.append('note', values.note)
        values.images.length > 0 && Array.from(values.images).forEach((file) => {
            task.append('images', file, file.name)
        })
        task.append('assigned', assigned)

        // Send a mutation to update the task in the database.
        mutate({ body: task, id: card.taskId }, {
            onSuccess: () => {
                // Invalidate queries to update data after editing a task.
                queryClient.invalidateQueries({ queryKey: ['columns'] })
            }
        })
        onCloseEditModal();
    }


    return (
        <Modal
            isOpen={showEditModal}
            onClose={onCloseEditModal}>
            {/* onTransfer={changeColumnName} */}
            <ModalOverlay />
            <ModalContent bgColor={'#1f1f1f'} color={'#ffff'}>
                <ModalHeader>Edit Task</ModalHeader>

                <Container className='dialogue'>
                    <form onSubmit={editTaskInDb}>
                        <Box margin={2}>
                            <FormLabel>Vehicle Reg Number</FormLabel>
                            <Input type='text' placeholder='ABC-123' isRequired={true} value={values.vehReg} onChange={(e) => setValues({ ...values, vehReg: e.target.value })} />
                            <FormErrorMessage>{''}</FormErrorMessage>
                        </Box>
                        <Box margin={2}>
                            <FormLabel mb='8px'>Notes</FormLabel>
                            <Textarea
                                resize={'none'}
                                isRequired={true}
                                value={values.note}
                                onChange={(e) => setValues({ ...values, note: e.target.value })}
                                placeholder='Write note'
                                size='sm'
                            />
                        </Box>
                        <Box>
                            <Input type='file' name='images' onChange={({ target }) =>
                                setValues({ ...values, images: target.files ? target.files : [] })
                            } />
                            <FormErrorMessage>{''}</FormErrorMessage>
                        </Box>
                        {userStatus === 'success' && (user?.role === Role.MANAGER || user?.role === Role.ADMIN) && <Box margin={2}>
                            <FormLabel>Assign to Worker:</FormLabel>
                            <Select placeholder='Select worker' value={values.assigned} onChange={(e) => setValues({ ...values, assigned: e.target.value })} isRequired={true}>
                                {workersStatus === 'success' && workers?.map((worker) =>
                                    <option value={worker.id} key={worker.id}>{worker.firstName} {worker.lastName}</option>
                                )}
                            </Select>
                            <FormErrorMessage>{''}</FormErrorMessage>
                        </Box>}
                        <ModalFooter>

                            <Flex gap={2} margin={4 | 0}>
                                <Button colorScheme='red' type='button' onClick={onCloseEditModal}>Cancel</Button>
                                <Button colorScheme='blue' type='submit'>Save</Button>
                                {isError && <FormErrorMessage marginTop={2}>{error.message}</FormErrorMessage>}
                            </Flex>
                        </ModalFooter>
                    </form>
                </Container>
            </ModalContent>
        </Modal>
    )
}