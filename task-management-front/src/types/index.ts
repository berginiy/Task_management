export interface User {
    id: string;
    fullName: string;
    email: string;
    role: 'ADMIN' | 'CREATOR' | 'EXECUTOR';
    departmentId?: string;
    departmentName?: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Department {
    id: string;
    name: string;
    description?: string;
    headUserId?: string;
    headUserName?: string;
    userCount: number;
    users?: User[];
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'EXTENSION_REQUESTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';
    urgently: boolean;
    expired: boolean;
    nearDeadline: boolean;
    deadline?: string;
    newDeadline?: string;
    endDate?: string;
    extensionRequested: boolean;
    extensionApproved: boolean;
    departmentId?: string;
    departmentName?: string;
    creatorId: string;
    creatorName: string;
    executorId?: string;
    executorName?: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    token: string;
}