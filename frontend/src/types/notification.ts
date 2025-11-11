export type Notification = {
    id: string;
    title: string;
    description: string;
    isRead: boolean;
    createdAt: string;      
    eventDate?: string | null;
}

export type NotificationsResponse = {
    Notifications: Notification[]
}