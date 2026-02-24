import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * Cloudflare Worker for Decardy Website
 * Serves static assets with optimized caching and performance
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
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
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
 * Get content type based on file extension
 */
function getContentType(pathname) {
  const ext = pathname.split('.').pop().toLowerCase();
  const contentTypes = {
    html: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'application/javascript; charset=utf-8',
    json: 'application/json; charset=utf-8',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Main fetch handler
 */
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

// Map old site paths → section anchors (for Google sitelinks / legacy URLs)
const PATH_REDIRECTS = {
  '/contact':            '/#contact',
  '/contact-us':         '/#contact',
  '/quality':            '/#quality',
  '/quality-assurance':  '/#quality',
  '/services':           '/#services',
  '/secondary-services': '/#services',
  '/our-services':       '/#services',
  '/about':              '/#about',
  '/about-us':           '/#about',
  '/gallery':            '/#gallery',
  '/our-work':           '/#gallery',
  '/portfolio':          '/#gallery',
  '/why-zinc':           '/#why-zinc',
  '/zinc':               '/#why-zinc',
  '/zinc-die-casting':   '/#why-zinc',
  '/spotlight':          '/#examples',
  '/projects':           '/#examples',
};

async function handleRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  let pathname = url.pathname;

  // 301-redirect old paths to the correct section anchor
  const cleanPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  if (PATH_REDIRECTS[cleanPath]) {
    return Response.redirect(url.origin + PATH_REDIRECTS[cleanPath], 301);
  }

  // Serve index.html for root path
  if (pathname === '/') {
    pathname = '/index.html';
  }

  try {
    // Try to serve from Workers KV (if using Wrangler's site functionality)
    if (typeof getAssetFromKV !== 'undefined') {
      const options = {
        cacheControl: {
          browserTTL: 0, // We'll set our own cache headers
          edgeTTL: 0,
        },
      };

      try {
        const page = await getAssetFromKV(event, options);
        const response = new Response(page.body, page);

        // Add custom headers
        addHeaders(response, pathname);

        return response;
      } catch (e) {
        // If asset not found in KV, continue to file serving
      }
    }

    // Fallback: Serve files directly from GitHub or your origin
    const assetUrl = `https://raw.githubusercontent.com/taddiemason/Decardy/main${pathname}`;
    const response = await fetch(assetUrl, {
      cf: {
        cacheTtl: getCacheConfig(pathname).edgeTTL,
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      // If file not found, serve index.html (for SPA routing)
      if (response.status === 404) {
        const indexUrl = 'https://raw.githubusercontent.com/taddiemason/Decardy/main/index.html';
        const indexResponse = await fetch(indexUrl);
        const modifiedResponse = new Response(indexResponse.body, {
          status: 200,
          headers: indexResponse.headers,
        });
        addHeaders(modifiedResponse, '/index.html');
        return modifiedResponse;
      }
      return response;
    }

    // Create new response with custom headers
    const modifiedResponse = new Response(response.body, response);
    addHeaders(modifiedResponse, pathname);

    return modifiedResponse;
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * Add cache and security headers to response
 */
function addHeaders(response, pathname) {
  const cacheConfig = getCacheConfig(pathname);
  const contentType = getContentType(pathname);

  // Set content type
  response.headers.set('Content-Type', contentType);

  // Set cache headers
  response.headers.set(
    'Cache-Control',
    `public, max-age=${cacheConfig.browserTTL}, s-maxage=${cacheConfig.edgeTTL}`
  );

  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add CSP for HTML files
  if (pathname.endsWith('.html') || pathname === '/') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';"
    );
  }

  // Add CORS headers (optional, adjust as needed)
  response.headers.set('Access-Control-Allow-Origin', '*');
}
