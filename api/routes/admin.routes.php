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

/**
 * Route admin actions to controllers
 * 
 * @param string $action Action name from ?action=
 * @return bool True if action was handled
 */
function route_admin_action(string $action): bool
{
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

    // TODO: Add other modules as they are fully refactored:
    // if (handle_landing_admin($action)) return true;
    // if (handle_contact_admin($action)) return true;
    // if (handle_legal_admin($action)) return true;
    // if (handle_media_admin($action)) return true;

    return false;
}
