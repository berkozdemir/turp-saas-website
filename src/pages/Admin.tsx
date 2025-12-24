import { useState, useEffect } from "react";
import { Login } from "./Login";
import { AdminMessages } from "./admin/AdminMessages";
import { AdminBlogList } from "./admin/AdminBlogList";
import { AdminBlogEditor } from "./admin/AdminBlogEditor";
import { AdminSettings } from "./admin/AdminSettings";
import { AdminFaqList } from "./admin/AdminFaqList";
import { AdminFaqEditor } from "./admin/AdminFaqEditor";
import { AdminUserList } from "./admin/AdminUserList";
import { AdminUserEditor } from "./admin/AdminUserEditor";
import { AdminAnalyticsSeo } from "./admin/AdminAnalyticsSeo";
import { AdminLegalList } from "./admin/AdminLegalList";
import { AdminLegalEditor } from "./admin/AdminLegalEditor";
import { AdminLandingList } from "./admin/AdminLandingList";
import { AdminLandingEditor } from "./admin/AdminLandingEditor";
import { AdminContactConfigList } from "./admin/AdminContactConfigList";
import { AdminContactConfigEditor } from "./admin/AdminContactConfigEditor";
import { AdminMediaList } from "./admin/AdminMediaList";
import { TenantProvider, useTenant, Tenant } from "../context/TenantContext";
import { TenantSelector } from "./admin/TenantSelector";
import { TenantSwitcher } from "../components/TenantSwitcher";
import {
  Mail,
  FileText,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Settings,
  HelpCircle,
  Users,
  BarChart3,
  Layout,
  Phone,
  Image
} from "lucide-react";

