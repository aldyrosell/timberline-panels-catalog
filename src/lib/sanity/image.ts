import type { SanityImage } from "./schema";

export function blurProps(image: SanityImage) {
  return image.lqip
    ? { placeholder: "blur" as const, blurDataURL: image.lqip }
    : {};
}
