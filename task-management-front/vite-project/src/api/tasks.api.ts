import api from './axios'
import type { Task, TaskRequest } from '../types/task.types'

export const getTasks = async () => {
  const res = await api.get<Task[]>('/tasks')
  return res.data
}

export const getTaskById = async (id: string) => {
  const res = await api.get<Task>(`/tasks/${id}`)
  return res.data
}

export const createTask = async (data: TaskRequest) => {
  const res = await api.post<Task>('/tasks', data)
  return res.data
}

export const acceptTask = (id: string) => api.post(`/tasks/${id}/accept`)
export const submitTask = (id: string) => api.post(`/tasks/${id}/submit`)
export const approveTask = (id: string) => api.post(`/tasks/${id}/approve`)
export const rejectTask = (id: string, comment: string) =>
  api.post(`/tasks/${id}/reject`, { comment })
export const requestExt = (id: string, newDeadline: string) =>
  api.post(`/tasks/${id}/request-ext`, { newDeadline })