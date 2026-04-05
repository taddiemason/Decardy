/**
 * Cloudflare Worker for Decardy Website (Module Worker syntax)
 * Serves static assets from the Wrangler ASSETS binding with cache/security headers.
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
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
};

// Map old site paths → section anchors (for Google sitelinks / legacy URLs)
const PATH_REDIRECTS = {
  '/contact': '/#contact',
  '/contact-us': '/#contact',
  '/quality': '/#quality',
  '/quality-assurance': '/#quality',
  '/services': '/#services',
  '/secondary-services': '/#services',
  '/our-services': '/#services',
  '/about': '/#about',
  '/about-us': '/#about',
  '/gallery': '/#gallery',
  '/our-work': '/#gallery',
  '/portfolio': '/#gallery',
  '/why-zinc': '/#why-zinc',
  '/zinc': '/#why-zinc',
  '/zinc-die-casting': '/#why-zinc',
  '/spotlight': '/#examples',
  '/projects': '/#examples',
};

function getCacheConfig(pathname) {
  if (pathname.endsWith('.html') || pathname === '/') {
    return CACHE_CONFIG.html;
  }

  if (pathname.match(/\.(css|js)$/)) {
    return CACHE_CONFIG.assets;
  }

  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    return CACHE_CONFIG.images;
  }

  return CACHE_CONFIG.assets;
}

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
    pdf: 'application/pdf',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    eot: 'application/vnd.ms-fontobject',
  };

  return contentTypes[ext] || 'application/octet-stream';
}

function addHeaders(response, pathname) {
  const cacheConfig = getCacheConfig(pathname);
  const contentType = getContentType(pathname);

  response.headers.set('Content-Type', contentType);
  if (pathname.toLowerCase().endsWith('.pdf')) {
    response.headers.set('Content-Disposition', 'inline');
  }
  response.headers.set(
    'Cache-Control',
    `public, max-age=${cacheConfig.browserTTL}, s-maxage=${cacheConfig.edgeTTL}`
  );

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  if (pathname.endsWith('.html') || pathname === '/') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self';"
    );
  }

  response.headers.set('Access-Control-Allow-Origin', '*');
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const cleanPath = url.pathname.toLowerCase().replace(/\/$/, '') || '/';

  // 301-redirect old paths to the correct section anchor
  if (PATH_REDIRECTS[cleanPath]) {
    return Response.redirect(url.origin + PATH_REDIRECTS[cleanPath], 301);
  }

  const assetResponse = await env.ASSETS.fetch(request);

  // Explicit SPA fallback in case runtime path handling differs.
  if (assetResponse.status === 404) {
    const indexUrl = new URL('/index.html', url);
    const indexResponse = await env.ASSETS.fetch(new Request(indexUrl, request));
    if (indexResponse.ok) {
      const response = new Response(indexResponse.body, indexResponse);
      addHeaders(response, '/index.html');
      return response;
    }
    return assetResponse;
  }

  const response = new Response(assetResponse.body, assetResponse);
  addHeaders(response, url.pathname === '/' ? '/index.html' : url.pathname);
  return response;
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  },
};
