'use client';

import { useEffect } from 'react';

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = title;
      if (description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', description);
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [title, description]);
}
