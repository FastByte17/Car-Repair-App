import { Tasks, Task, Worker, User } from './types'


const BASE_URL = "http://localhost:3000/api/v1/"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyZmE3YWRmLTg4ZmEtNGNmMi1iM2QzLWIyODEzNTg0YzI1MiIsImlhdCI6MTY4Nzk3NTA3MCwiZXhwIjoxNjg3OTc4NjcwfQ.aYgk2Ea4VT_w6zYz0znAuSTKmdq4gko6Q3tH10yZ-EQ"
const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}
const myHeader = new Headers()
myHeader.append('Authorization', 'Bearer ' + token)

export const fetchCurrentUser = async (): Promise<User> => {
    const response = await fetch(BASE_URL + 'user/me', {
        headers,
        method: "GET"
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}

export const fetchTasks = async (): Promise<Tasks> => {
    const response = await fetch(BASE_URL + 'task', {
        headers,
        method: "GET"
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}

export const addTask = async (data: FormData): Promise<Task> => {
    const response = await fetch(BASE_URL + 'task', {
        method: "POST",
        headers: myHeader,
        body: data
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}

export const fetchWorkers = async (): Promise<Worker[]> => {
    const response = await fetch(BASE_URL + 'user/workers', {
        headers,
        method: "GET"
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}