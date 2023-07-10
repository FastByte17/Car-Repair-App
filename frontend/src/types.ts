import { DraggingStyle, NotDraggingStyle } from "react-beautiful-dnd";


export enum Role {
    EMPLOYEE = "EMPLOYEE",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
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

export type History = {
    id: number,
    taskId: string,
    task: Task,
    status: string,
    assignedWorker: string,
    changedAt: Date

}

export type Task = {
    id: string
    vehReg: string
    note: string
    images: string
    position: number
    columnId: string
    assigned: User
    assignee: User
    createdAt: Date
    updatedAt: Date
    column: Column
    history: History[]
}

export type Column = {
    id: string
    title: string
    tasks: Task[]
    position: number
    createdAt: Date
    updatedAt: Date
}

export type TaskForm = {
    vehReg: string,
    note: string,
    images: [] | FileList,
    assigned: string,
}

export type reOrderInput = {
    columnId: string,
    taskId: string,
    newPosition: number,
    columnTitle: string
}

export type reOrderColumnInput = {
    columnId: string,
    newPosition: number,
    oldPosition: number,
    title: string
}

export type Worker = Pick<User, "id" | "firstName" | "lastName" | "MyTasks">;
export type ColumnFormInput = Pick<Column, "title">;

export type Tasks = Task[]
export type Users = User[]
export type Columns = Column[]
export type DraggableStyleType = DraggingStyle | NotDraggingStyle | undefined
