import { useQuery } from '@tanstack/react-query';

export interface ContactConfig {
  id: number;
  tenant_id: number;
  language: string;
  contact_title: string;
  contact_subtitle: string;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
  phone: string;
  whatsapp?: string;
  email: string;
  support_email?: string;
  sales_email?: string;
  working_hours?: string;
  is_active: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ContactConfig | null;
  message?: string;
}

export function useContactConfig(tenant: string = 'genlerimnediyor', language: string = 'tr') {
  return useQuery<ContactConfig | null>({
    queryKey: ['contact-config', tenant, language],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const url = `${apiUrl}/index.php?action=get_contact_config&tenant=${tenant}&language=${language}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch contact config: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch contact config');
      }

      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export default useContactConfig;
