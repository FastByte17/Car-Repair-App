import { Columns, Task, Worker, User, Column, ColumnFormInput, reOrderInput, reOrderColumnInput, EditColumn, NewUser, ErrorResponse } from "./types";

const BASE_URL = "http://localhost:3000/api/v1/";

export const getHeader = (type?: string) => {
  const token = localStorage.getItem('token');

  if (type === 'formData') {
    const myHeader = new Headers();
    myHeader.append("Authorization", "Bearer " + token);
    return myHeader
  } else {
    const headers: {
      Authorization?: string;
      "Content-Type": string;
    } = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    return headers;
  }
}

// fetch currently signed in user
export const fetchCurrentUser = async (): Promise<User> => {
  const response = await fetch(BASE_URL + "user/me", {
    headers: getHeader(),
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const user = await response.json();
  return user?.data;
};

// changes the checkin status of a user
export const changeCheckInStatus = async (): Promise<User> => {
  const response = await fetch(BASE_URL + "user/check", {
    headers: getHeader(),
    method: "PATCH",
  });
  if (!response.ok) throw new Error(response.statusText);
  const user = await response.json();
  return user?.data;
};

// fetches column information
export const fetchColumns = async (): Promise<Columns> => {
  const response = await fetch(BASE_URL + "column", {
    headers: getHeader(),
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const columns = await response.json();
  return columns?.data;
};

// add a task 
export const addTask = async (data: FormData): Promise<Task> => {
  const response = await fetch(BASE_URL + "task", {
    method: "POST",
    headers: getHeader('formData'),
    body: data,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

//edits the task information
export const editTask = async (data: { body: FormData, id: string }): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${data.id}`, {
    method: "PATCH",
    headers: getHeader('formData'),
    body: data.body,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

//deletes the task information
export const deleteTask = async (id: string): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${id}`, {
    method: "DELETE",
    headers: getHeader(),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

// get task information
export const getTask = async (id: string): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${id}`, {
    method: "GET",
    headers: getHeader(),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

//reorders the tasks
export const reOrder = async (data: reOrderInput): Promise<Task> => {
  const response = await fetch(BASE_URL + `task`, {
    method: "PATCH",
    headers: getHeader(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

// reorders the columns 
export const reOrderColumn = async (data: reOrderColumnInput): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/${data.columnId}`, {
    method: "PATCH",
    headers: getHeader(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

//adds a column
export const addColumn = async (data: ColumnFormInput): Promise<Column> => {
  const response = await fetch(BASE_URL + "column", {
    method: "POST",
    headers: getHeader(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const column = await response.json();
  return column?.data;
};

//deletes a column
export const deleteColumn = async (id: string): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/${id}`, {
    method: "DELETE",
    headers: getHeader(),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

//edits a column
export const editColumn = async (data: EditColumn): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/edit/${data.id}`, {
    method: "PATCH",
    headers: getHeader(),

    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

// fetches information of all the workers
export const fetchWorkers = async (): Promise<Worker[]> => {
  const response = await fetch(BASE_URL + "user/workers", {
    headers: getHeader(),

    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const workers = await response.json();
  return workers?.data;
};

// register new user account
export const register = async (data: NewUser): Promise<{ token: string, user: User }> => {
  const response = await fetch('http://localhost:3000/register', {
    headers: getHeader(),
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.message || response.statusText);
  };
  const result = await response.json();
  return result;
};

export const login = async (data: { email: string, password: string } | { device: string, pin: string }): Promise<{ token: string, user: User }> => {
  const response = await fetch('http://localhost:3000/login', {
    headers: getHeader(),
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse?.message || response.statusText);
  };
  const result = await response.json();
  return result;
};