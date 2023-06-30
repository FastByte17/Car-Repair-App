import { Columns, Task, Worker, User, Column, ColumnFormInput } from "./types";

const BASE_URL = "http://localhost:3000/api/v1/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyZmE3YWRmLTg4ZmEtNGNmMi1iM2QzLWIyODEzNTg0YzI1MiIsImlhdCI6MTY4ODE0NzQ3NywiZXhwIjoxNjg4MTUxMDc3fQ.S2U7QMud5Ecucjm7E6cPTtGrVCHkpSud2G6kGLpBf8M";
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
  const tasks = await response.json();
  return tasks?.data;
};

export const fetchColumns = async (): Promise<Columns> => {
  const response = await fetch(BASE_URL + "column", {
    headers,
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const tasks = await response.json();
  return tasks?.data;
};

export const addTask = async (data: FormData): Promise<Task> => {
  const response = await fetch(BASE_URL + "task", {
    method: "POST",
    headers: myHeader,
    body: data,
  });
  if (!response.ok) throw new Error(response.statusText);
  const tasks = await response.json();
  return tasks?.data;
};

export const addColumn = async (data: ColumnFormInput): Promise<Column> => {
  const response = await fetch(BASE_URL + "column", {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  const tasks = await response.json();
  return tasks?.data;
};

export const fetchWorkers = async (): Promise<Worker[]> => {
  const response = await fetch(BASE_URL + "user/workers", {
    headers,
    method: "GET",
  });
  if (!response.ok) throw new Error(response.statusText);
  const tasks = await response.json();
  return tasks?.data;
};
