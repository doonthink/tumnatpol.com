import { useEffect } from 'react';

export function useScriptInjector(headerScript?: string, footerScript?: string) {
  useEffect(() => {
    if (!headerScript && !footerScript) return;

    const createScriptElements = (htmlString: string, target: HTMLElement) => {
      if (!htmlString) return [];
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      
      const elements: Element[] = [];
      const scripts = doc.querySelectorAll('script');
      
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        if (script.innerHTML) {
          newScript.innerHTML = script.innerHTML;
        }
        
        target.appendChild(newScript);
        elements.push(newScript);
      });

      // Handle other non-script tags if user pastes styles or meta tags
      const styles = doc.querySelectorAll('style, link, meta, noscript');
      styles.forEach(el => {
        target.appendChild(el);
        elements.push(el);
      });
      
      return elements;
    };

    const headerElements = headerScript ? createScriptElements(headerScript, document.head) : [];
    const footerElements = footerScript ? createScriptElements(footerScript, document.body) : [];

    return () => {
      headerElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      footerElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [headerScript, footerScript]);
}
