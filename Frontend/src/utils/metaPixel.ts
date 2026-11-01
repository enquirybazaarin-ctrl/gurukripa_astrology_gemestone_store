/**
 * Meta Pixel (Facebook Pixel) Tracking Utilities
 * Pixel ID: 1409258038010051
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

/**
 * Track a standard Meta Pixel event (e.g., 'PageView', 'Lead', 'Purchase', 'AddToCart', 'Contact')
 */
export const trackPixelEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (parameters) {
      window.fbq('track', eventName, parameters);
    } else {
      window.fbq('track', eventName);
    }
  }
};

/**
 * Track a custom Meta Pixel event
 */
export const trackPixelCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (parameters) {
      window.fbq('trackCustom', eventName, parameters);
    } else {
      window.fbq('trackCustom', eventName);
    }
  }
};
