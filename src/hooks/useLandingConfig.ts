import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface LandingConfig {
    id: number;
    tenant_id: string;
    language: string;
    hero_title: string;
    hero_subtitle: string;
    hero_badge: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    hero_image_url: string;
    background_style: string;
    is_active: number;
}

export const useLandingConfig = () => {
    const { i18n } = useTranslation();
    const [config, setConfig] = useState<LandingConfig | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/index.php?action=get_landing_config_public&language=${i18n.language}`
                );
                const data = await response.json();
                if (data.success && data.data) {
                    setConfig(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch landing config:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, [i18n.language]);

    return { config, loading };
};
