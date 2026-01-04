
const API_BASE = '/api/index.php';

// Helper to get headers with token
const getHeaders = () => {
    // CHANGE: Use 'enduser_token' instead of legacy 'auth_token'
    const token = localStorage.getItem('enduser_token');
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

// --- AUTH (Legacy Wrapper - Now delegates to useEndUserAuth hook in components) ---
// We keep this structure but empty it out or redirect because
// the actual Login/Signup is now handled by the shared pages.
export const authApi = {
    // These should ideally not be used anymore, but kept for safe refactoring
    // if any component still calls them, we log a warning.
    login: async () => { console.warn("Use useEndUserAuth().login instead"); },
    logout: async () => {
        localStorage.removeItem('enduser_token');
        localStorage.removeItem('enduser');
    },
    getSession: async () => {
        const token = localStorage.getItem('enduser_token');
        const userStr = localStorage.getItem('enduser');
        if (token && userStr) {
            return { session: { access_token: token, user: JSON.parse(userStr) } };
        }
        return { session: null };
    },
    register: async () => { console.warn("Use useEndUserAuth().signup instead"); }
};

// --- BLOG ---
export const blogApi = {
    getAll: async () => {
        return fetchInfo<any[]>(`${API_BASE}?action=get_blog_posts`);
    },
    getOne: async (slug: string) => {
        return fetchInfo<any>(`${API_BASE}?action=get_blog_post&slug=${slug}`);
    },
    // Admin actions remain same (assuming admin.routes handles them via 'action')
    create: async (data: any) => {
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
            method: 'POST',
            body: JSON.stringify({ id })
        });
    }
};

// --- RANDOMIZATION ---
export const randomizationApi = {
    submit: async (data: any) => {
        // CHANGE: resource=randomization -> action=iwrs_randomization
        return fetchInfo(`${API_BASE}?action=iwrs_randomization`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export const contactApi = {
    send: async (data: any) => {
        // CHANGE: resource=contact -> action=iwrs_contact
        return fetchInfo(`${API_BASE}?action=iwrs_contact`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    getMessages: async () => {
        // CHANGE: resource=get-messages -> action=iwrs_get_messages
        return fetchInfo<any[]>(`${API_BASE}?action=iwrs_get_messages`, {
            method: 'GET',
        });
    },
    deleteMessage: async (id: number) => {
        // CHANGE: resource=delete-message -> action=iwrs_delete_message
        return fetchInfo(`${API_BASE}?action=iwrs_delete_message`, {
            method: 'POST',
            body: JSON.stringify({ id }),
        });
    },
};

export const chatApi = {
    sendMessage: async (message: string) => {
        // CHANGE: resource=ai-chat -> action=chatbot_query (use shared chatbot)
        return fetchInfo<any>(`${API_BASE}?action=chatbot_query`, {
            method: 'POST',
            body: JSON.stringify({ message, context: 'iwrs_general' }),
        });
    },
};

export const translationApi = {
    translateBlog: async (data: { title?: string, excerpt?: string, content?: string, target_language?: string }) => {
        return fetchInfo<any>(`${API_BASE}?action=ai_translate_blog`, { // Check if this action exists in admin routes
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    translateBlogAll: async (data: { title_tr: string, excerpt_tr?: string, content_tr: string }) => {
        return fetchInfo<{ en: { title?: string, excerpt?: string, content?: string }, zh: { title?: string, excerpt?: string, content?: string } }>(`${API_BASE}?action=ai_translate_blog_all`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    translateFaq: async (data: { question: string, answer: string, target_language?: string }) => {
        return fetchInfo<any>(`${API_BASE}?action=ai_translate_faq`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};

export const settingsApi = {
    get: async () => {
        // CHANGE: resource=settings -> action=get_settings (if implemented)
        // For now fallback or map to correct admin action
        return fetchInfo<any>(`${API_BASE}?action=get_site_settings`);
    },
    update: async (data: any) => {
        return fetchInfo(`${API_BASE}?action=update_site_settings`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    changePassword: async (data: any) => {
        return fetchInfo(`${API_BASE}?action=change_admin_password`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
};

export const faqApi = {
    getAll: async () => {
        return fetchInfo<any[]>(`${API_BASE}?action=get_faqs_public`);
    },
    create: async (data: any) => {
        return fetchInfo(`${API_BASE}?action=create_faq`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: number, data: any) => {
        return fetchInfo(`${API_BASE}?action=update_faq`, {
            method: 'POST',
            body: JSON.stringify({ ...data, id }),
        });
    },
    delete: async (id: number) => {
        return fetchInfo(`${API_BASE}?action=delete_faq`, {
            method: 'POST', // Use POST for safer deletes in this PHP router
            body: JSON.stringify({ id })
        });
    }
};

export const adminApi = {
    getUsers: async () => {
        return fetchInfo<any[]>(`${API_BASE}?action=get_users`);
    },
    getLogs: async (limit: number = 100) => {
        return fetchInfo<any[]>(`${API_BASE}?action=get_logs&limit=${limit}`);
    }
};

export const formApi = {
    submit: async (formName: string, data: any) => {
        return fetchInfo(`${API_BASE}?action=submit_form`, {
            method: 'POST',
            body: JSON.stringify({ form_name: formName, ...data }),
        });
    }
};
