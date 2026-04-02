export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    departmentName?: string;
    active?: boolean;
}

export interface Department {
    id: string;
    name: string;
    description?: string;
    headUserName?: string;
    userCount?: number;
    users?: User[];           
    head?: User;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'NEW' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'EXTENSION_REQUESTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED';
    urgently: boolean;
    nearDeadline: boolean;
    expired: boolean;
    deadline?: string;
    departmentName?: string;
    executorName?: string;
    creatorId?: string;
    executorId?: string;
    departmentId?: string;
}