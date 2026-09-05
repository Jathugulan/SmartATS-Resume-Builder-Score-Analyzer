import { useEffect } from 'react';

/**
 * Site-level defaults for SEO metadata.
 * Individual public pages override with their own title/description.
 */
export const SITE_META = {
  title: 'ATS Smart Resume Builder & Score Analyzer',
  description:
    'Create ATS-friendly resumes, analyze your resume score, match job descriptions, and optimize every section with intelligent resume tools.',
  siteName: 'SmartATS',
  type: 'website',
};

function ensureMeta(attr, key) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  return el;
}

/**
 * Manages the document title, meta description, Open Graph and Twitter
 * card metadata for each public page.
 */
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const metaTitle = title || SITE_META.title;
    const metaDescription = description || SITE_META.description;
    const url = window.location.href;

    document.title = metaTitle;
    ensureMeta('name', 'description').setAttribute('content', metaDescription);
    ensureMeta('property', 'og:title').setAttribute('content', metaTitle);
    ensureMeta('property', 'og:description').setAttribute('content', metaDescription);
    ensureMeta('property', 'og:type').setAttribute('content', SITE_META.type);
    ensureMeta('property', 'og:site_name').setAttribute('content', SITE_META.siteName);
    ensureMeta('property', 'og:url').setAttribute('content', url);
    ensureMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
    ensureMeta('name', 'twitter:title').setAttribute('content', metaTitle);
    ensureMeta('name', 'twitter:description').setAttribute('content', metaDescription);
  }, [title, description]);
}