import Image from "next/image";

/**
 * One photograph, exactly as supplied: original file, original proportions, never cropped.
 * `unoptimized` serves the original file itself rather than a recompressed copy.
 */
export function Photo({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
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
      unoptimized
    />
  );
}
