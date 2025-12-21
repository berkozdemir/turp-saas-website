import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Lock, Unlock, FileText, Shield, CheckCircle } from "lucide-react";
import emergencyUnblindingImage from "@/iwrs/assets/emergency-unblinding.jpg";
import { CallToAction } from "@/iwrs/components/CallToAction"; // <-- BURASI

export default function EmergencyUnblinding() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive mb-6">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {t('common.emergency', 'Acil Durum Prosedürü')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('emergencyUnblinding.title', 'Acil Körleme Kırma')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {t('emergencyUnblinding.description', 
                'Hasta güvenliği için acil durumlarda tedavi tahsisinin güvenli bir şekilde açılması. Tüm işlemler tam denetim kaydı ile loglanır.'
              )}
            </p>
            <img 
              src={emergencyUnblindingImage} 
              alt="Emergency Unblinding"
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Process Overview */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Lock className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('emergencyUnblinding.step1Title', 'Güvenli İstek')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('emergencyUnblinding.step1Desc', 
                    'Yetkili personel hasta bilgileri ve gerekçe ile istek oluşturur'
                  )}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('emergencyUnblinding.step2Title', 'Onay Süreci')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('emergencyUnblinding.step2Desc', 
                    'İstek otomatik olarak baş araştırmacı ve sponsor onayına gönderilir'
                  )}
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Unlock className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{t('emergencyUnblinding.step3Title', 'Kod Açma')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {t('emergencyUnblinding.step3Desc', 
                    'Onay sonrası tedavi bilgisi açılır ve tüm süreç kayıt altına alınır'
                  )}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t('emergencyUnblinding.featuresTitle', 'IWRS Sisteminde Sunulan Özellikler')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{t('emergencyUnblinding.feature1Title', 'Çok Katmanlı Güvenlik')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('emergencyUnblinding.feature1Desc', 
                      'Yetkili personel doğrulaması, iki aşamalı onay süreci ve şifreli kod açma mekanizması ile maksimum güvenlik'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{t('emergencyUnblinding.feature2Title', 'Otomatik Dokümantasyon')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('emergencyUnblinding.feature2Desc', 
                      'Tüm körleme kırma işlemleri otomatik olarak dokümante edilir, PDF raporlar anında oluşturulur'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <AlertTriangle className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{t('emergencyUnblinding.feature3Title', 'Anında Bildirim')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('emergencyUnblinding.feature3Desc', 
                      'Körleme kırma talebi oluşturulduğunda baş araştırmacı, sponsor ve düzenleyici otorite anında bilgilendirilir'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>{t('emergencyUnblinding.feature4Title', 'Onay Takibi')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t('emergencyUnblinding.feature4Desc', 
                      'Onay sürecinin her aşaması gerçek zamanlı olarak takip edilebilir, e-posta ve SMS bildirimleri ile süreç şeffaf tutulur'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">
                {t('emergencyUnblinding.ctaTitle', 'IWRS Platformumuzda Mevcut')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('emergencyUnblinding.ctaDesc', 
                  'Acil körleme kırma modülü, tam entegre IWRS platformumuzda mevcuttur. Demo talep ederek tüm özellikleri deneyebilirsiniz.'
                )}
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/iwrs">
                  <Button size="lg">
                    {t('emergencyUnblinding.viewDemo', 'Demo Görüntüle')}
                  </Button>
                </a>
                <a href="/#contact">
                  <Button size="lg" variant="outline">
                    {t('emergencyUnblinding.contactUs', 'İletişime Geçin')}
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t('emergencyUnblinding.complianceTitle', 'Uyumluluk ve Güvenlik')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('emergencyUnblinding.auditTitle', 'Tam Denetim İzi')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('emergencyUnblinding.audit1', 'Her işlem zaman damgası ile kaydedilir')}</li>
                    <li>• {t('emergencyUnblinding.audit2', 'Talep eden ve onaylayan kişiler loglanır')}</li>
                    <li>• {t('emergencyUnblinding.audit3', 'Değiştirilemez kayıt sistemi')}</li>
                    <li>• {t('emergencyUnblinding.audit4', 'Anında raporlama sistemi')}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('emergencyUnblinding.regulatoryTitle', 'Düzenleyici Uyumluluk')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {t('emergencyUnblinding.regulatory1', 'FDA 21 CFR Part 11 uyumlu')}</li>
                    <li>• {t('emergencyUnblinding.regulatory2', 'EMA GCP gereksinimlerine uygun')}</li>
                    <li>• {t('emergencyUnblinding.regulatory3', 'ICH E6(R2) standardına uygun')}</li>
                    <li>• {t('emergencyUnblinding.regulatory4', 'Yerel düzenleyici gereksinimlere uyum')}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <CallToAction />
      <Footer />
    </div>
  );
}
