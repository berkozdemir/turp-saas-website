import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminMessages } from "@/iwrs/components/admin/AdminMessages";
import { AdminBlogList } from "@/iwrs/components/admin/AdminBlogList";
import { AdminBlogEditor } from "@/iwrs/components/admin/AdminBlogEditor";
import { AdminSettings } from "@/iwrs/components/admin/AdminSettings";
import { AdminFaqList } from "@/iwrs/components/admin/AdminFaqList";
import { AdminFaqEditor } from "@/iwrs/components/admin/AdminFaqEditor";
import { Menu, X, Mail, FileText, Settings, ExternalLink, LogOut, HelpCircle } from "lucide-react";
import { RandomizationBot } from "@/iwrs/components/RandomizationBot";
import { AdminUsers } from "@/iwrs/components/admin/AdminUsers";
import { AdminBotLogs } from "@/iwrs/components/admin/AdminBotLogs"; // Import new component

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Layout State
  const [activeTab, setActiveTab] = useState("messages"); // Default to messages to match Turp
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Local bypass as agreed
    // In production, we would verify token here
    setIsAdmin(true);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <AdminMessages />;
      case "blog":
        return (
          <AdminBlogList
            onEdit={(post) => {
              setEditingPost(post);
              setActiveTab("blog_edit");
            }}
            onCreate={() => {
              setEditingPost(null);
              setActiveTab("blog_edit");
            }}
          />
        );
      case "blog_edit":
        return (
          <AdminBlogEditor
            post={editingPost}
            onCancel={() => setActiveTab("blog")}
            onSave={() => setActiveTab("blog")}
          />
        );
      case "faq":
        return (
          <AdminFaqList
            onEdit={(faq) => {
              setEditingFaq(faq);
              setActiveTab("faq_edit");
            }}
            onCreate={() => {
              setEditingFaq(null);
              setActiveTab("faq_edit");
            }}
          />
        );
      case "faq_edit":
        return (
          <AdminFaqEditor
            faq={editingFaq}
            onCancel={() => setActiveTab("faq")}
            onSave={() => setActiveTab("faq")}
          />
        );
      case "settings":
        return <AdminSettings userName="Admin" userEmail="admin@iwrs.com.tr" />;
      case "users":
        return <AdminUsers />;
      case "logs":
        return <AdminBotLogs />;
      default:
        return <AdminMessages />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-full shadow-2xl"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center font-bold text-white">I</div>
            <span className="font-heading font-bold text-lg">IWRS <span className="text-slate-400">Panel</span></span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => { setActiveTab("messages"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "messages"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Mail size={20} />
              <span className="font-medium">Mesajlar</span>
            </button>

            <button
              onClick={() => { setActiveTab("blog"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "blog" || activeTab === "blog_edit"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FileText size={20} />
              <span className="font-medium">İçerik / Blog</span>
            </button>

            <button
              onClick={() => { setActiveTab("faq"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "faq" || activeTab === "faq_edit"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <HelpCircle size={20} />
              <span className="font-medium">S.S.S</span>
            </button>

            <button
              onClick={() => { setActiveTab("users"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "users"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FileText size={20} /> {/* Reusing icon or import User icon */}
              <span className="font-medium">Kullanıcılar</span>
            </button>

            <button
              onClick={() => { setActiveTab("logs"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "logs"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FileText size={20} />
              <span className="font-medium">Loglar</span>
            </button>

            <button
              onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Settings size={20} />
              <span className="font-medium">Ayarlar</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <ExternalLink size={18} />
            <span className="text-sm font-medium">Siteyi Görüntüle</span>
          </a>
          <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen w-full">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'blog' && "İçerik Yönetimi"}
              {activeTab === 'blog_edit' && "İçerik Düzenleyici"}
              {activeTab === 'messages' && "Mesaj Kutusu"}
              {activeTab === 'faq' && "Sıkça Sorulan Sorular"}
              {activeTab === 'faq_edit' && "SSS Düzenleyici"}
              {activeTab === 'settings' && "Panel Ayarları"}
              {activeTab === 'users' && "Kullanıcı Yönetimi"}
              {activeTab === 'logs' && "Sistem Günlükleri"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Hoşgeldin</p>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* AI Bot */}
      <RandomizationBot />
    </div>
  );
}
