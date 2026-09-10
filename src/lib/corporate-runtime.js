  // Corporate copy is applied after the retained Framer hydration lifecycle.
  // Keep every existing element, span, link, class and motion attribute.
  function setCorporateText(element, value) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    if (!nodes.length) return;
    const words = value.split(/\s+/);
    const lengths = nodes.map((node) => (node.nodeValue.trim().match(/\S+/g) || []).length);
    const total = lengths.reduce((sum, count) => sum + count, 0) || 1;
    let used = 0;
    let weight = 0;
    nodes.forEach((node, index) => {
      weight += lengths[index];
      const end = index === nodes.length - 1 ? words.length : Math.round(words.length * weight / total);
      node.nodeValue = words.slice(used, end).join(' ') + (end > used && end < words.length ? ' ' : '');
      used = end;
    });
  }

  function applyCorporateCopy() {
    const route = location.pathname.replace(/\/$/, '') || '/';
    const copy = new Map(Object.entries(corporate.extraCopy).map(([key, value]) => [normalized(key), value]));
    if (route.startsWith('/services/')) copy.set('PLATAFORMA EMPRESARIAL', 'JCAR LABS INC.');
    for (const service of corporate.services) {
      for (const key of [service.sourceTitle, service.oldTitle]) copy.set(normalized(key), service.label);
      copy.set(normalized(service.sourceDescription), service.description.toUpperCase());
    }
    for (const [key, value] of corporate.translations[route] || []) copy.set(normalized(key), value);
    for (const element of document.querySelectorAll('main p, main h1, main h2, main h3, main h4, main h5, main h6')) {
      const value = copy.get(normalized(element.textContent));
      if (value) setCorporateText(element, value);
    }
    if (route === '/') {
      for (const element of document.querySelectorAll('main section[data-framer-name="Section 0 - Hero"] p, main section[data-framer-name="Section 6 - Work Types"] p')) {
        if (normalized(element.textContent) === 'SOLUCIONES EMPRESARIALES') setCorporateText(element, 'CONSULTORÍA & CÓDIGO');
      }
      const about = document.getElementById('about-me');
      if (about) {
        const technologies = new Map([
          ['SOFTWARE & SAAS', 'JAVASCRIPT'], ['SISTEMAS LEGACY', 'PYTHON'],
          ['IA, AGENTES & LLMOPS', 'REACT'], ['CLOUD, APIS & MICROSERVICIOS', 'NODE.JS'],
          ['CLOUD & APIS', 'SQL'], ['AUDITORÍA DE CÓDIGO', 'PHP'], ['UX/UI', 'ARQUITECTURA'],
        ]);
        let legacy = 0;
        let cloud = 0;
        for (const element of about.querySelectorAll('p')) {
          const key = normalized(element.textContent);
          const value = key === 'SISTEMAS LEGACY' && legacy++ ? 'JAVA' : key === 'CLOUD & APIS' ? (cloud++ ? 'SQL' : 'NODE.JS') : technologies.get(key);
          if (value) setCorporateText(element, value);
        }
      }
    }
  }
