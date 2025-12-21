import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { randomizationApi, authApi } from "@/iwrs/lib/api"; // Added
import { useToast } from "@/iwrs/hooks/use-toast";
import { Button } from "@/iwrs/components/ui/button";
import { Input } from "@/iwrs/components/ui/input";
import { Label } from "@/iwrs/components/ui/label";
import { Textarea } from "@/iwrs/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/iwrs/components/ui/radio-group";
import { Checkbox } from "@/iwrs/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Header } from "@/iwrs/components/Header";
import { Footer } from "@/iwrs/components/Footer";
import { useTranslation } from "react-i18next";

const RandomizationForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = useMemo(() => z.object({
    contactPerson: z.string().trim().min(1, t('randomizationForm.validation.contactPerson')).max(200),
    institution: z.string().trim().min(1, t('randomizationForm.validation.institution')).max(300),
    phone: z.string().trim().min(1, t('randomizationForm.validation.phone')).max(20),
    email: z.string().trim().email(t('randomizationForm.validation.email')).max(255),
    studyName: z.string().trim().min(1, t('randomizationForm.validation.studyName')).max(500),
    studyType: z.enum(["rct", "observational", "other"], {
      required_error: t('randomizationForm.validation.studyType'),
    }),
    studyTypeOther: z.string().max(200).optional(),
    treatmentArms: z.coerce.number().min(2, t('randomizationForm.validation.treatmentArms')).max(100),
    totalParticipants: z.coerce.number().min(1, t('randomizationForm.validation.totalParticipants')).max(1000000),
    hasStratification: z.boolean(),
    stratificationFactors: z.string().max(1000).optional(),
    randomizationMethod: z.enum(["simple", "block", "stratified", "adaptive", "help"], {
      required_error: t('randomizationForm.validation.randomizationMethod'),
    }),
    blockSize: z.string().max(100).optional(),
    hasBlinding: z.boolean(),
    blindingDetails: z.string().max(500).optional(),
    emergencyCodeOpening: z.boolean(),
    inventoryIntegration: z.boolean(),
    reportingPreferences: z.array(z.string()).min(1, t('randomizationForm.validation.reportingPreferences')),
    testRun: z.boolean(),
  }), [t]);

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactPerson: "",
      institution: "",
      phone: "",
      email: "",
      hasStratification: false,
      hasBlinding: false,
      emergencyCodeOpening: false,
      inventoryIntegration: false,
      testRun: false,
      reportingPreferences: [],
    },
  });

  const studyType = watch("studyType");
  const hasStratification = watch("hasStratification");
  const hasBlinding = watch("hasBlinding");
  const randomizationMethod = watch("randomizationMethod");
  const reportingPreferences = watch("reportingPreferences") || [];

  // ... imports

  // ... inside component
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { session } = await authApi.getSession();

      if (!session) {
        toast({
          title: t('randomizationForm.authError'),
          description: t('randomizationForm.authErrorDesc'),
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      await randomizationApi.submit(data);

      toast({
        title: t('randomizationForm.successTitle'),
        description: t('randomizationForm.success'),
      });

      navigate("/");
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: t('randomizationForm.errorTitle'),
        description: error.message || t('randomizationForm.error'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReportingPreference = (value: string) => {
    const current = reportingPreferences || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue("reportingPreferences", updated);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">{t('randomizationForm.title')}</CardTitle>
            <CardDescription>
              {t('randomizationForm.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4 border-b border-border pb-6">
                <h3 className="text-lg font-semibold">{t('randomizationForm.contactInfo')}</h3>

                <div>
                  <Label htmlFor="contactPerson">{t('randomizationForm.fullName')} *</Label>
                  <Input
                    id="contactPerson"
                    placeholder={t('randomizationForm.fullNamePlaceholder')}
                    {...register("contactPerson")}
                  />
                  {errors.contactPerson && (
                    <p className="text-sm text-destructive mt-1">{errors.contactPerson.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="institution">{t('randomizationForm.institution')} *</Label>
                  <Input
                    id="institution"
                    placeholder={t('randomizationForm.institutionPlaceholder')}
                    {...register("institution")}
                  />
                  {errors.institution && (
                    <p className="text-sm text-destructive mt-1">{errors.institution.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">{t('randomizationForm.phone')} *</Label>
                  <Input
                    id="phone"
                    placeholder="+90 555 555 55 55"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">{t('randomizationForm.email')} *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Study Information */}
              <div className="space-y-2">
                <Label htmlFor="studyName">{t('randomizationForm.studyNameLabel')} *</Label>
                <Textarea
                  id="studyName"
                  {...register("studyName")}
                  placeholder={t('randomizationForm.studyNamePlaceholder')}
                  className="min-h-20"
                />
                {errors.studyName && (
                  <p className="text-sm text-destructive">{errors.studyName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('randomizationForm.studyTypeLabel')} *</Label>
                <RadioGroup
                  value={studyType}
                  onValueChange={(value) => setValue("studyType", value as any)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rct" id="rct" />
                    <Label htmlFor="rct">{t('randomizationForm.studyTypeRCT')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="observational" id="observational" />
                    <Label htmlFor="observational">{t('randomizationForm.studyTypeObservational')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t('randomizationForm.studyTypeOther')}</Label>
                  </div>
                </RadioGroup>
                {studyType === "other" && (
                  <Input
                    {...register("studyTypeOther")}
                    placeholder={t('randomizationForm.studyTypeOtherPlaceholder')}
                    className="mt-2"
                  />
                )}
                {errors.studyType && (
                  <p className="text-sm text-destructive">{errors.studyType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatmentArms">{t('randomizationForm.treatmentArmsLabel')} *</Label>
                <Input
                  id="treatmentArms"
                  type="number"
                  min="2"
                  {...register("treatmentArms")}
                  placeholder="2"
                />
                {errors.treatmentArms && (
                  <p className="text-sm text-destructive">{errors.treatmentArms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalParticipants">{t('randomizationForm.totalParticipants')} *</Label>
                <Input
                  id="totalParticipants"
                  type="number"
                  min="1"
                  {...register("totalParticipants")}
                  placeholder="100"
                />
                {errors.totalParticipants && (
                  <p className="text-sm text-destructive">{errors.totalParticipants.message}</p>
                )}
              </div>

              {/* Stratification */}
              <div className="space-y-2">
                <Label>{t('randomizationForm.stratificationLabel')}</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasStratification"
                    checked={hasStratification}
                    onCheckedChange={(checked) => setValue("hasStratification", checked as boolean)}
                  />
                  <Label htmlFor="hasStratification">{t('randomizationForm.stratification')}</Label>
                </div>
                {hasStratification && (
                  <Textarea
                    {...register("stratificationFactors")}
                    placeholder={t('randomizationForm.stratificationFactorsPlaceholder')}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Randomization Method */}
              <div className="space-y-2">
                <Label>{t('randomizationForm.randomizationMethodLabel')} *</Label>
                <RadioGroup
                  value={randomizationMethod}
                  onValueChange={(value) => setValue("randomizationMethod", value as any)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="simple" id="simple" />
                    <Label htmlFor="simple">{t('randomizationForm.methodSimple')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="block" id="block" />
                    <Label htmlFor="block">{t('randomizationForm.methodBlock')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stratified" id="stratified" />
                    <Label htmlFor="stratified">{t('randomizationForm.methodStratified')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="adaptive" id="adaptive" />
                    <Label htmlFor="adaptive">{t('randomizationForm.methodAdaptive')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="help" id="help" />
                    <Label htmlFor="help">{t('randomizationForm.methodHelp')}</Label>
                  </div>
                </RadioGroup>
                {randomizationMethod === "block" && (
                  <div className="mt-2">
                    <Label htmlFor="blockSize">{t('randomizationForm.blockSizeLabel')}</Label>
                    <Input
                      id="blockSize"
                      {...register("blockSize")}
                      placeholder={t('randomizationForm.blockSizePlaceholder')}
                    />
                  </div>
                )}
                {errors.randomizationMethod && (
                  <p className="text-sm text-destructive">{errors.randomizationMethod.message}</p>
                )}
              </div>

              {/* Blinding */}
              <div className="space-y-2">
                <Label>{t('randomizationForm.blindingLabel')}</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasBlinding"
                    checked={hasBlinding}
                    onCheckedChange={(checked) => setValue("hasBlinding", checked as boolean)}
                  />
                  <Label htmlFor="hasBlinding">{t('randomizationForm.blinding')}</Label>
                </div>
                {hasBlinding && (
                  <Textarea
                    {...register("blindingDetails")}
                    placeholder={t('randomizationForm.blindingDetailsPlaceholder')}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Additional Options */}
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-lg font-semibold">{t('randomizationForm.additionalOptions')}</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergencyCodeOpening"
                    {...register("emergencyCodeOpening")}
                  />
                  <Label htmlFor="emergencyCodeOpening">{t('randomizationForm.emergencyCodeOpening')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inventoryIntegration"
                    {...register("inventoryIntegration")}
                  />
                  <Label htmlFor="inventoryIntegration">{t('randomizationForm.inventoryIntegration')}</Label>
                </div>

                <div className="space-y-2">
                  <Label>{t('randomizationForm.reportingPreferencesLabel')} *</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="daily"
                        checked={reportingPreferences.includes("daily")}
                        onCheckedChange={() => toggleReportingPreference("daily")}
                      />
                      <Label htmlFor="daily">{t('randomizationForm.reportingDaily')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weekly"
                        checked={reportingPreferences.includes("weekly")}
                        onCheckedChange={() => toggleReportingPreference("weekly")}
                      />
                      <Label htmlFor="weekly">{t('randomizationForm.reportingWeekly')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="monthly"
                        checked={reportingPreferences.includes("monthly")}
                        onCheckedChange={() => toggleReportingPreference("monthly")}
                      />
                      <Label htmlFor="monthly">{t('randomizationForm.reportingMonthly')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onDemand"
                        checked={reportingPreferences.includes("onDemand")}
                        onCheckedChange={() => toggleReportingPreference("onDemand")}
                      />
                      <Label htmlFor="onDemand">{t('randomizationForm.reportingOnDemand')}</Label>
                    </div>
                  </div>
                  {errors.reportingPreferences && (
                    <p className="text-sm text-destructive">{errors.reportingPreferences.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="testRun"
                    {...register("testRun")}
                  />
                  <Label htmlFor="testRun">{t('randomizationForm.testRunLabel')}</Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('randomizationForm.submitting') : t('randomizationForm.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default RandomizationForm;
