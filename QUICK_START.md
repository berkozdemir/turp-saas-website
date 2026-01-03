# 🚀 Quick Start - Email Verification Deployment

## TL;DR - 3 Steps to Production

### 1️⃣ Install PHPMailer (Required)

**Via SSH on your Plesk server:**
```bash
cd /var/www/vhosts/ct.turp.health/httpdocs/api
composer require phpmailer/phpmailer
```

**Or see [PLESK_SSH_FIX.md](PLESK_SSH_FIX.md) if SSH is not working.**

---

### 2️⃣ Configure SMTP (Choose One Method)

#### Option A: Gmail App Password (Quickest)

1. **Get Gmail App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Enable 2-Step Verification if not already
   - Create new app password for "Mail"
   - Copy the 16-digit password

2. **Add to Plesk**:
   - Plesk → Domains → ct.turp.health → PHP Settings
   - Scroll to "Additional configuration directives"
   - Add these lines:

```ini
env[SMTP_HOST] = "smtp.gmail.com"
env[SMTP_PORT] = "587"
env[SMTP_USER] = "noreply@nipt.tr"
env[SMTP_PASS] = "abcd efgh ijkl mnop"
env[SMTP_FROM_EMAIL] = "noreply@nipt.tr"
env[SMTP_FROM_NAME] = "Omega Genetik"
env[APP_URL] = "https://nipt.tr"
```

   - Click "Apply"

#### Option B: Config File (More Secure)

1. **Via Plesk File Manager**:
   - Navigate to: `/var/www/vhosts/ct.turp.health/httpdocs/api/config/`
   - Create new file: `email.config.php`
   - Paste this content:

```php
<?php
return [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_user' => 'noreply@nipt.tr',
    'smtp_pass' => 'your-gmail-app-password-here',
    'from_email' => 'noreply@nipt.tr',
    'from_name' => 'Omega Genetik',
    'app_url' => 'https://nipt.tr',
];
```

2. **Protect the file**:
   - Add to `.gitignore`: `api/config/email.config.php`

---

### 3️⃣ Test Everything

#### Test 1: Signup Flow
1. Go to: https://nipt.tr/signup
2. Fill the form and submit
3. You should see: "E-postanızı kontrol edin" page
4. Check your email inbox (and spam folder)
5. Email should arrive within 1 minute

#### Test 2: Email Verification
1. Open the verification email
2. Click "E-postamı Doğrula" button
3. You should see success page
4. Auto-redirect to login after 3 seconds

#### Test 3: Login After Verification
1. Go to: https://nipt.tr/login
2. Enter your email and password
3. Login should succeed
4. You should be redirected to the app

#### Test 4: Login Before Verification
1. Register another account
2. Don't verify the email
3. Try to login
4. Should see error: "E-posta doğrulanmamış"
5. "Doğrulama e-postasını tekrar gönder" link should appear

---

## ⚡ Troubleshooting

### Issue: "Class 'PHPMailer' not found"
**Fix**: Install PHPMailer (Step 1)

### Issue: "SMTP authentication failed"
**Fix**:
- Make sure you're using Gmail App Password, not your regular password
- Verify 2-Step Verification is enabled in your Google Account

### Issue: "Could not connect to SMTP host"
**Fix**:
- Check that port 587 is open in firewall
- Try using port 465 instead (change `SMTP_PORT`)

### Issue: Email not arriving
**Fix**:
1. Check spam folder
2. Check SMTP credentials are correct
3. Enable debug mode (see below)
4. Check server logs

### Issue: Verification link says "Token expired"
**Fix**: Token is valid for 24 hours. Click "Yeni doğrulama e-postası gönder" to get a new one.

---

## 🔍 Debug Mode

If emails are not sending, enable debug mode:

1. **Edit**: `/var/www/vhosts/ct.turp.health/httpdocs/api/services/email.service.php`

2. **Find** line ~43: `$mail = new PHPMailer(true);`

3. **Add below it**:
```php
$mail->SMTPDebug = 2;  // Enable verbose debug output
$mail->Debugoutput = function($str, $level) {
    error_log("SMTP Debug: $str");
};
```

4. **Check logs**:
   - Plesk → Domains → Logs → Error Log
   - Or via SSH: `tail -f /var/log/php-fpm/error.log`

5. **Try signup again** and check the logs for SMTP details

---

## 📧 Using a Different Email Provider?

### SendGrid (Recommended for Production)
- Free: 100 emails/day
- Signup: https://sendgrid.com/

**Config**:
```ini
env[SMTP_HOST] = "smtp.sendgrid.net"
env[SMTP_PORT] = "587"
env[SMTP_USER] = "apikey"
env[SMTP_PASS] = "your-sendgrid-api-key"
```

### Mailgun
- Free: 5000 emails/month
- Signup: https://mailgun.com/

**Config**:
```ini
env[SMTP_HOST] = "smtp.mailgun.org"
env[SMTP_PORT] = "587"
env[SMTP_USER] = "postmaster@your-domain.mailgun.org"
env[SMTP_PASS] = "your-mailgun-password"
```

---

## ✅ Verification Checklist

- [ ] PHPMailer installed (`composer require phpmailer/phpmailer`)
- [ ] SMTP credentials configured (via Plesk or config file)
- [ ] Gmail App Password created (if using Gmail)
- [ ] Test email sent successfully
- [ ] Verification link works
- [ ] Login blocked for unverified users
- [ ] Resend verification works
- [ ] Frontend deployed (`npm run build` if needed)

---

## 📚 Full Documentation

For detailed information, see:

- **[EMAIL_VERIFICATION_COMPLETE.md](EMAIL_VERIFICATION_COMPLETE.md)** - Complete implementation guide
- **[AUTH_SYSTEM_README.md](AUTH_SYSTEM_README.md)** - Authentication system overview
- **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** - Step-by-step setup
- **[PLESK_SSH_FIX.md](PLESK_SSH_FIX.md)** - SSH connection troubleshooting

---

## 🎯 What's Next?

After email verification is working:

1. **Test on IWRS** - The same system works for both nipt.tr and IWRS
2. **Podcast 30-Second Preview** - Add registration gate for podcasts
3. **Production Monitoring** - Track email delivery rates

---

**Need Help?** Check the troubleshooting section above or refer to the full documentation.

**Status**: ✅ System ready - Just needs SMTP configuration!
