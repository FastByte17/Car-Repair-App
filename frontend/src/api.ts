import { Columns, Task, Worker, User, Column, ColumnFormInput, reOrderInput, reOrderColumnInput, EditColumn } from "./types";

const BASE_URL = "http://localhost:3000/api/v1/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4NTIxOGQ3LWVhYjMtNDAxZi04Mzc1LTNkM2M0OTMyZGZjMyIsImlhdCI6MTY4OTQ0MzkxMCwiZXhwIjoxNjg5NDQ3NTEwfQ.VC3PXsF8mv1D4VuqzQEOCKzmi1ibitJtk2moEaGM7ZM";
const headers = {
  Authorization: "Bearer " + token,
  "Content-Type": "application/json",
};
const myHeader = new Headers();
myHeader.append("Authorization", "Bearer " + token);

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await fetch(BASE_URL + "user/me", {
    headers,
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const user = await response.json();
  return user?.data;
};

export const changeCheckInStatus = async (): Promise<User> => {
  const response = await fetch(BASE_URL + "user/check", {
    headers,
    method: "PATCH",
  });
  if (!response.ok) throw new Error(response.statusText);
  const user = await response.json();
  return user?.data;
};

export const fetchColumns = async (): Promise<Columns> => {
  const response = await fetch(BASE_URL + "column", {
    headers,
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const columns = await response.json();
  return columns?.data;
};

export const addTask = async (data: FormData): Promise<Task> => {
  const response = await fetch(BASE_URL + "task", {
    method: "POST",
    headers: myHeader,
    body: data,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const editTask = async (data: { body: FormData, id: string }): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${data.id}`, {
    method: "PATCH",
    headers: myHeader,
    body: data.body,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const deleteTask = async (id: string): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};


export const getTask = async (id: string): Promise<Task> => {
  const response = await fetch(BASE_URL + `task/${id}`, {
    method: "GET",
    headers,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};


export const reOrder = async (data: reOrderInput): Promise<Task> => {
  const response = await fetch(BASE_URL + `task`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const reOrderColumn = async (data: reOrderColumnInput): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/${data.columnId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const addColumn = async (data: ColumnFormInput): Promise<Column> => {
  const response = await fetch(BASE_URL + "column", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const column = await response.json();
  return column?.data;
};

export const deleteColumn = async (id: string): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const editColumn = async (data: EditColumn): Promise<Column> => {
  const response = await fetch(BASE_URL + `column/edit/${data.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const task = await response.json();
  return task?.data;
};

export const fetchWorkers = async (): Promise<Worker[]> => {
  const response = await fetch(BASE_URL + "user/workers", {
    headers,
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const workers = await response.json();
  return workers?.data;
};
