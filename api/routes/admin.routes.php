<?php
/**
 * Admin Routes
 * 
 * Centralizes all admin API route handling.
 * Each module registers its admin actions here.
 */

// Load module controllers
require_once __DIR__ . '/../modules/blog/blog.admin.controller.php';
require_once __DIR__ . '/../modules/faq/faq.admin.controller.php';
require_once __DIR__ . '/../modules/nipt/doctors.admin.controller.php';
require_once __DIR__ . '/../modules/user/user.admin.controller.php';
require_once __DIR__ . '/../modules/settings/settings.admin.controller.php';
require_once __DIR__ . '/../modules/media/media.admin.controller.php';
require_once __DIR__ . '/../modules/enduser_auth/enduser_auth.admin.controller.php';

/**
 * Route admin actions to controllers
 * 
 * @param string $action Action name from ?action=
 * @return bool True if action was handled
 */
function route_admin_action(string $action): bool
{
    // User Management
    if (handle_user_admin($action))
        return true;

    // Settings
    if (handle_settings_admin($action))
        return true;

    // Blog module
    if (handle_blog_admin($action)) {
        return true;
    }

    // FAQ module
    if (handle_faq_admin($action)) {
        return true;
    }

    // Doctors module
    if (handle_doctors_admin($action)) {
        return true;
    }

    // Landing module
    if (handle_landing_admin($action)) {
        return true;
    }

    // Contact module
    if (handle_contact_admin($action)) {
        return true;
    }

    // Contact Config module
    if (handle_contact_config_admin($action)) {
        return true;
    }

    // Legal module
    if (handle_legal_admin($action)) {
        return true;
    }

    // Media module
    if (handle_media_admin($action)) {
        return true;
    }

    // End-User Auth module
    if (handle_enduser_auth_admin($action)) {
        return true;
    }

    return false;
}
