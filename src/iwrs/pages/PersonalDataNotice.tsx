import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { ScrollArea } from "@/iwrs/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

// --- YARDIMCI BİLGİLER (PrivacyPolicy ve TermsOfService ile aynı) ---
const SHARED_INFO = {
    address: "Piri Reis Caddesi No: 2/4, Beytepe, Çankaya, Ankara, Türkiye",
    phone: "+90 312 426 77 22",
    email: "info@omega-cro.com.tr",
    kvkkEmail: "kvkk@omegaprogenetik.com"
};

// --- İÇERİK VERİ YAPILARI ---

// 🇹🇷 TÜRKÇE İÇERİK
const TR_NOTICE = {
  title: "KİŞİSEL VERİLERİN İŞLENMESİ VE AYDINLATMA METNİ",
  sections: [
    {
      id: "1",
      title: "1. Veri Sorumlusu ve Amaç",
      content: [
        { type: "paragraph", text: 'Omega CRO olarak, 6698 sayılı **Kişisel Verilerin Korunması Kanunu** ("KVKK") uyarınca, Veri Sorumlusu sıfatıyla kişisel verilerinizi işlemekteyiz.' },
        { type: "paragraph", text: "İşleme amaçlarımız; tıbbi teşhis, tedavi, hasta kayıtlarının tutulması ve yasal yükümlülüklerin yerine getirilmesidir." },
      ]
    },
    {
      id: "2",
      title: "2. İşlenen Veri Kategorileri",
      content: [
        { type: "list", list: ["**Kimlik Bilgileri:** Ad, soyad, TC Kimlik Numarası, doğum tarihi", "**İletişim Bilgileri:** Adres, telefon numarası, e-posta adresi", "**Özel Nitelikli Kişisel Veriler:** Sağlık verileri, genetik veriler, biyometrik veriler", "**Finansal Bilgiler:** Fatura ve ödeme bilgileri"] }
      ]
    },
    {
      id: "3",
      title: "3. Veri Toplama Yöntemi ve Hukuki Sebep",
      content: [
        { type: "paragraph", text: "Verileriniz; web sitemiz, iletişim formları, e-posta ve elektronik ortamlar aracılığıyla toplanır. Hukuki sebep; **KVKK Madde 5/2-ç (hizmet ilişkisinin kurulması)** ve **5/2-e (hukuki yükümlülük)**’tür." }
      ]
    },
    {
      id: "4",
      title: "4. Veri Aktarımı",
      content: [
        { type: "paragraph", text: "Kişisel verileriniz; **Sağlık Bakanlığı**, **SGK**, **Mahkemeler** ve **anlaşmalı özel sigorta şirketleri** gibi yetkili kurum ve kuruluşlara aktarılabilir." }
      ]
    },
    {
      id: "5",
      title: "5. Veri Sahibinin Hakları (KVKK Madde 11)",
      content: [
        { type: "paragraph", text: "Kişisel verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme ve silme haklarına sahipsiniz." },
        { type: "paragraph", text: "Haklarınızı kullanmak için; **Piri Reis Caddesi No: 2/4, Beytepe, Çankaya, Ankara, Türkiye** adresimize yazılı olarak veya **[kvkk@omegaprogenetik.com]** adresine güvenli elektronik imza ile başvurabilirsiniz." }
      ]
    }
  ]
};

// 🇺🇸 İNGİLİZCE İÇERİK
const EN_NOTICE = {
  title: "PERSONAL DATA PROCESSING AND INFORMATION NOTICE",
  sections: [
    {
      id: "1",
      title: "1. Data Controller and Purpose",
      content: [
        { type: "paragraph", text: 'As Omega CRO, we process your personal data as the Data Controller in accordance with the **Law on the Protection of Personal Data No. 6698** ("KVKK").' },
        { type: "paragraph", text: "Our processing purposes include medical diagnosis, treatment, maintenance of patient records, and fulfillment of legal obligations." },
      ]
    },
    {
      id: "2",
      title: "2. Categories of Processed Personal Data",
      content: [
        { type: "list", list: ["**Identity Information:** Name, surname, Turkish ID number, date of birth", "**Contact Information:** Address, phone number, e-mail address", "**Special Categories of Personal Data:** Health data, genetic data, biometric data", "**Financial Information:** Billing and payment details"] }
      ]
    },
    {
      id: "3",
      title: "3. Data Collection Method and Legal Ground",
      content: [
        { type: "paragraph", text: "Your personal data is collected via our website, contact forms, e-mail, and other electronic environments. The legal ground is **KVKK Article 5/2-c (establishment of service relationship)** and **5/2-e (legal obligation)**." }
      ]
    },
    {
      id: "4",
      title: "4. Data Transfer",
      content: [
        { type: "paragraph", text: "Your personal data may be transferred to **Ministry of Health**, **SGK**, **Courts**, and **contracted private insurance companies**." }
      ]
    },
    {
      id: "5",
      title: "5. Data Subject Rights (KVKK Article 11)",
      content: [
        { type: "paragraph", text: "You have the right to learn whether your data is processed, request information, correction, and deletion." },
        { type: "paragraph", text: "To exercise your rights, you can apply in writing to the address **Piri Reis Caddesi No: 2/4, Beytepe, Çankaya, Ankara, Türkiye** or via secure electronic signature to **[kvkk@omegaprogenetik.com]**." }
      ]
    }
  ]
};

