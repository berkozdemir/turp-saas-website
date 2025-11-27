export const detectLocationSettings = async () => {
  if (typeof window === "undefined") {
    // SSR ortamında çalışıyorsan default dön
    return { lang: 'en', currency: 'USD' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();
    const country = data.country_code;

    if (country === 'TR') return { lang: 'tr', currency: 'TRY' };
    if (EURO_ZONES.includes(country)) return { lang: 'en', currency: 'EUR' };
    if (country === 'CN') return { lang: 'zh', currency: 'USD' };

    return { lang: 'en', currency: 'USD' };

  } catch (error) {
    return { lang: 'en', currency: 'USD' };
  }
};
