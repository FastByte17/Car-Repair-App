export enum Role {
    EMPLOYEE = "EMPLOYEE",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
}

export enum State {
    IN_PROGRESS = "IN_PROGRESS",
    ON_HOLD = "ON_HOLD",
    CAR_WASH = "CAR_WASH",
    DONE = "DONE",
}

export type User = {
    id: string
    email: string
    firstName: string
    lastName: string
    password: string
    phoneNumber: string
    role: Role
    createdAt: Date
    updatedAt: Date
    MyTasks: Task[]
    AssignedTasks: Task[]
}

export type Task = {
    id: string
    vehReg: string
    note: string
    images: string
    state: State
    assigned: User
    assignee: User
    createdAt: Date
    updatedAt: Date
    assignedId: string
    assigneeId: string
}

export type Tasks = Task[]

export type Users = User[]