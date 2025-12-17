export const detectLocationSettings = async () => {
  if (typeof window === "undefined") return { lang: 'en', currency: 'USD' };

  // 1. Cache Kontrolü (24 Saat)
  const CACHE_KEY = 'user_geo_location';
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // 24 saat geçerli (1000 * 60 * 60 * 24)
    if (Date.now() - timestamp < 86400000) {
      return data;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error('IP API Error');

    const data = await response.json();
    const country = data.country_code;

    let result = { lang: 'en', currency: 'USD' };

    if (country === 'TR') result = { lang: 'tr', currency: 'TRY' };
    else if (['DE', 'FR', 'IT', 'ES', 'NL', 'BE'].includes(country)) result = { lang: 'en', currency: 'EUR' }; // Simple Euro Zone
    else if (country === 'CN') result = { lang: 'zh', currency: 'USD' };

    // 2. Cache'e Yaz
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));

    return result;

  } catch (error) {
    // Hata durumunda varsayılan olarak TR dönelim (geliştirme ortamı genelde TR olduğu için)
    // Production'da EN dönebilir ama şimdilik TR daha rahat test sağlar.
    console.warn('Geo-location failed, defaulting to TR settings');
    return { lang: 'tr', currency: 'TRY' };
  }
};
