// API layer — backend only. No mock fallbacks.
// All functions call http://localhost:5001/api endpoints directly.

const API_BASE_URL = 'http://localhost:5001/api';

export interface Subject {
  subject_code: string;
  subject_name: string;
  semester: number;
}

export interface Topic {
  topic_name: string;
  subject_code: string;
  created_at: string;
  importance_score: number;
}

export interface UserRef {
  user_id: string;
  username: string;
}

export type ResourceKind = 'note' | 'video' | 'past_paper' | 'tutorial';

export interface Resource {
  resource_id: string;
  topic_name: string;
  subject_code: string;
  resource_type: ResourceKind;
  title: string;
  description: string;
  file_path?: string | null;
  video_url?: string | null;
  uploaded_by: UserRef;
  rating_avg: number;
  created_at: string;
}

export interface AnalyticsData {
  topic_weights: Array<{ topic_name: string; weight: number }>;
  top_resources: Array<{ resource_id: string; title: string; rating_avg: number }>;
}

export interface Profile {
  user_id: string;
  username: string;
  display_name?: string;
  role: string;
  semester?: number;
  department?: string;
  bio?: string;
  specialization?: string;
  uploads_count: number;
  total_ratings: number;
  recent_uploads: Resource[];
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    user_id: string;
    username: string;
    email: string;
    display_name?: string;
    role: string;
    semester?: number;
    department?: string;
    bio?: string;
    specialization?: string;
  };
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  display_name?: string;
  role?: string;
  semester?: number;
  department?: string;
}

async function checkResponse<T = any>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status}: ${res.statusText} ${text}`);
    throw err;
  }
  return (await res.json()) as T;
}

export const mockApi = {
  // Authentication
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await checkResponse<AuthResponse>(res);
    } catch (err) {
      console.error('signup error:', err);
      throw err;
    }
  },

  login: async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      return await checkResponse<AuthResponse>(res);
    } catch (err) {
      console.error('login error:', err);
      throw err;
    }
  },

  logout: async (token: string): Promise<{ success: boolean }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      return await checkResponse<{ success: boolean }>(res);
    } catch (err) {
      console.error('logout error:', err);
      throw err;
    }
  },

  getCurrentUser: async (token: string): Promise<AuthResponse['user']> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      return await checkResponse<AuthResponse['user']>(res);
    } catch (err) {
      console.error('getCurrentUser error:', err);
      throw err;
    }
  },

  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/subjects`);
      return await checkResponse<Subject[]>(res);
    } catch (err) {
      console.error('getSubjects error:', err);
      return [];
    }
  },

  getTopics: async (subjectCode?: string): Promise<Topic[]> => {
    try {
      const url = subjectCode 
        ? `${API_BASE_URL}/topics?subject_code=${encodeURIComponent(subjectCode)}`
        : `${API_BASE_URL}/topics`;
      const res = await fetch(url);
      return await checkResponse<Topic[]>(res);
    } catch (err) {
      console.error('getTopics error:', err);
      return [];
    }
  },

  getImportantTopics: async (): Promise<Topic[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/topics/important-list`);
      return await checkResponse<Topic[]>(res);
    } catch (err) {
      console.error('getImportantTopics error:', err);
      return [];
    }
  },

  getResources: async (topicName?: string, sort?: 'top' | 'recent', subjectCode?: string): Promise<Resource[]> => {
    try {
      const params = new URLSearchParams();
      if (topicName) params.append('topic_name', topicName);
      if (sort) params.append('sort', sort);
      if (subjectCode) params.append('subject_code', subjectCode);
      
      const url = `${API_BASE_URL}/resources${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url);
      return await checkResponse<Resource[]>(res);
    } catch (err) {
      console.error('getResources error:', err);
      return [];
    }
  },

  uploadResource: async (formData: FormData): Promise<Resource> => {
    try {
      const res = await fetch(`${API_BASE_URL}/resources/upload`, {
        method: 'POST',
        body: formData,
      });
      return await checkResponse<Resource>(res);
    } catch (err) {
      console.error('uploadResource error:', err);
      throw err;
    }
  },

  rateResource: async (resourceId: string, rating: number, userId: string = 'u1'): Promise<{ success: boolean; new_avg_rating: number; is_new_rating: boolean; user_rating: number }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/resources/${encodeURIComponent(resourceId)}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, user_id: userId }),
      });
      return await checkResponse<{ success: boolean; new_avg_rating: number; is_new_rating: boolean; user_rating: number }>(res);
    } catch (err) {
      console.error('rateResource error:', err);
      throw err;
    }
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics`);
      return await checkResponse<AnalyticsData>(res);
    } catch (err) {
      console.error('getAnalytics error:', err);
      return { topic_weights: [], top_resources: [] };
    }
  },

  getProfile: async (userId: string): Promise<Profile | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/profile/${encodeURIComponent(userId)}`);
      if (!res.ok) {
        console.error('getProfile HTTP error:', res.status, res.statusText);
        const text = await res.text();
        console.error('Response body:', text);
        return null;
      }
      const data = await res.json();
      console.log('getProfile success:', data);
      return data as Profile;
    } catch (err) {
      console.error('getProfile error:', err);
      return null;
    }
  },

  markTopicImportant: async (topicName: string, subjectCode: string, createdBy: string): Promise<{ success: boolean; new_importance_score: number; already_marked?: boolean }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/topics/important`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_name: topicName, subject_code: subjectCode, created_by: createdBy }),
      });
      return await checkResponse<{ success: boolean; new_importance_score: number }>(res);
    } catch (err) {
      console.error('markTopicImportant error:', err);
      throw err;
    }
  },
};
