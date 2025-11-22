// Euro kullanan ülkelerin listesi (ISO Kodları)
const EURO_ZONES = [
  'AT', 'BE', 'CY', 'EE', 'FI', 'FR', 'DE', 'GR', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'SK', 'SI', 'ES'
];

export const detectLocationSettings = async () => {
  try {
    // Kullanıcının IP adresinden ülkesini bulan ücretsiz servis
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const country = data.country_code; // Örn: TR, DE, US, CN

    if (country === 'TR') {
      return { lang: 'tr', currency: 'TRY' };
    } else if (EURO_ZONES.includes(country)) {
      return { lang: 'en', currency: 'EUR' }; // Avrupa ise Euro ve İngilizce
    } else if (country === 'CN') {
      return { lang: 'zh', currency: 'USD' }; // Çin ise Çince ve Dolar
    } else {
      return { lang: 'en', currency: 'USD' }; // Diğer her yer için Dolar ve İngilizce
    }
  } catch (error) {
    console.error("Konum algılanamadı, varsayılanlara dönülüyor.", error);
    // Hata olursa (API çalışmazsa) varsayılan olarak İngilizce/USD dön
    return { lang: 'en', currency: 'USD' };
  }
};
