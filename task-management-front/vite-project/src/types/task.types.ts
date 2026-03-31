export type TaskStatus =
    | 'NEW'
    | 'IN_PROGRESS'
    | 'PENDING_REVIEW'
    | 'EXTENSION_REQUESTED'
    | 'COMPLETED'
    | 'REJECTED'
    | 'EXPIRED'

export type Role = 'ADMIN' | 'CREATOR' | 'EXECUTOR'

export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    isUrgently: boolean
    isExpired: boolean
    executorFullName: string
    deadline: string
    newDeadline?: string
    endDate?: string
    receivedAt: string
    createdAt: string
    updatedAt: string
    departmentId: string
    departmentName: string
    creatorId: string
    executorId?: string
    extensionRequested: boolean
    extensionApproved: boolean
}

export interface TaskRequest {
    title: string
    description?: string
    departmentId: string
    executorId?: string
    deadline: string
    isUrgently?: boolean
}