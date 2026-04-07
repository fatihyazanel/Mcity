import Image from "next/image";

interface OptImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=75&auto=format";

function buildSrc(src: string): string {
  if (!src || src.trim() === "") return FALLBACK_IMAGE;
  if (src.includes("unsplash.com") && !src.includes("w=")) {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=600&q=75&auto=format`;
  }
  return src;
}

export default function OptImage({
  src,
  alt,
  fill = true,
  width,
  height,
  priority = false,
  className,
  style,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptImageProps) {
  const optimizedSrc = buildSrc(src);

  if (fill) {
    return (
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        priority={priority}
        className={className}
        style={{ objectFit: "cover", ...style }}
        sizes={sizes}
        unoptimized={optimizedSrc.startsWith("http")}
        onError={undefined}
      />
    );
  }

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      priority={priority}
      className={className}
      style={{ objectFit: "cover", ...style }}
      sizes={sizes}
      unoptimized={optimizedSrc.startsWith("http")}
    />
  );
}
