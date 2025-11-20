// Knock client utilities
// Note: These should only be used in server-side code (API routes)

export interface KnockNotification {
  id: string
  title: string
  body: string
  actor?: {
    id: string
    name: string
  }
  data?: any
  seen_at: string | null
  read_at: string | null
  created_at: string
  updated_at: string
  type?: string
}

export interface KnockFeedResponse {
  entries: KnockNotification[]
  page_info: {
    after: string | null
    before: string | null
    page_size: number
  }
  meta: {
    total_count: number
    unseen_count: number
    unread_count: number
  }
}

// For client-side: use API routes instead
// This should be called from the client to hit your API route

export async function getUserNotifications(userId: string, options: Record<string, any> = {}) {
  try {
    const queryParams = new URLSearchParams({
      userId,
      pageSize: options.page_size?.toString() || '20',
      status: options.status || 'all',
    });

    const response = await fetch(`/api/notifications?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

export async function markAllAsRead(userId: string) {
  try {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark all as read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
}

export async function markAsRead(userId: string, notificationId: string) {
  try {
    const response = await fetch('/api/notifications/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, notificationId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to mark as read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking as read:', error);
    throw error;
  }
}
