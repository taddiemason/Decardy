/**
 * Cloudflare Worker for Decardy Website
 * Serves static assets with optimized caching and security headers
 */

// Cache configuration for different asset types
const CACHE_CONFIG = {
  html: {
    browserTTL: 60 * 60, // 1 hour
    edgeTTL: 60 * 60 * 24, // 1 day
  },
  assets: {
    browserTTL: 60 * 60 * 24, // 1 day
    edgeTTL: 60 * 60 * 24 * 7, // 1 week
  },
  images: {
    browserTTL: 60 * 60 * 24 * 7, // 1 week
    edgeTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
};

/**
 * Get cache configuration based on file type
 */
function getCacheConfig(pathname) {
  if (pathname.endsWith('.html') || pathname === '/') {
    return CACHE_CONFIG.html;
  } else if (pathname.match(/\.(css|js)$/)) {
    return CACHE_CONFIG.assets;
  } else if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    return CACHE_CONFIG.images;
  }
  return CACHE_CONFIG.assets;
}

/**
 * Add cache and security headers to a response
 */
function addHeaders(response, pathname) {
  const cacheConfig = getCacheConfig(pathname);
  const headers = new Headers(response.headers);

  // Set cache headers
  headers.set(
    'Cache-Control',
    `public, max-age=${cacheConfig.browserTTL}, s-maxage=${cacheConfig.edgeTTL}`
  );

  // Add security headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  // Add CSP for HTML files
  if (pathname.endsWith('.html') || pathname === '/') {
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';"
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      // Serve static assets via the ASSETS binding
      const response = await env.ASSETS.fetch(request);

      // If asset not found, serve index.html for SPA routing
      if (response.status === 404) {
        const indexRequest = new Request(new URL('/index.html', url.origin));
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        return addHeaders(indexResponse, '/index.html');
      }

      return addHeaders(response, pathname);
    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  },
};
