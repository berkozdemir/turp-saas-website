import { useState, useEffect } from "react";
import { blogApi } from "@/iwrs/lib/api";
import { Button } from "@/iwrs/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/iwrs/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/iwrs/components/ui/table";
import { Badge } from "@/iwrs/components/ui/badge";
import { useToast } from "@/iwrs/hooks/use-toast";
import { Pencil, Trash2, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface BlogPost {
    id: string;
    slug: string;
    title_tr: string;
    title_en: string | null;
    title_zh: string | null;
    content_tr: string;
    content_en: string | null;
    content_zh: string | null;
    excerpt_tr: string | null;
    excerpt_en: string | null;
    excerpt_zh: string | null;
    status: string;
    featured_image: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface AdminBlogListProps {
    onEdit: (post: BlogPost) => void;
    onCreate: () => void;
}

export function AdminBlogList({ onEdit, onCreate }: AdminBlogListProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const { toast } = useToast();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await blogApi.getAll();
            setPosts(data || []);
        } catch (error) {
            toast({
                title: t('adminDashboard.messages.loadError'),
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;

        try {
            await blogApi.delete(id);
            toast({
                title: t('adminDashboard.messages.deleteSuccess'),
            });
            fetchPosts();
        } catch (error) {
            toast({
                title: t('adminDashboard.messages.deleteError'),
                variant: "destructive",
            });
        }
    };

    const TranslationBadge = ({ hasTranslation, lang }: { hasTranslation: boolean; lang: string }) => (
        <span className={`inline-flex items-center gap-0.5 text-xs ${hasTranslation ? 'text-green-600' : 'text-amber-500'}`}>
            {lang}
            {hasTranslation ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
        </span>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Blog Yönetimi</h2>
                    <p className="text-muted-foreground">Tek içerikten çok dilli yayın oluşturabilirsiniz.</p>
                </div>
                <Button onClick={onCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('adminDashboard.createPost')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('adminDashboard.allPosts')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('adminDashboard.table.title')}</TableHead>
                                <TableHead>Çeviriler</TableHead>
                                <TableHead>{t('adminDashboard.table.slug')}</TableHead>
                                <TableHead>{t('adminDashboard.table.status')}</TableHead>
                                <TableHead>{t('adminDashboard.table.publishedAt')}</TableHead>
                                <TableHead>{t('adminDashboard.table.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                        Henüz blog yazısı yok. "Yeni Ekle" ile başlayın.
                                    </TableCell>
                                </TableRow>
                            )}
                            {posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">{post.title_tr || '(başlıksız)'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <TranslationBadge hasTranslation={!!post.title_tr} lang="TR" />
                                            <TranslationBadge hasTranslation={!!post.title_en} lang="EN" />
                                            <TranslationBadge hasTranslation={!!post.title_zh} lang="ZH" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-sm">{post.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                                            {post.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {post.published_at
                                            ? new Date(post.published_at).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => onEdit(post)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => handleDelete(post.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
