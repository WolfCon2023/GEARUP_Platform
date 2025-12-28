import localforage from 'localforage';
import { progressAPI } from '../lib/api';

// Initialize localforage
localforage.config({
  name: 'NorthStarApp',
  storeName: 'northstar_store',
});

interface OfflineAction {
  id: string;
  type: 'progress_update';
  data: any;
  timestamp: number;
  retries: number;
}

const OFFLINE_QUEUE_KEY = 'offline_queue';
const MAX_RETRIES = 3;

export const offlineStore = {
  // Add action to offline queue
  async queueAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>): Promise<void> {
    const queue = await this.getQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };
    queue.push(newAction);
    await localforage.setItem(OFFLINE_QUEUE_KEY, queue);
  },

  // Get offline queue
  async getQueue(): Promise<OfflineAction[]> {
    const queue = await localforage.getItem<OfflineAction[]>(OFFLINE_QUEUE_KEY);
    return queue || [];
  },

  // Process offline queue
  async processQueue(): Promise<void> {
    const queue = await this.getQueue();
    if (queue.length === 0) return;

    const processed: string[] = [];
    const failed: OfflineAction[] = [];

    for (const action of queue) {
      try {
        if (action.type === 'progress_update') {
          await progressAPI.update(action.data);
          processed.push(action.id);
        }
      } catch (error) {
        action.retries += 1;
        if (action.retries < MAX_RETRIES) {
          failed.push(action);
        } else {
          console.error('Action failed after max retries:', action);
          processed.push(action.id); // Remove from queue even if failed
        }
      }
    }

    // Update queue with remaining failed actions
    const remaining = queue.filter(a => !processed.includes(a.id));
    await localforage.setItem(OFFLINE_QUEUE_KEY, [...remaining, ...failed]);
  },

  // Clear queue
  async clearQueue(): Promise<void> {
    await localforage.removeItem(OFFLINE_QUEUE_KEY);
  },
};

// Cache management
export const cacheStore = {
  // Module library cache
  async cacheModules(modules: any[]): Promise<void> {
    await localforage.setItem('module_library_cache', {
      data: modules,
      timestamp: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  },

  async getCachedModules(): Promise<any[] | null> {
    const cached = await localforage.getItem<{ data: any[]; expiresAt: number }>('module_library_cache');
    if (!cached) return null;
    if (Date.now() > cached.expiresAt) {
      await localforage.removeItem('module_library_cache');
      return null;
    }
    return cached.data;
  },

  // Student progress cache
  async cacheProgress(studentId: string, progress: any): Promise<void> {
    await localforage.setItem(`progress_${studentId}`, {
      data: progress,
      timestamp: Date.now(),
    });
  },

  async getCachedProgress(studentId: string): Promise<any | null> {
    const cached = await localforage.getItem<{ data: any; timestamp: number }>(`progress_${studentId}`);
    return cached?.data || null;
  },
};

// Sync worker - check online status and process queue
export const initSyncWorker = () => {
  const processQueue = async () => {
    if (navigator.onLine) {
      await offlineStore.processQueue();
    }
  };

  // Process queue on online event
  window.addEventListener('online', processQueue);
  
  // Process queue periodically
  setInterval(processQueue, 30000); // Every 30 seconds

  // Initial process
  processQueue();
};

