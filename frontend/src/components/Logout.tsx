import { IonIcon } from '@ionic/react'
import { logOutOutline } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import './ExploreContainer.css'

type Props = {}

export default function Logout({ }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const history = useHistory()

    const logout = () => {
        localStorage.removeItem('token')
        history.push('/login')
        onClose()
    }
    return (
        <>
            <IonIcon className='logout-icon' onClick={onOpen} icon={logOutOutline} size='large'></IonIcon>

            <Modal isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent bgColor={'#1f1f1f'} color={'#ffff'}>
                    <ModalCloseButton />
                    <ModalBody>
                        Do you want to  log out ?
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='green' mr={3} onClick={logout}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose}>
                            No
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}