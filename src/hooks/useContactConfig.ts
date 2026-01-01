import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface ContactConfig {
    id: number;
    tenant_id: string;
    language: string;
    contact_title: string;
    contact_subtitle: string;
    address_line1: string;
    address_line2: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    map_embed_url: string;
    working_hours: string;
    form_enabled: number;
    notification_email: string;
    success_message: string;
    error_message: string;
    is_active: number;
}

import { fetchAPI } from "../lib/contentApi";

export const useContactConfig = () => {
    const { i18n } = useTranslation();
    const [config, setConfig] = useState<ContactConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await fetchAPI('get_contact_config_public', { language: i18n.language });
                if (data && data.success && data.data) {
                    setConfig(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch contact config:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [i18n.language]);

    return { config, loading };
};
