import { Columns, Task, Worker, User, Column } from "./types";

const BASE_URL = "http://localhost:3000/api/v1/";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImEyZmE3YWRmLTg4ZmEtNGNmMi1iM2QzLWIyODEzNTg0YzI1MiIsImlhdCI6MTY4ODA2MDI4NiwiZXhwIjoxNjg4MDYzODg2fQ.3e2OPawK07c9fs-u_eM4ENyVqJxwfiyG6pQOQu8RnIA";
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

export const addColumn = async (data: { title: string }): Promise<Column> => {
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
