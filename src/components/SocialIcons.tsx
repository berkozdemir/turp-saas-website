import { Instagram, Facebook, Linkedin, Twitter, Youtube, MessageCircle } from 'lucide-react';
import { useBranding } from '../hooks/useBrandingConfig';

interface SocialIconsProps {
    className?: string;
    iconSize?: number;
    iconClassName?: string;
}

export const SocialIcons = ({
    className = '',
    iconSize = 20,
    iconClassName = 'text-white/80 hover:text-white transition-colors'
}: SocialIconsProps) => {
    const { branding } = useBranding();
    const { social } = branding;

    if (!social || Object.keys(social).length === 0) {
        return null;
    }

    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram size={iconSize} className={iconClassName} />
                </a>
            )}
            {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook size={iconSize} className={iconClassName} />
                </a>
            )}
            {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={iconSize} className={iconClassName} />
                </a>
            )}
            {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" aria-label="X/Twitter">
                    <Twitter size={iconSize} className={iconClassName} />
                </a>
            )}
            {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube size={iconSize} className={iconClassName} />
                </a>
            )}
            {social.whatsapp && (
                <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <MessageCircle size={iconSize} className={iconClassName} />
                </a>
            )}
        </div>
    );
};

export default SocialIcons;
