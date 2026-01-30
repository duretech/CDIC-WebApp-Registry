const fs = require('fs');
const path = require('path');

const INDEX_HTML_PATH = path.resolve(__dirname, '../build/index.html'); // ✅ target final built file
const CONFIG_PATH = path.resolve(__dirname, '../public/runtime-config.json'); // config stays in public

function stripTrailingSlash(url) {
  return url.replace(/\/$/, '');
}

// Only use baseUrl
function getConfigUrls(config) {
  let urls = [];
  if (config.baseUrl) {
    const cleanUrl = stripTrailingSlash(config.baseUrl);
    urls.push(cleanUrl);
  } else {
    console.warn('[WARN] No baseUrl found in runtime-config.json');
  }
  return Array.from(new Set(urls)); // unique
}

function updateConnectSrc(cspContent, newUrls) {
  const CONNECT_SRC_RE = /connect-src\s+([\s\S]*?)(;|$)/m; // ✅ match multi-line
  if (!CONNECT_SRC_RE.test(cspContent)) {
    console.error('[ERROR] connect-src directive not found in CSP.');
    return cspContent;
  }

  return cspContent.replace(CONNECT_SRC_RE, (match, connectSrc) => {
    let sources = connectSrc.split(/\s+/).filter(Boolean);

    newUrls.forEach(url => {
      if (!sources.includes(url)) {
        sources.push(url);
      } else {
      }
    });

    return `connect-src ${sources.join(' ')};`;
  });
}

function main() {
  if (!fs.existsSync(INDEX_HTML_PATH)) {
    console.error(`[ERROR] index.html file not found at ${INDEX_HTML_PATH}. Make sure you run "npm run build" first.`);
    return;
  }

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`[ERROR] Config file not found: ${CONFIG_PATH}`);
    return;
  }

  const html = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const newUrls = getConfigUrls(config);

  const META_TAG_RE = /(<meta http-equiv="Content-Security-Policy"\s+content=")([\s\S]*?)(">)/m;
  const metaMatch = html.match(META_TAG_RE);

  if (!metaMatch) {
    console.error('[ERROR] CSP meta tag not found in index.html');
    return;
  }

  const newCspContent = updateConnectSrc(metaMatch[2], newUrls);

  const updatedHtml = html.replace(META_TAG_RE, `$1${newCspContent}$3`);

  if (updatedHtml !== html) {
    fs.writeFileSync(INDEX_HTML_PATH + '.bak', html, 'utf-8'); // backup
    fs.writeFileSync(INDEX_HTML_PATH, updatedHtml, 'utf-8');
  } else {
    console.warn('[WARN] No changes made — possibly already up to date or regex missed.');
  }
}

main();
