import React, { useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRouterLink } from '@ionic/react';
import { Text, Container, Button, Icon, Stack, Flex } from '@chakra-ui/react'
import { FiClock } from 'react-icons/fi'
import { TbReport } from 'react-icons/tb'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '../../types';
import { changeCheckInStatus, fetchCurrentUser } from '../../api'
import { format, parseISO } from 'date-fns'
import '../Tab3.css'


const Shifts: React.FC = () => {
  // Access the query client.
  const client = useQueryClient()

  // Fetch user data and status from a query.
  const { data: user, status } = useQuery<User, Error>({ queryKey: ['user'], queryFn: fetchCurrentUser });

  // Find the last check-out entry in the user's report.
  const lastCheckOut = user && user.report.findLast(rep => rep.checkedOut !== null)

  // Mutation to change the check-in status.
  const { mutate: changeStatus, data: response } = useMutation<User, Error, any>({ mutationKey: ['checkIn'], mutationFn: changeCheckInStatus });


  useEffect(() => {
  }, [user])

  // Function to change the check-in status.
  const ChangeCheckInStatus = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    changeStatus({}, {
      onSuccess: () => {
        if (response) {
          // Update user's report data in the query client.
          client.setQueryData(['user'], {
            ...user,
            report: response.report
          })
        }
        // Invalidate the 'user' query to trigger a re-fetch.
        client.invalidateQueries({ queryKey: ['user'] })
      }
    })
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Shifts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Shifts</IonTitle>
          </IonToolbar>
        </IonHeader>
        {status === 'success' &&
          <Container height={'full'} minWidth={'full'} textAlign={'center'} padding={'3em 0 0 0'}>
            <Container className='shift' minWidth={'full'} gap={'20px'}>
              <Text className='shift-text'>Welcome {user.firstName}!</Text>
              <IonRouterLink className='shift-icon' routerLink='/shifts/reports'>
                <Icon as={TbReport} />
              </IonRouterLink>
            </Container>
            {lastCheckOut &&
              <Flex gap={6} width={'fit-content'} padding={2} marginTop={4} marginLeft={10} align={'center'}>
                <Icon as={FiClock} boxSize={5} color={'white'} />
                <Stack spacing={0}>
                  <Text color={'white'} fontSize={'xl'}>Last check out</Text>
                  <Text color={'white'} fontSize={'md'}>{format(parseISO(lastCheckOut.checkedOut.toString()), "HH:mm - dd.MM.yyyy")}</Text>
                </Stack>
              </Flex>}
            <Button
              colorScheme={`${user.isCheckedIn ? 'red' : 'green'}`}
              opacity={'0.9'}
              marginTop={4}
              size={'lg'}
              onClick={ChangeCheckInStatus}
            >
              {`${user.isCheckedIn ? 'Check Out' : 'Check In'}`}
            </Button>
          </Container>}
      </IonContent>
    </IonPage>
  );
};

export default Shifts;
