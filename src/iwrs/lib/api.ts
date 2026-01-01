// import { toast } from "@/iwrs/hooks/use-toast"; // Removed unused

const API_BASE = '/api/index.php';

// Helper to get headers with token
const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        'X-Tenant-Code': 'iwrs', // Explicitly set tenant
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Generic fetch wrapper
async function fetchInfo<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Cache buster
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${endpoint}${separator}_t=${new Date().getTime()}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...getHeaders(),
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API Request Failed');
    }

    return data;
}

// --- AUTH ---
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE}?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return data;
    },
    logout: async () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },
    getSession: async () => {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        if (token && user) {
            return { session: { access_token: token, user: JSON.parse(user) } };
        }
        return { session: null };
    },
    register: async (data: any) => {
        // Not implemented in backend yet, keeping placeholder
        return { success: false, error: "Not implemented" };
    }
};

// --- BLOG ---
export const blogApi = {
    getAll: async () => {
        // Map resource=blog_posts to action=get_blog_posts
        return fetchInfo<any[]>(`${API_BASE}?action=get_blog_posts`);
    },
    getOne: async (slug: string) => {
        // Map resource=blog_posts&id=... to action=get_blog_post&slug=...
        return fetchInfo<any>(`${API_BASE}?action=get_blog_post&slug=${slug}`);
    },
    create: async (data: any) => {
        // Admin only
        return fetchInfo(`${API_BASE}?action=create_blog_post`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: string, data: any) => {
        return fetchInfo(`${API_BASE}?action=update_blog_post`, {
            method: 'POST',
            body: JSON.stringify({ ...data, id }),
        });
    },
    delete: async (id: string) => {
        return fetchInfo(`${API_BASE}?action=delete_blog_post`, {
            method: 'POST', // PHP API usually expects POST for actions
            body: JSON.stringify({ id })
        });
    }
};

// --- RANDOMIZATION ---
// --- RANDOMIZATION ---
export const randomizationApi = {
    submit: async (data: any) => {
        return fetchInfo(`${API_BASE}?resource=randomization`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const contactApi = {
    send: async (data: any) => {
        return fetchInfo(`${API_BASE}?resource=contact`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    getMessages: async () => {
        return fetchInfo<any[]>(`${API_BASE}?resource=get-messages`, {
            method: 'GET',
        });
    },
    deleteMessage: async (id: number) => {
        return fetchInfo(`${API_BASE}?resource=delete-message`, {
            method: 'POST',
            body: JSON.stringify({ id }),
        });
    },
};

export const chatApi = {
    sendMessage: async (message: string) => {
        return fetchInfo<any>(`${API_BASE}?resource=ai-chat`, {
            method: 'POST',
            body: JSON.stringify({ message }),
        });
    },
};

export const translationApi = {
    translateBlog: async (data: { title?: string, excerpt?: string, content?: string, target_language?: string }) => {
        return fetchInfo<any>(`${API_BASE}?resource=ai-translate-blog`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    translateBlogAll: async (data: { title_tr: string, excerpt_tr?: string, content_tr: string }) => {
        return fetchInfo<{ en: { title?: string, excerpt?: string, content?: string }, zh: { title?: string, excerpt?: string, content?: string } }>(`${API_BASE}?resource=ai-translate-blog-all`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    translateFaq: async (data: { question: string, answer: string, target_language?: string }) => {
        return fetchInfo<any>(`${API_BASE}?resource=ai-translate-faq`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};

export const settingsApi = {
    get: async () => {
        return fetchInfo<any>(`${API_BASE}?resource=settings&action=GET`); // explicit action for clarity/consistency if needed, though PHP relies on method
    },
    update: async (data: any) => {
        return fetchInfo(`${API_BASE}?resource=settings`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    changePassword: async (data: any) => {
        return fetchInfo(`${API_BASE}?resource=change_password`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};

export const faqApi = {
    getAll: async () => {
        return fetchInfo<any[]>(`${API_BASE}?resource=faq`);
    },
    create: async (data: any) => {
        return fetchInfo(`${API_BASE}?resource=faq`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: number, data: any) => {
        return fetchInfo(`${API_BASE}?resource=faq`, {
            method: 'POST',
            body: JSON.stringify({ ...data, id }),
        });
    },
    delete: async (id: number) => {
        return fetchInfo(`${API_BASE}?resource=faq&id=${id}`, {
            method: 'DELETE',
        });
    }
};

export const adminApi = {
    getUsers: async () => {
        return fetchInfo<any[]>(`${API_BASE}?resource=users`);
    },
    getLogs: async (limit: number = 100) => {
        return fetchInfo<any[]>(`${API_BASE}?resource=api-logs&limit=${limit}`);
    }
};

export const formApi = {
    submit: async (formName: string, data: any) => {
        return fetchInfo(`${API_BASE}?resource=submit-form`, {
            method: 'POST',
            body: JSON.stringify({ form_name: formName, ...data }),
        });
    }
};
