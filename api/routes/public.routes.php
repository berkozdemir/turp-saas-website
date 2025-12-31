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

    if (handle_doctors_public($action))
        return true;
    if (handle_contact_public($action))
        return true;
    if (handle_roi_public($action))
        return true;
    if (handle_landing_public($action))
        return true;
    if (handle_contact_public($action))
        return true;
    if (handle_legal_public($action))
        return true;

    return false;
}
