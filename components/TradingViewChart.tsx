"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

export const TradingViewChart = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTradingView = () => {
      if (container.current) {
        new window.TradingView.widget({
          width: "100%",
          symbol: "MEXC:TETSUOUSDT",
          interval: "30",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: "tradingview_widget",
          hide_volume: true,
        });
      }
    };

    if (window.TradingView) {
      loadTradingView();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = loadTradingView;

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return <div id="tradingview_widget" ref={container} className="w-full" />;
};