// 🇨🇳 ÇİNCE İÇERİK
const ZH_NOTICE = {
  title: "个人数据处理和信息声明",
  sections: [
    {
      id: "1",
      title: "1. 数据控制者和目的",
      content: [
        { type: "paragraph", text: '作为 Omega CRO，我们根据**《个人数据保护法》**（KVKK）作为数据控制者处理您的个人数据。' },
        { type: "paragraph", text: "我们的处理目的包括医疗诊断、治疗、维护患者记录和履行法律义务。" },
      ]
    },
    {
      id: "2",
      title: "2. 处理的个人数据类别",
      content: [
        { type: "list", list: ["**身份信息：** 姓名、姓氏、土耳其身份证号码、出生日期", "**联系信息：** 地址、电话号码、电子邮件地址", "**特殊类别的个人数据：** 健康数据、基因数据、生物识别数据", "**财务信息：** 账单和付款详情"] }
      ]
    },
    {
      id: "3",
      title: "3. 数据收集方法及法律依据",
      content: [
        { type: "paragraph", text: "您的个人数据通过我们的网站、联系表格、电子邮件和电子环境收集。法律依据是 **KVKK 第 5/2-c 条**和 **5/2-e 条**。" }
      ]
    },
    {
      id: "4",
      title: "4. 数据传输",
      content: [
        { type: "paragraph", text: "您的个人数据可传输至 **卫生部**、**SGK**、**法院**和**签约的私人保险公司**等授权机构。" }
      ]
    },
    {
      id: "5",
      title: "5. 数据主体权利（KVKK 第11条）",
      content: [
        { type: "paragraph", text: "您有权了解您的数据是否被处理、请求信息、更正和删除。" },
        { type: "paragraph", text: "为行使您的权利，您可以书面形式提交请求至 **Piri Reis Caddesi No: 2/4, Beytepe, Çankaya, Ankara, Türkiye** 或通过安全电子签名发送至 **[kvkk@omegaprogenetik.com]**。" }
      ]
    }
  ]
};

// --- YARDIMCI KOMPONENT (Renderer) ---
const PolicyContentRenderer = ({ contentItem }: { contentItem: any }) => {
  if (contentItem.type === "paragraph") {
    const parts = contentItem.text.split(/(\*\*.*?\*\*)/g).map((part: string, index: number) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    return <p>{parts}</p>;
  }

  if (contentItem.type === "list") {
    return (
      <ul className="list-disc pl-5 space-y-1 mt-2">
        {contentItem.list.map((item: string, index: number) => {
          // E-posta adresini otomatik link yapar
          const textWithLink = item.replace(
            '[kvkk@omegaprogenetik.com]', 
            `<a href="mailto:kvkk@omegaprogenetik.com" class="text-primary hover:underline">kvkk@omegaprogenetik.com</a>`
          );

          const parts = textWithLink.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          });
          
          return <li key={index} dangerouslySetInnerHTML={{ __html: parts.join('') }}></li>;
        })}
      </ul>
    );
  }
  
  return null;
};

// --- ANA KOMPONENT ---
const PersonalDataNotice = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  let noticeContent = EN_NOTICE;
  if (currentLanguage === 'tr') {
      noticeContent = TR_NOTICE;
  } else if (currentLanguage === 'zh') {
      noticeContent = ZH_NOTICE;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary">{noticeContent.title}</h1>
        
        <ScrollArea className="h-[600px] w-full rounded-md border p-8 bg-card shadow-sm">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground">
            
            {noticeContent.sections.map((section) => (
              <section key={section.id}>
                <h2 className="text-xl font-semibold mb-3 border-b pb-1">{section.title}</h2>
                <div className="space-y-4">
                  {section.content.map((item, index) => (
                    <PolicyContentRenderer key={index} contentItem={item} />
                  ))}
                </div>
              </section>
            ))}
            
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-3 border-b pb-1">İletişim</h2>
                <p>
                    <strong>Adres:</strong> {SHARED_INFO.address}<br />
                    <strong>E-posta:</strong> <a href={`mailto:${SHARED_INFO.email}`} className="text-primary hover:underline">{SHARED_INFO.email}</a>
                </p>
            </section>

          </div>
        </ScrollArea>
      </main>
      <Footer />
    </div>
  );
};

export default PersonalDataNotice;