import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../content/site';

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
}

export function buildMetadata({ title, description, path, image, noindex }: BuildMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [ogImage],
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
