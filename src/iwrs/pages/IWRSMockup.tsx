import { useState } from "react";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Input } from "@/iwrs/components/ui/input";
import { Label } from "@/iwrs/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/iwrs/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/iwrs/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/iwrs/components/ui/tabs";
import { Badge } from "@/iwrs/components/ui/badge";
import { ArrowLeft, Users, Pill, BarChart3, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IWRSMockup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState("randomize");

  // Mock data
  const recentRandomizations = [
    {
      id: "PT-001",
      date: "2024-01-15",
      group: "Treatment A",
      site: "Site 001",
      status: "active"
    },
    {
      id: "PT-002",
      date: "2024-01-15",
      group: "Placebo",
      site: "Site 001",
      status: "active"
    },
    {
      id: "PT-003",
      date: "2024-01-14",
      group: "Treatment B",
      site: "Site 002",
      status: "active"
    },
    {
      id: "PT-004",
      date: "2024-01-14",
      group: "Treatment A",
      site: "Site 003",
      status: "completed"
    },
    {
      id: "PT-005",
      date: "2024-01-13",
      group: "Placebo",
      site: "Site 002",
      status: "active"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-primary">Omega</span>
                  <span className="text-foreground"> IWRS</span>
                </h1>
                <p className="text-sm text-muted-foreground">{t('iwrsMockup.header')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-xs">{t('iwrsMockup.studyId')}: ONX-2024-001</Badge>
              <Button variant="outline" size="sm">{t('iwrsMockup.signOut')}</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('iwrsMockup.stats.totalPatients')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">247</div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('iwrsMockup.stats.randomizedToday')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">12</div>
                <BarChart3 className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('iwrsMockup.stats.activeSites')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">5</div>
                <FileCheck className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('iwrsMockup.stats.ipsInventory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">1,247</div>
                <Pill className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="randomize">{t('iwrsMockup.tabs.randomize')}</TabsTrigger>
            <TabsTrigger value="inventory">{t('iwrsMockup.tabs.inventory')}</TabsTrigger>
            <TabsTrigger value="reports">{t('iwrsMockup.tabs.reports')}</TabsTrigger>
            <TabsTrigger value="ai-assistant">{t('iwrsMockup.tabs.aiAssistant')}</TabsTrigger>
          </TabsList>

          <TabsContent value="randomize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('iwrsMockup.randomizeForm.title')}</CardTitle>
                <CardDescription>{t('iwrsMockup.randomizeForm.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">{t('iwrsMockup.randomizeForm.patientId')}</Label>
                    <Input id="patientId" placeholder={t('iwrsMockup.randomizeForm.patientIdPlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site">{t('iwrsMockup.randomizeForm.site')}</Label>
                    <Select>
                      <SelectTrigger id="site">
                        <SelectValue placeholder={t('iwrsMockup.randomizeForm.selectSite')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="site001">Site 001</SelectItem>
                        <SelectItem value="site002">Site 002</SelectItem>
                        <SelectItem value="site003">Site 003</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stratification">{t('iwrsMockup.randomizeForm.stratificationFactor')}</Label>
                    <Select>
                      <SelectTrigger id="stratification">
                        <SelectValue placeholder={t('iwrsMockup.randomizeForm.selectFactor')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="age">Age &lt; 65</SelectItem>
                        <SelectItem value="age2">Age ≥ 65</SelectItem>
                        <SelectItem value="gender">Gender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full md:w-auto">{t('iwrsMockup.randomizeForm.randomizeButton')}</Button>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">{t('iwrsMockup.randomizeForm.result')}</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{t('iwrsMockup.randomizeForm.assignedTo')}</span> Treatment A</p>
                    <p><span className="font-medium">{t('iwrsMockup.randomizeForm.kitNumber')}</span> KIT-A-001-247</p>
                    <p><span className="font-medium">{t('iwrsMockup.randomizeForm.confirmationCode')}</span> RND-2024-001-247</p>
                  </div>
                  <Button variant="outline" className="mt-4">{t('iwrsMockup.randomizeForm.printLabel')}</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('iwrsMockup.recentRandomizations.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('iwrsMockup.recentRandomizations.patientId')}</TableHead>
                      <TableHead>{t('iwrsMockup.recentRandomizations.date')}</TableHead>
                      <TableHead>{t('iwrsMockup.recentRandomizations.group')}</TableHead>
                      <TableHead>{t('iwrsMockup.recentRandomizations.site')}</TableHead>
                      <TableHead>{t('iwrsMockup.recentRandomizations.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentRandomizations.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.group}</TableCell>
                        <TableCell>{item.site}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === "active" ? "default" : "secondary"}>
                            {t(`iwrsMockup.statusBadges.${item.status}`)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>{t('iwrsMockup.inventory.title')}</CardTitle>
                <CardDescription>{t('iwrsMockup.inventory.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('iwrsMockup.inventory.site')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.treatmentA')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.treatmentB')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.placebo')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.total')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.status')}</TableHead>
                      <TableHead>{t('iwrsMockup.inventory.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Site 001</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>52</TableCell>
                      <TableCell>48</TableCell>
                      <TableCell>145</TableCell>
                      <TableCell><Badge variant="outline">{t('iwrsMockup.statusBadges.adequate')}</Badge></TableCell>
                      <TableCell><Button size="sm" variant="outline">{t('iwrsMockup.inventory.restock')}</Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Site 002</TableCell>
                      <TableCell>12</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>15</TableCell>
                      <TableCell>35</TableCell>
                      <TableCell><Badge variant="destructive">{t('iwrsMockup.statusBadges.lowStock')}</Badge></TableCell>
                      <TableCell><Button size="sm" variant="outline">{t('iwrsMockup.inventory.restock')}</Button></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Site 003</TableCell>
                      <TableCell>67</TableCell>
                      <TableCell>71</TableCell>
                      <TableCell>65</TableCell>
                      <TableCell>203</TableCell>
                      <TableCell><Badge variant="outline">{t('iwrsMockup.statusBadges.adequate')}</Badge></TableCell>
                      <TableCell><Button size="sm" variant="outline">{t('iwrsMockup.inventory.restock')}</Button></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('iwrsMockup.reports.title')}</CardTitle>
                  <CardDescription>{t('iwrsMockup.reports.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">{t('iwrsMockup.reports.enrollmentProgress')}</h3>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      [Chart: {t('iwrsMockup.reports.enrollmentProgress')}]
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{t('iwrsMockup.reports.target')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">{t('iwrsMockup.reports.groupDistribution')}</h3>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      [Chart: {t('iwrsMockup.reports.groupDistribution')}]
                    </div>
                  </div>
                  <Button>{t('iwrsMockup.reports.generateReport')}</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant">
            <Card>
              <CardHeader>
                <CardTitle>{t('iwrsMockup.aiAssistant.title')}</CardTitle>
                <CardDescription>{t('iwrsMockup.aiAssistant.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder={t('iwrsMockup.aiAssistant.placeholder')} className="flex-1" />
                  <Button>{t('iwrsMockup.aiAssistant.send')}</Button>
                </div>
                <div className="space-y-4 mt-6">
                  <h3 className="font-semibold">{t('iwrsMockup.aiAssistant.suggestions')}</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm">{t('iwrsMockup.aiAssistant.balanceWarning')}</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-sm">{t('iwrsMockup.aiAssistant.inventoryAlert')}</p>
                    </div>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm">{t('iwrsMockup.aiAssistant.enrollmentTrend')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default IWRSMockup;
