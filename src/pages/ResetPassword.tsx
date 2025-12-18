import { useState, useEffect } from "react";
import { Lock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

interface ResetPasswordProps {
    token: string;
    setView: (view: any) => void;
}

export const ResetPassword = ({ token, setView }: ResetPasswordProps) => {
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "/api";

    // Verify token on mount
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/admin_auth.php?action=verify-reset-token&token=${token}`
                );
                const data = await response.json();

                if (data.valid) {
                    setIsValid(true);
                } else {
                    setError(data.error || "Token geçersiz");
                }
            } catch (err) {
                setError("Bağlantı hatası oluştu");
            } finally {
                setIsValidating(false);
            }
        };

        verifyToken();
    }, [token, API_URL]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate passwords
        if (newPassword.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/admin_auth.php?action=reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, new_password: newPassword }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else if (data.success) {
                setSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    setView("admin"); // This will show login page
                }, 3000);
            }
        } catch (err) {
            setError("Bağlantı hatası oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
                {isValidating ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
                        <p className="text-slate-600">Token doğrulanıyor...</p>
                    </div>
                ) : !isValid ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={32} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Token Geçersiz</h2>
                        <p className="text-slate-600 mb-8">{error}</p>
                        <button
                            onClick={() => setView("admin")}
                            className="text-cyan-600 hover:text-cyan-700 font-medium"
                        >
                            ← Giriş ekranına dön
                        </button>
                    </div>
                ) : success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={32} className="text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Şifre Başarıyla Güncellendi!</h2>
                        <p className="text-slate-600 mb-4">Yeni şifrenizle giriş yapabilirsiniz.</p>
                        <p className="text-sm text-slate-500">Giriş sayfasına yönlendiriliyorsunuz...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Lock size={32} className="text-cyan-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Yeni Şifre Oluştur</h2>
                            <p className="text-slate-600">Hesabınız için güvenli bir şifre belirleyin</p>
                        </div>

                        <form onSubmit={handleResetPassword} className="space-y-6">
                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Yeni Şifre
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all outline-none"
                                    placeholder="En az 8 karakter"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-slate-500 mt-1">Minimum 8 karakter uzunluğunda olmalı</p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Şifre Tekrar
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-cyan-500 focus:ring focus:ring-cyan-200 transition-all outline-none"
                                    placeholder="Şifreyi tekrar girin"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Şifre güncelleniyor..." : "Şifreyi Sıfırla"}
                                {!isLoading && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setView("admin")}
                                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                            >
                                ← Giriş ekranına dön
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
