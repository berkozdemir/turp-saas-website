<?php
/**
 * Public Routes
 * 
 * Centralizes all public API route handling.
 * Each module registers its public actions here.
 */

// Load module controllers
require_once __DIR__ . '/../modules/blog/blog.public.controller.php';
require_once __DIR__ . '/../modules/faq/faq.public.controller.php';
require_once __DIR__ . '/../modules/nipt/doctors.controller.php';
require_once __DIR__ . '/../modules/contact/contact.public.controller.php';
require_once __DIR__ . '/../modules/auth/auth.public.controller.php';
require_once __DIR__ . '/../modules/landing/landing.public.controller.php';
require_once __DIR__ . '/../modules/consent/consent.public.controller.php';
require_once __DIR__ . '/../modules/roi/roi.public.controller.php';
require_once __DIR__ . '/../modules/legal/legal.public.controller.php';
require_once __DIR__ . '/../modules/enduser_auth/enduser_auth.public.controller.php';
require_once __DIR__ . '/../modules/branding/branding.public.controller.php';

/**
 * Route public actions to controllers
 * 
 * @param string $action Action name from ?action=
 * @return bool True if action was handled
 */
function route_public_action(string $action): bool
{
    // Blog module
    if (handle_blog_public($action)) {
        return true;
    }

    // FAQ module
    if (handle_faq_public($action)) {
        return true;
    }

    // Landing module (public config)
    if (handle_landing_public($action)) {
        return true;
    }

    if (handle_doctors_public($action))
        return true;
    if (handle_contact_public($action))
        return true;
    if (handle_roi_public($action))
        return true;
    if (handle_legal_public($action))
        return true;
    if (handle_auth_public($action))
        return true;
    if (handle_consent_public($action))
        return true;
    if (handle_enduser_auth_public($action))
        return true;
    if (handle_branding_public($action))
        return true;

    return false;
}
