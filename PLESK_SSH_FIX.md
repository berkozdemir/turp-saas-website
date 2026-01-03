# Plesk SSH Connection Refused - Çözüm Rehberi

## Problem
```bash
ssh root@ct.turp.health
# ssh: connect to host ct.turp.health port 22: Connection refused
```

Hetzner firewall ✅ Port 22 açık
Plesk firewall ✅ Port 22 açık
Ama yine de **Connection Refused**

## Olası Sebepler ve Çözümler

### 1. SSH Servisi Çalışmıyor Olabilir

**Plesk Panel'den Kontrol:**
1. Plesk → Tools & Settings → Services Management
2. "SSH" veya "sshd" servisini bul
3. Status: **Running** olmalı
4. Değilse → "Start" butonuna tıkla

**Alternatif: Plesk Console üzerinden:**
```bash
# Plesk web console'dan (Tools & Settings → Server Administration → Web Terminal)
systemctl status sshd
systemctl start sshd
systemctl enable sshd
```

### 2. SSH Portu Değiştirilmiş Olabilir

Plesk bazen SSH'ı farklı porta taşır (güvenlik için).

**Kontrol:**
```bash
# Plesk web terminal'den:
grep "^Port" /etc/ssh/sshd_config
```

Eğer `Port 2222` veya başka bir port görürseniz:
```bash
ssh -p 2222 root@ct.turp.health
```

**Yaygın Plesk SSH Portları:**
- Port 22 (default)
- Port 2222 (Plesk alternatif)
- Port 8022 (bazı Plesk kurulumları)

### 3. fail2ban SSH'ı Engellemiş Olabilir

IP'niz yanlış şifre denemeleri yüzünden banlanmış olabilir.

**Plesk'te Kontrol:**
1. Plesk → Tools & Settings → IP Address Banning (Fail2Ban)
2. Kendi IP'nizi arayın
3. Varsa → "Unban" butonuna tıklayın

**Veya Plesk Console'dan:**
```bash
fail2ban-client status sshd
fail2ban-client set sshd unbanip YOUR_IP_ADDRESS
```

### 4. Firewall Kuralları Çakışıyor Olabilir

**Plesk Firewall Kontrol:**
1. Plesk → Tools & Settings → Firewall
2. Port 22'nin **gerçekten** açık olduğunu doğrulayın
3. Incoming connections: **Allow**

**iptables Manual Kontrol (Plesk Console):**
```bash
iptables -L INPUT -n -v | grep 22
```

Eğer DROP/REJECT görürseniz:
```bash
iptables -I INPUT -p tcp --dport 22 -j ACCEPT
service iptables save  # veya
netfilter-persistent save
```

### 5. Hetzner Cloud Firewall Kontrol

Hetzner Cloud Console'da:
1. Cloud → Firewalls
2. Sunucunuza atanmış firewall'u seçin
3. Inbound Rules:
   - Protocol: **TCP**
   - Port: **22**
   - Source: **0.0.0.0/0** (veya kendi IP'niz)

### 6. SSH Daemon Config Hatası

**Config test et:**
```bash
sshd -t
# Eğer hata varsa gösterir
```

**SSH Config dosyasını kontrol et:**
```bash
cat /etc/ssh/sshd_config | grep -v "^#" | grep -v "^$"
```

Önemli ayarlar:
```
Port 22
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
```

Değişiklik yaptıysanız:
```bash
systemctl restart sshd
```

### 7. SELinux veya AppArmor Engelliyor Olabilir

**SELinux kontrol:**
```bash
getenforce
# Eğer Enforcing ise:
setenforce 0  # Geçici olarak kapat
```

**AppArmor kontrol:**
```bash
aa-status | grep ssh
```

## Hızlı Test Komutları

### Sunucu Erişilebilir mi?
```bash
ping ct.turp.health
```

### Port 22 açık mı?
```bash
telnet ct.turp.health 22
# veya
nc -zv ct.turp.health 22
# veya
nmap -p 22 ct.turp.health
```

Eğer "Connection refused" alıyorsanız → SSH daemon çalışmıyor
Eğer "No route to host" alıyorsanız → Firewall engelliyor
Eğer "Connection timeout" alıyorsanız → Port kapalı veya erişilemiyor

### SSH Daemon Loglarını İncele

**Plesk Console'dan:**
```bash
tail -f /var/log/auth.log
# veya
journalctl -u sshd -f
```

Connection denemesi sırasında ne olduğunu gösterir.

## Alternatif Erişim Yöntemleri

### 1. Plesk Web Terminal (En Kolay)
1. Plesk Panel → Tools & Settings
2. Server Administration → **Web Terminal**
3. Terminal açılır, komut çalıştırabilirsiniz

### 2. Hetzner Cloud Console (KVM Console)
1. Hetzner Cloud Console
2. Sunucuyu seç → **Console** butonuna tıkla
3. Browser'da konsol açılır
4. Root şifresiyle giriş yap

### 3. VNC Connection
Plesk'te VNC aktifse kullanabilirsiniz.

## Çözüm Sonrası Test

SSH çalıştıktan sonra:

```bash
# Bağlantı testi
ssh root@ct.turp.health

# Başarılı olduktan sonra:
cd /var/www/vhosts/ct.turp.health/httpdocs/api
ls -la

# PHPMailer kurulumu için:
composer require phpmailer/phpmailer
```

## Önerilen Kalıcı Çözüm

SSH çalıştıktan sonra güvenlik için:

1. **SSH Key Authentication kullanın:**
```bash
# Kendi bilgisayarınızda:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
ssh-copy-id root@ct.turp.health

# Sunucuda:
nano /etc/ssh/sshd_config
# PasswordAuthentication no
# PubkeyAuthentication yes
systemctl restart sshd
```

2. **fail2ban aktif tutun** (yanlış denemelerden korur)

3. **SSH portunu değiştirin** (isteğe bağlı, güvenlik artışı):
```bash
# /etc/ssh/sshd_config
Port 2222
```

---

## Hızlı Çözüm: Plesk Web Terminal Kullan

SSH'a ihtiyaç duymadan şu adımları takip edin:

1. **Plesk → Tools & Settings → Web Terminal**
2. Terminal açılır
3. Artık SSH gibi komut çalıştırabilirsiniz!

```bash
cd /var/www/vhosts/ct.turp.health/httpdocs/api
pwd
ls -la
```

Bu şekilde PHPMailer kurulumunu ve database migration'ı yapabilirsiniz!
