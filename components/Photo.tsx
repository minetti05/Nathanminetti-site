import Image from "next/image";

/**
 * One photograph at its original proportions, never cropped, recolored or rotated.
 * The original file stays untouched in /public. Visitors get a copy resized to the
 * size it is shown at, at quality 90 (visually identical), so pages load fast on phones.
 */
export function Photo({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
  style,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      quality={90}
      style={style}
    />
  );
}
