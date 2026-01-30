const fs = require("fs");
const path = require("path");

const envConfigPath = path.resolve(__dirname, "../public/runtime-config.json");
const outputHtaccessPath = path.resolve(__dirname, "../build/.htaccess");

// Default fallback
let basename = "cdicv6";

try {
  if (fs.existsSync(envConfigPath)) {
    const envContent = fs.readFileSync(envConfigPath, "utf-8");
    const parsed = JSON.parse(envContent);
    if (parsed.basename) {
      basename = parsed.basename;
    }
  }
} catch (err) {
  console.error("Failed to read env.runtime.json. Using fallback basename.", err);
}

const htaccessContent = 
`<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /${basename}/
 
  # Redirect /cdicv9/layout/... → /cdicv9/...
  RewriteCond %{REQUEST_URI} ^/${basename}/layout/(.*)$
  RewriteRule ^layout/(.*)$ /${basename}/$1 [R=302,L]
 
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>`;
fs.writeFileSync(outputHtaccessPath, htaccessContent);
console.log(`.htaccess generated with RewriteBase /${basename}/`);
