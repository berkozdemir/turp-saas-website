import { Button } from "@/iwrs/components/ui/button";
import { LanguageSwitcher } from "@/iwrs/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import omegaLogo from "@/iwrs/assets/omega-logo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/iwrs/components/ui/navigation-menu";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/iwrs/components/ui/sheet";

export const Header = () => {
  const { t } = useTranslation();

  const mobileModules = [
    { href: "/iwrs", title: t('header.iwrsInterface'), description: t('header.iwrsInterfaceDesc') },
    { href: "/emergency-unblinding", title: t('header.emergencyUnblinding'), description: t('header.emergencyUnblindingDesc') },
    { href: "/inventory-system", title: t('header.inventorySystem'), description: t('header.inventorySystemDesc') },
    { href: "/data-security", title: t('header.dataSecurity'), description: t('header.dataSecurityDesc') },
    { href: "/adverse-events-call", title: t('header.adverseEvents'), description: t('header.adverseEventsDesc') },
    { href: "/medication-reminder", title: t('header.medicationReminder'), description: t('header.medicationReminderDesc') },
    { href: "/appointment-reminder", title: t('header.appointmentReminder'), description: t('header.appointmentReminderDesc') },
    { href: "/patient-survey", title: t('header.patientSurvey'), description: t('header.patientSurveyDesc') },
  ];

  const mobileResources = [
    { href: "/references", title: t('header.references') },
    { href: "/faq", title: t('header.faq') },
    { href: "/blog", title: t('header.blog') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="/" className="block">
            {/* GÜNCELLEME: w-32 ve object-contain eklendi. Genişlik artık sabit. */}
            <img src={omegaLogo} alt="Omega CRO" className="h-12 w-32 flex-shrink-0 object-contain" />
          </a>
        </div>

        {/* MASAÜSTÜ MENÜ (md ve üstünde görünür) */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#platform" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('header.platform')}
          </a>

          <NavigationMenu>
            <NavigationMenuList>
              {/* MODÜLLER DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                  {t('header.modules')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 bg-background">
                    {mobileModules.map((item, index) => (
                      <li key={index}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* KAYNAKLAR DROPDOWN */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground bg-transparent">
                  {t('header.resources')}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[300px] gap-3 p-4 bg-background">
                    {mobileResources.map((item, index) => (
                      <li key={index}>
                        <NavigationMenuLink asChild>
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.title}
                            </div>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* İLETİŞİM */}
          <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('header.contact')}
          </a>

          {/* DİĞER LİNKLER */}
          <a href="/randomization" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('header.randomizationBot')}
          </a>

          <a href="/iwrs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t('header.demo')}
          </a>
        </div>

        {/* MOBİL VE BUTONLAR */}
        <div className="flex items-center space-x-4">
          <LanguageSwitcher />

          {/* HAMBURGER MENÜ TETİKLEYİCİSİ (md altı için) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 pt-10">

                {/* Ana Linkler */}
                <SheetClose asChild>
                  <a href="/#platform" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {t('header.platform')}
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a href="/contact" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {t('header.contact')}
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a href="/randomization" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {t('header.randomizationBot')}
                  </a>
                </SheetClose>
                <SheetClose asChild>
                  <a href="/iwrs" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {t('header.demo')}
                  </a>
                </SheetClose>

                {/* Modüller (Basitleştirilmiş Liste) */}
                <h3 className="text-sm font-bold uppercase text-muted-foreground pt-4 border-t">
                  {t('header.modules')}
                </h3>
                {mobileModules.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <a href={item.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                      {item.title}
                    </a>
                  </SheetClose>
                ))}

                {/* Kaynaklar (Basitleştirilmiş Liste) */}
                <h3 className="text-sm font-bold uppercase text-muted-foreground pt-4 border-t">
                  {t('header.resources')}
                </h3>
                {mobileResources.map((item, index) => (
                  <SheetClose asChild key={index}>
                    <a href={item.href} className="text-base text-muted-foreground hover:text-primary transition-colors">
                      {item.title}
                    </a>
                  </SheetClose>
                ))}

                {/* Butonlar */}
                <div className="flex flex-col space-y-3 pt-6 border-t">
                  <SheetClose asChild>
                    <a href="/login">
                      <Button variant="ghost" className="w-full">
                        {t('header.login')}
                      </Button>
                    </a>
                  </SheetClose>
                  <SheetClose asChild>
                    <a href="/contact">
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                        {t('header.requestDemo')}
                      </Button>
                    </a>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* MASAÜSTÜ BUTONLARI */}
          <a href="/login" className="hidden md:block">
            <Button variant="ghost" size="sm">
              {t('header.login')}
            </Button>
          </a>
          <a href="/contact" className="hidden md:block">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              {t('header.requestDemo')}
            </Button>
          </a>
        </div>
      </nav>
    </header>
  );
};