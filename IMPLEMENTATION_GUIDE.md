# Authentication & Podcast Implementation Guide

## ✅ COMPLETED (Backend & Email System)

1. ✅ Email service module created ([api/services/email.service.php](api/services/email.service.php))
2. ✅ HTML email template ([api/templates/emails/verification.html](api/templates/emails/verification.html))
3. ✅ Backend email verification flow updated ([api/modules/enduser_auth/enduser_auth.service.php](api/modules/enduser_auth/enduser_auth.service.php))
4. ✅ Verification endpoints added ([api/modules/enduser_auth/enduser_auth.public.controller.php](api/modules/enduser_auth/enduser_auth.public.controller.php))
5. ✅ EmailVerification page ([src/pages/EmailVerification.tsx](src/pages/EmailVerification.tsx))
6. ✅ VerifyEmail page ([src/pages/VerifyEmail.tsx](src/pages/VerifyEmail.tsx))

## 📋 REMAINING TASKS

### 1. Update useEndUserAuth Hook

**File**: `src/hooks/useEndUserAuth.tsx`

Add these methods to the interface:
```typescript
verifyEmail: (token: string) => Promise<{ success: boolean; error?: string; message?: string }>;
resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
```

Add these functions:
```typescript
async function verifyEmail(token: string) {
    try {
        const res = await fetch(`${API_URL}/index.php?action=enduser_verify_email&token=${encodeURIComponent(token)}`);
        const data = await res.json();
        return data;
    } catch {
        return { success: false, error: 'Bağlantı hatası' };
    }
}

async function resendVerification(email: string) {
    try {
        const res = await fetch(`${API_URL}/index.php?action=enduser_resend_verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        return data;
    } catch {
        return { success: false, error: 'Bağlantı hatası' };
    }
}
```

Update signup to NOT auto-login:
```typescript
async function signup(signupData: SignupData) {
    if (!settings?.allow_enduser_signup) {
        return { success: false, error: 'Bu site için kayıt aktif değil' };
    }

    try {
        const res = await fetch(`${API_URL}/index.php?action=enduser_signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });
        const data = await res.json();

        // DON'T auto-login - user must verify email first
        return data;
    } catch {
        return { success: false, error: 'Bağlantı hatası' };
    }
}
```

### 2. Update EndUserSignup Page

**File**: `src/pages/EndUserSignup.tsx`

Change the success handler to redirect to email verification:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
        setError('Şifreler eşleşmiyor');
        return;
    }
    if (formData.password.length < 6) {
        setError('Şifre en az 6 karakter olmalı');
        return;
    }

    setIsLoading(true);
    const result = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
    });

    if (result.success) {
        // Redirect to email verification page
        if (setView) {
            setView({ view: 'email-verification', email: formData.email });
        } else {
            window.location.href = `/email-verification?email=${encodeURIComponent(formData.email)}`;
        }
    } else {
        setError(result.error || 'Kayıt başarısız');
    }
    setIsLoading(false);
};
```

### 3. Update EndUserLogin Page

**File**: `src/pages/EndUserLogin.tsx`

Add state for unverified email and update login handler:
```typescript
const [showResendLink, setShowResendLink] = useState(false);
const [unverifiedEmail, setUnverifiedEmail] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResendLink(false);
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
        goHome();
    } else {
        setError(result.error || 'Giriş başarısız');

        // If email not verified, show resend link
        if (result.email_not_verified) {
            setShowResendLink(true);
            setUnverifiedEmail(result.email || email);
        }
    }
    setIsLoading(false);
};

const handleResendVerification = () => {
    if (setView) {
        setView({ view: 'email-verification', email: unverifiedEmail });
    } else {
        window.location.href = `/email-verification?email=${encodeURIComponent(unverifiedEmail)}`;
    }
};
```

Add resend link after error message:
```tsx
{error && (
    <>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
        </div>
        {showResendLink && (
            <button
                onClick={handleResendVerification}
                className="text-sm text-blue-600 hover:text-blue-700 underline mt-2"
            >
                Doğrulama e-postasını tekrar gönder
            </button>
        )}
    </>
)}
```

### 4. Add Routes to App.tsx

**File**: `src/App.tsx`

Add these imports:
```typescript
import EmailVerification from './pages/EmailVerification';
import VerifyEmail from './pages/VerifyEmail';
```

Add these routes:
```tsx
<Route path="/email-verification" element={<EmailVerification />} />
<Route path="/verify-email" element={<VerifyEmail />} />
```

### 5. Install PHPMailer

Run in your project root:
```bash
cd api
composer require phpmailer/phpmailer
```

### 6. Configure SMTP Environment Variables

Create/update `.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@nipt.tr
SMTP_FROM_NAME=Omega Genetik
APP_URL=https://nipt.tr
```

### 7. Test Authentication Flow

1. **Test Signup**:
   - Go to `/signup`
   - Fill form and submit
   - Should see "Check your email" page
   - Check email for verification link

2. **Test Email Verification**:
   - Click link in email
   - Should see success page
   - Auto-redirect to login

3. **Test Login Before Verification**:
   - Try to login before verifying
   - Should see error with resend link

4. **Test Resend Verification**:
   - Click resend button
   - Should receive new email

---

## NEXT PHASE: IWRS Migration & Podcast Auth

I'll continue with the remaining tasks in the next response. The authentication system foundation is complete!

## Commands to Run

```bash
# Install PHPMailer
cd /Users/berkozdemir/.gemini/antigravity/scratch/turp-saas-website/api
composer require phpmailer/phpmailer

# Create .env file if needed
cd /Users/berkozdemir/.gemini/antigravity/scratch/turp-saas-website
touch .env
```

## Files Created:
- ✅ api/services/email.service.php
- ✅ api/templates/emails/verification.html
- ✅ src/pages/EmailVerification.tsx
- ✅ src/pages/VerifyEmail.tsx

## Files Modified:
- ✅ api/modules/enduser_auth/enduser_auth.service.php
- ✅ api/modules/enduser_auth/enduser_auth.public.controller.php

## Files to Modify (Next Steps):
- ⏳ src/hooks/useEndUserAuth.tsx
- ⏳ src/pages/EndUserSignup.tsx
- ⏳ src/pages/EndUserLogin.tsx
- ⏳ src/App.tsx
