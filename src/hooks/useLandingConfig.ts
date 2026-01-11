import { useQuery } from '@tanstack/react-query';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  link: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface LandingConfig {
  id: number;
  tenant_id: number;
  language: string;

  // Hero Section
  hero_title: string;
  hero_title_line2?: string;
  hero_subtitle: string;
  hero_badge?: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_image_url?: string;
  hero_bg_gradient_from?: string;
  hero_bg_gradient_to?: string;

  // Features Section
  features_title: string;
  features_json: FeatureItem[];

  // Stats Section
  stats_json: StatItem[];

  // Testimonials Section
  testimonials_json: Testimonial[];

  // CTA Section
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;

  is_active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: LandingConfig | null;
  message?: string;
}

export function useLandingConfig(tenant: string = 'genlerimnediyor', language: string = 'tr') {
  return useQuery<LandingConfig | null>({
    queryKey: ['landing-config', tenant, language],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const url = `${apiUrl}/index.php?action=get_landing_config&tenant=${tenant}&language=${language}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch landing config: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch landing config');
      }

      // Parse JSON fields if they are strings
      if (data.data) {
        return {
          ...data.data,
          features_json: typeof data.data.features_json === 'string'
            ? JSON.parse(data.data.features_json)
            : data.data.features_json,
          stats_json: typeof data.data.stats_json === 'string'
            ? JSON.parse(data.data.stats_json)
            : data.data.stats_json,
          testimonials_json: typeof data.data.testimonials_json === 'string'
            ? JSON.parse(data.data.testimonials_json)
            : data.data.testimonials_json,
        };
      }

      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export default useLandingConfig;
