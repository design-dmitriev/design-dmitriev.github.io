(() => {
  const root = document.documentElement;
  const control = document.querySelector('.language-switch');
  if (!control || !window.fetch || !window.history.replaceState) return;

  const attributes = ['href', 'aria-label', 'alt', 'title', 'lang', 'hreflang'];
  const ignored = 'script, style, #blog, .nav-toggle';
  const snapshots = new Map();
  const initialURL = new URL(location.href);
  const alternateURL = new URL(control.href);
  const originalBlog = document.getElementById('blog');

  function capture(live, initial) {
    return {
      live,
      initial,
      children: [...live.childNodes]
        .filter(node => node.nodeType === 1 ? !node.matches(ignored)
          : node.nodeType === 3 && node.textContent.trim())
        .map(node => capture(node, node.cloneNode(false))),
    };
  }

  const tree = capture(document.body, document.body.cloneNode(false));
  const originalTitle = document.title;
  const originalDescription = document.querySelector('meta[name="description"]');
  const originalDescriptionText = originalDescription?.content;
  const initialEntries = [];
  function originalEntries(branch) {
    initialEntries.push([branch.live, branch.initial]);
    branch.children.forEach(originalEntries);
  }
  originalEntries(tree);
  snapshots.set(root.lang, {
    url: initialURL, entries: initialEntries, title: originalTitle,
    description: originalDescriptionText, blog: originalBlog,
  });

  function match(branch, alternate, entries) {
    if (branch.initial.nodeName !== alternate?.nodeName) return false;
    const children = [...alternate.childNodes]
      .filter(node => node.nodeType === 1 ? !node.matches(ignored)
        : node.nodeType === 3 && node.textContent.trim());
    if (children.length !== branch.children.length) return false;
    entries.push([branch.live, alternate]);
    return branch.children.every((child, index) => match(child, children[index], entries));
  }

  let busy = false;
  let blog = originalBlog;
  async function getVersion(lang) {
    if (snapshots.has(lang)) return snapshots.get(lang);
    const response = await fetch(alternateURL);
    if (!response.ok) throw new Error('Language version unavailable');
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    const entries = [];
    if (page.documentElement.lang !== lang || !match(tree, page.body, entries)) {
      throw new Error('Language versions have different page structures');
    }
    const version = {
      url: alternateURL, entries, title: page.title,
      description: page.querySelector('meta[name="description"]')?.content,
      blog: page.getElementById('blog'),
    };
    snapshots.set(lang, version);
    return version;
  }

  control.addEventListener('click', async event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (busy) return;
    busy = true;
    const lang = control.hreflang;
    try {
      const version = await getVersion(lang);
      const marker = document.elementsFromPoint(innerWidth / 2, Math.min(150, innerHeight / 2))
        .find(element => element.closest('main, .hero') && !element.closest('dialog'));
      const offset = marker?.getBoundingClientRect().top;
      const position = scrollY;

      for (const [live, alternate] of version.entries) {
        if (live.nodeType === 3 && live.data !== alternate.data) {
          live.data = alternate.data;
        } else if (live.nodeType === 1) {
          for (const attribute of attributes) {
            const value = alternate.getAttribute(attribute);
            if (value !== null && live.getAttribute(attribute) !== value) live.setAttribute(attribute, value);
          }
        }
      }
      if (version.blog && !blog) {
        blog = document.importNode(version.blog, true);
        document.querySelector('main').after(blog);
      }
      if (blog) blog.hidden = !version.blog;
      root.lang = lang;
      document.title = version.title;
      if (originalDescription && version.description) originalDescription.content = version.description;
      const target = new URL(version.url);
      target.hash = location.hash === '#blog' && !version.blog ? '#contact' : location.hash;
      target.search = location.search;
      history.replaceState(history.state, '', target);
      document.dispatchEvent(new Event('portfolio:language'));
      const shift = marker ? marker.getBoundingClientRect().top - offset : 0;
      window.scrollTo({ top: position + shift, behavior: 'instant' });
    } catch (error) {
      console.warn(error);
      const message = root.lang === 'ru' ? 'Не удалось переключить язык. Попробуйте ещё раз.' : 'Could not switch languages. Try again.';
      let status = document.querySelector('.language-status');
      if (!status) {
        status = document.createElement('span');
        status.className = 'language-status';
        status.setAttribute('role', 'status');
        control.after(status);
      }
      status.textContent = message;
      setTimeout(() => status.remove(), 4000);
    } finally {
      busy = false;
    }
  });
})();
