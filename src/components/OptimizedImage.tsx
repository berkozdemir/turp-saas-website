import type { FC } from "react";

type OptimizedImageProps = {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
};

export const OptimizedImage: FC<OptimizedImageProps> = ({
  src,
  alt = "",
  width,
  height,
  className,
}) => {
  if (!src) return null;

  let optimizedSrc = src;

  // Supabase public bucket için image optimize edici endpoint'e çevir
  if (
    src.includes("supabase.co") &&
    src.includes("/storage/v1/object/public")
  ) {
    optimizedSrc = src.replace(
      "/storage/v1/object/public",
      "/storage/v1/render/image/public"
    );

    const params: string[] = [];

    if (width) params.push(`width=${width}`);
    if (height) params.push(`height=${height}`);

    params.push("quality=80");
    params.push("resize=contain");

    optimizedSrc += `?${params.join("&")}`;
  }

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
    />
  );
};
