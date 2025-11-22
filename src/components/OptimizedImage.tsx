import React from 'react';

export const OptimizedImage = ({ src, alt, width, height, className }) => {
  if (!src) return null;
  let optimizedSrc = src;
  if (src.includes('supabase.co') && src.includes('/storage/v1/object/public')) {
    optimizedSrc = src.replace('/storage/v1/object/public', '/storage/v1/render/image/public');
    const params = [];
    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);
    params.push('quality=80'); params.push('resize=contain');
    optimizedSrc += `?${params.join('&')}`;
  }
  return (<img src={optimizedSrc} alt={alt} className={className} loading="lazy" />);
};
