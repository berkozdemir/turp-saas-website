import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Key } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [message, setMessage] = useState<{ type: "" | "error" | "success"; text: string }>({
    type: "",
    text: "",
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ type: "error", text: "Giriş başarısız: " + error.message });
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Şifre sıfırlama gönderildi." });
    }

    setLoading(false);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-20">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
            <Lock size={24} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">
            {mode === "login" ? "Yönetici Girişi" : "Şifre Sıfırlama"}
          </h2>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm font-bold text-center ${
              message.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={mode === "login" ? handleLogin : handleResetPassword}
          className="space-y-5"
        >
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
              E-posta
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="email"
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>

          {mode === "login" && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                Şifre
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-500 outline-none font-medium"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-rose-600 transition-all"
          >
            {loading
              ? "İşleniyor..."
              : mode === "login"
              ? "Giriş Yap"
              : "Bağlantı Gönder"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setMode(mode === "login" ? "reset" : "login");
              setMessage({ type: "", text: "" });
            }}
            className="text-sm text-slate-500 hover:text-rose-600 font-medium"
          >
            {mode === "login" ? "Şifremi Unuttum" : "Giriş Ekranına Dön"}
          </button>
        </div>
      </div>
    </div>
  );
};
