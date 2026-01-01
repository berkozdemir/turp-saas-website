import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export interface LandingConfig {
    id: number;
    tenant_id: string;
    language: string;
    hero_title: string; // Legacy
    hero_title_line1: string;
    hero_title_line2: string;
    hero_subtitle: string;
    hero_badge: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    hero_image_url: string;
    background_style: string;
    is_active: number;
    // Line 1 styling
    hero_line1_use_gradient_text: number;
    hero_line1_solid_color: string;
    hero_line1_gradient_from: string;
    hero_line1_gradient_to: string;
    hero_line1_gradient_angle: number;
    // Line 2 styling
    hero_line2_use_gradient_text: number;
    hero_line2_solid_color: string;
    hero_line2_gradient_from: string;
    hero_line2_gradient_to: string;
    hero_line2_gradient_angle: number;
    // Gradient background
    hero_use_gradient_background: number;
    hero_gradient_bg_from: string;
    hero_gradient_bg_to: string;
    hero_gradient_bg_angle: number;
}

import { fetchAPI } from "../lib/contentApi";

export const useLandingConfig = () => {
    const { i18n } = useTranslation();
    const [config, setConfig] = useState<LandingConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await fetchAPI('get_landing_config_public', { language: i18n.language });
                if (data && data.success && data.data) {
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
