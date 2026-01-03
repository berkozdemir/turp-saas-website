import { BlogPost } from "./content";

export type ViewType =
    | "home"
    | "about"
    | "blog"
    | "roi"
    | "contact"
    | "case-rheuma"
    | "case-education"
    | "sss"
    | "admin"
    | "enduser-login"
    | "enduser-signup"
    | "email-verification"
    | "verify-email"
    | "podcast-hub"
    | "detail"
    | "module"
    | "reset-password"
    | "legal"
    | "podcast-detail";

export type BaseView = string; // For simple string views like "home", "about"

export interface ComplexView {
    type: ViewType;
    [key: string]: any; // Allow additional props for now, refine later
}

// Specific complex views
export interface HomeView {
    type: "home";
    scrollTo?: string;
}

export interface ModuleView {
    type: "module";
    id: string;
}

export interface PostDetailView {
    type: "detail";
    post: BlogPost;
}

export interface ResetPasswordView {
    type: "reset-password";
    token: string;
}

export interface LegalView {
    type: "legal";
    key: string;
}

export interface PodcastDetailView {
    type: "podcast-detail";
    slug?: string;
}

export type AppView =
    | BaseView
    | HomeView
    | ModuleView
    | PostDetailView
    | ResetPasswordView
    | LegalView
    | PodcastDetailView
    | ComplexView;
