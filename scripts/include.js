async function includeFragment(el, url){
  const resp = await fetch(url, {cache:'no-store'});
  if (!resp.ok) throw new Error(`${url} ${resp.status}`);
  el.outerHTML = await resp.text();
}

async function includeHeaderFooter() {
  const headerPh = document.querySelector('[data-include="header"]');
  const footerPh = document.querySelector('[data-include="footer"]');
  const tasks = [];
  if (headerPh) tasks.push(includeFragment(headerPh, (window.SitePaths?.header || '/partials/header.html')));
  if (footerPh) tasks.push(includeFragment(footerPh, (window.SitePaths?.footer || '/partials/footer.html')));
  await Promise.all(tasks);
}

window._includesReady = includeHeaderFooter(); // promise others can await