const AdminContent = () => {
  // Initialize session from localStorage to prevent flash of login screen
  const [session, setSession] = useState<any>(() => {
    const storedSession = localStorage.getItem("admin_session");
    return storedSession ? JSON.parse(storedSession) : null;
  });
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem("admin_active_tab") || "messages");
  const [editingPost, setEditingPost] = useState<any | null>(() => {
    const saved = localStorage.getItem("admin_editing_post");
    return saved ? JSON.parse(saved) : null;
  });
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingLegalDoc, setEditingLegalDoc] = useState<any | null>(null);
  const [editingLandingId, setEditingLandingId] = useState<number | null>(null);
  const [editingContactConfigId, setEditingContactConfigId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingTenants, setPendingTenants] = useState<Tenant[] | null>(null);

  const { currentTenant, setCurrentTenant, setAvailableTenants, clearTenantContext } = useTenant();

  const userRole = session?.user?.role || 'viewer';

  // Persist active tab
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  // Persist editing post
  useEffect(() => {
    if (editingPost) {
      localStorage.setItem("admin_editing_post", JSON.stringify(editingPost));
    } else {
      localStorage.removeItem("admin_editing_post");
    }
  }, [editingPost]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    clearTenantContext();
    setSession(null);
  };

  const handleLogin = (data: any) => {
    setSession(data);
    localStorage.setItem("admin_session", JSON.stringify(data));
    // Store tenants from login response
    if (data.tenants && data.tenants.length > 0) {
      setAvailableTenants(data.tenants);
      if (data.tenants.length === 1) {
        // Auto-select if only one tenant
        setCurrentTenant(data.tenants[0]);
      } else {
        // Show tenant selection screen
        setPendingTenants(data.tenants);
      }
    }
  };

  const handleTenantSelect = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setPendingTenants(null);
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  // Show tenant selector if logged in but no tenant selected
  if (pendingTenants && pendingTenants.length > 1 && !currentTenant) {
    return <TenantSelector tenants={pendingTenants} onSelect={handleTenantSelect} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "messages":
        return <AdminMessages token={session.token} />;
      case "blog_list":
        return (
          <AdminBlogList
            token={session.token}
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
            token={session.token}
            post={editingPost}
            onCancel={() => setActiveTab("blog_list")}
            onSave={() => setActiveTab("blog_list")}
          />
        );
      case "settings":
        return (
          <AdminSettings
            token={session.token}
            userName={session.user.name}
            userEmail={session.user.email}
          />
        );
      case "faq_list":
        return (
          <AdminFaqList
            token={session.token}
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
            token={session.token}
            faq={editingFaq}
            onCancel={() => setActiveTab("faq_list")}
            onSave={() => setActiveTab("faq_list")}
          />
        );
      case "user_list":
        return (
          <AdminUserList
            token={session.token}
            userRole={userRole}
            onEdit={(user) => {
              setEditingUser(user);
              setActiveTab("user_edit");
            }}
            onCreate={() => {
              setEditingUser(null);
              setActiveTab("user_edit");
            }}
          />
        );
      case "user_edit":
        return (
          <AdminUserEditor
            token={session.token}
            user={editingUser}
            onCancel={() => setActiveTab("user_list")}
            onSave={() => setActiveTab("user_list")}
          />
        );
      case "analytics_seo":
        return <AdminAnalyticsSeo token={session.token} />;
      case "legal_list":
        return (
          <AdminLegalList
            token={session.token}
            onEdit={(doc) => {
              setEditingLegalDoc(doc);
              setActiveTab("legal_edit");
            }}
            onCreate={() => {
              setEditingLegalDoc(null);
              setActiveTab("legal_edit");
            }}
          />
        );
      case "legal_edit":
        return (
          <AdminLegalEditor
            token={session.token}
            doc={editingLegalDoc}
            onCancel={() => setActiveTab("legal_list")}
            onSave={() => setActiveTab("legal_list")}
          />
        );
      case "landing_list":
        return (
          <AdminLandingList
            onEdit={(id) => {
              setEditingLandingId(id);
              setActiveTab("landing_edit");
            }}
          />
        );
      case "landing_edit":
        return (
          <AdminLandingEditor
            editId={editingLandingId}
            onBack={() => setActiveTab("landing_list")}
          />
        );
      case "contact_config_list":
        return (
          <AdminContactConfigList
            onEdit={(id) => {
              setEditingContactConfigId(id);
              setActiveTab("contact_config_edit");
            }}
          />
        );
      case "contact_config_edit":
        return (
          <AdminContactConfigEditor
            editId={editingContactConfigId}
            onBack={() => setActiveTab("contact_config_list")}
          />
        );
      case "media":
        return <AdminMediaList />;
      default:
        return <AdminMessages token={session.token} />;
    }
  };

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
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center font-bold text-white">T</div>
            <span className="font-heading font-bold text-lg">Turp <span className="text-slate-400">Panel</span></span>
          </div>

          {/* Tenant Switcher */}
          <div className="mb-6">
            <TenantSwitcher />
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
              onClick={() => { setActiveTab("blog_list"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("blog")
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <FileText size={20} />
              <span className="font-medium">İçerik / Blog</span>
            </button>

            <button
              onClick={() => { setActiveTab("faq_list"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("faq")
                ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <HelpCircle size={20} />
              <span className="font-medium">SSS</span>
            </button>

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab("user_list"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("user")
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Users size={20} />
                <span className="font-medium">Kullanıcılar</span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab("analytics_seo"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "analytics_seo"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <BarChart3 size={20} />
                <span className="font-medium">Analytics & SEO</span>
              </button>
            )}

            {(userRole === 'admin' || userRole === 'editor') && (
              <button
                onClick={() => { setActiveTab("legal_list"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("legal")
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <FileText size={20} />
                <span className="font-medium">Hukuki Dokümanlar</span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab("landing_list"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("landing")
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Layout size={20} />
                <span className="font-medium">Landing Builder</span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab("contact_config_list"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab.startsWith("contact_config")
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Phone size={20} />
                <span className="font-medium">İletişim Ayarları</span>
              </button>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => { setActiveTab("media"); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "media"
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-900/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Image size={20} />
                <span className="font-medium">Medya</span>
              </button>
            )}

            {userRole === 'admin' && (
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
            )}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 space-y-2">
          <a href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
            <ExternalLink size={18} />
            <span className="text-sm font-medium">Siteyi Görüntüle</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Güvenli Çıkış</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto h-screen">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {activeTab === 'messages' && "Mesaj Yönetimi"}
              {activeTab === 'blog_list' && "İçerik Yönetimi"}
              {activeTab === 'blog_edit' && "İçerik Düzenleyici"}
              {activeTab === 'faq_list' && "SSS Yönetimi"}
              {activeTab === 'faq_edit' && "SSS Düzenleyici"}
              {activeTab === 'user_list' && "Kullanıcı Yönetimi"}
              {activeTab === 'user_edit' && "Kullanıcı Düzenleyici"}
              {activeTab === 'analytics_seo' && "Analytics & SEO"}
              {activeTab === 'legal_list' && "Hukuki Dokümanlar"}
              {activeTab === 'legal_edit' && "Doküman Düzenleyici"}
              {activeTab === 'settings' && "Hesap Ayarları"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Hoşgeldin, {session.user.name}</p>
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
    </div>
  );
};

// Export with TenantProvider wrapper
export const Admin = () => (
  <TenantProvider>
    <AdminContent />
  </TenantProvider>
);