import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GA_MEASUREMENT_ID } from '../config/analytics';

let isInitialized = false;

/**
 * Initializes Google Analytics 4 dynamically
 */
export function initGA() {
  if (typeof window === 'undefined') return;

  const measurementId = GA_MEASUREMENT_ID;

  // Don't initialize if placeholder or empty
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    if (import.meta.env.DEV) {
      console.info(
        '[Analytics] Set your Google Analytics Measurement ID in src/config/analytics.js or VITE_GA_MEASUREMENT_ID to start recording footfall.'
      );
    }
    return;
  }

  if (isInitialized || typeof window.gtag === 'function') {
    isInitialized = true;
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false, // Page views handled via React Router for accurate SPA tracking
  });

  isInitialized = true;
}

/**
 * Sends page view to Google Analytics
 */
export function trackPageView(pagePath, pageTitle) {
  if (typeof window === 'undefined' || !window.gtag) return;
  const measurementId = GA_MEASUREMENT_ID;
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    send_to: measurementId,
  });
}

/**
 * Sends custom events (e.g. quiz completed, score achieved)
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
}

/**
 * React Component to place inside HashRouter to automatically record footfalls & route changes
 */
export function AnalyticsTracker() {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    const fullPath = location.pathname + location.search + location.hash;
    if (fullPath !== lastPath.current) {
      lastPath.current = fullPath;
      trackPageView(fullPath, document.title);
    }
  }, [location]);

  return null;
}
