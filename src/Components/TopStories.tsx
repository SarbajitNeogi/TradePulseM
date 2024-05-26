import React, { useEffect, useRef } from 'react';

const TopStories: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const observer = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "feedMode": "all_symbols",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "500",
        "colorTheme": "light",
        "locale": "en"
      });

      container.appendChild(script);
      scriptRef.current = script;

      const cleanupObserver = new MutationObserver(() => {
        if (!container.contains(script)) {
          script.remove();
          observer.current?.disconnect();
        }
      });

      observer.current = cleanupObserver;
      cleanupObserver.observe(container, { childList: true });

      return () => {
        cleanupObserver.disconnect();
      };
    }
  }, []);

  return (
    <div id="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TopStories;