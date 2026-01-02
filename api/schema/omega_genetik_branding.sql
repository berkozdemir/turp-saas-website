-- Omega Genetik Branding Configuration for Nipt.tr Tenant
-- Run this SQL after identifying the tenant_id for nipt.tr

-- First, find the tenant_id for nipt.tr:
-- SELECT id FROM tenants WHERE code = 'nipt' OR domain LIKE '%nipt%';

-- Then insert branding config (replace TENANT_ID with actual value):
-- If tenant_id is 2 for nipt.tr:

INSERT INTO branding_configs (
  tenant_id,
  logo_light_url,
  logo_dark_url,
  favicon_url,
  primary_color,
  secondary_color,
  accent_color,
  background_color,
  text_color_primary,
  text_color_muted,
  font_family_base,
  font_family_heading,
  border_radius,
  instagram_url,
  facebook_url,
  linkedin_url,
  x_twitter_url
) VALUES (
  -- Replace with actual nipt tenant_id
  (SELECT id FROM tenants WHERE code = 'nipt' LIMIT 1),
  
  -- Logo URLs (update with actual uploaded logo paths)
  '/media/omega-genetik-logo.png',
  '/media/omega-genetik-logo-white.png',
  '/media/omega-favicon.png',
  
  -- Colors (Omega Genetik palette)
  '#1a365d',   -- primary: dark navy blue (from logo text)
  '#2d4a6f',   -- secondary: softer blue for backgrounds
  '#dc2626',   -- accent: red from chevron in logo (CTAs, highlights)
  '#f7f8fa',   -- background: very light gray / off-white
  '#0f172a',   -- text_primary: near-black
  '#64748b',   -- text_muted: medium gray
  
  -- Typography
  'Inter',     -- font_family_base: clean, modern sans-serif
  'Inter',     -- font_family_heading: same for consistency
  '0.5rem',    -- border_radius: 8px for modern friendly look
  
  -- Social Links
  'https://www.instagram.com/omegagenetik/',
  NULL,        -- facebook_url: add if available
  'https://www.linkedin.com/company/omega-biyoteknoloji/',
  NULL         -- x_twitter_url: add if available
)
ON DUPLICATE KEY UPDATE
  logo_light_url = VALUES(logo_light_url),
  logo_dark_url = VALUES(logo_dark_url),
  favicon_url = VALUES(favicon_url),
  primary_color = VALUES(primary_color),
  secondary_color = VALUES(secondary_color),
  accent_color = VALUES(accent_color),
  background_color = VALUES(background_color),
  text_color_primary = VALUES(text_color_primary),
  text_color_muted = VALUES(text_color_muted),
  font_family_base = VALUES(font_family_base),
  font_family_heading = VALUES(font_family_heading),
  border_radius = VALUES(border_radius),
  instagram_url = VALUES(instagram_url),
  linkedin_url = VALUES(linkedin_url);

-- Verify the insert:
-- SELECT * FROM branding_configs WHERE tenant_id = (SELECT id FROM tenants WHERE code = 'nipt');
