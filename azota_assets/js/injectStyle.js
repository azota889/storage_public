// Add file template style
let tplStyle = document.createElement("link");
tplStyle.setAttribute("href", "https://cdn.jsdelivr.net/gh/azota889/storage_public/azota_assets/templates/templateExample/style.css?v=" + Date.now());
tplStyle.setAttribute("id", 'tpl-style');
tplStyle.setAttribute("rel", "stylesheet");
tplStyle.setAttribute("type", "text/css");
document.head.appendChild(tplStyle);