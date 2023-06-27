import { Tasks, Task } from './types'


const BASE_URL = "http://localhost:3000/api/v1/task"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyZmE3YWRmLTg4ZmEtNGNmMi1iM2QzLWIyODEzNTg0YzI1MiIsImlhdCI6MTY4Nzg4MTExNywiZXhwIjoxNjg3ODg0NzE3fQ.424hkQNB4IJDt86sT8Ex1IWJu9Tna8Fg2UcBhuNSoOY"
const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}
export const fetchTasks = async (): Promise<Tasks> => {
    const response = await fetch(BASE_URL, {
        headers,
        method: "GET"
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}

export const addTask = async (data: Task): Promise<Task> => {
    const response = await fetch(BASE_URL, {
        headers: {
            ...headers,
            body: JSON.stringify(data),
        },
        method: "POST"
    })
    if (!response.ok) throw new Error(response.statusText)
    const tasks = await response.json()
    return tasks?.data
}