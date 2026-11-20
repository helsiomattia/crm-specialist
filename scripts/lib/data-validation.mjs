const languages = ['pt', 'en', 'es'];
export function portfolioErrors(projects, loaderIds) {
  const errors = [];
  const ids = new Set();
  for (const project of projects) {
    if (!/^[a-z0-9-]+$/.test(project.id) || ids.has(project.id)) errors.push(`Invalid or duplicate id: ${project.id}`);
    ids.add(project.id);
    if (!['external', 'embed', 'collection'].includes(project.kind)) errors.push(`Invalid kind: ${project.id}`);
    for (const field of ['title', 'description', 'status', 'action']) {
      for (const language of languages) if (typeof project[field]?.[language] !== 'string' || !project[field][language].trim()) errors.push(`${project.id}.${field}.${language}: required`);
    }
    if (!Array.isArray(project.tags) || !project.tags.length || project.tags.some(tag => typeof tag !== 'string')) errors.push(`${project.id}: invalid tags`);
    if (project.kind === 'external') {
      try { if (new URL(project.externalUrl).protocol !== 'https:') errors.push(`${project.id}: HTTPS required`); }
      catch { errors.push(`${project.id}: invalid URL`); }
    }
    if (project.kind === 'embed' && !loaderIds.includes(project.id)) errors.push(`${project.id}: missing loader`);
    if (project.parentId && !projects.some(parent => parent.id === project.parentId && parent.kind === 'collection')) errors.push(`${project.id}: invalid parentId`);
    const visited = new Set([project.id]);
    let parent = project.parentId;
    while (parent) {
      if (visited.has(parent)) { errors.push(`${project.id}: parent cycle`); break; }
      visited.add(parent);
      parent = projects.find(item => item.id === parent)?.parentId;
    }
  }
  for (const id of loaderIds) if (!projects.some(project => project.id === id && project.kind === 'embed')) errors.push(`${id}: orphan loader`);
  return errors;
}

export function flattenKeys(object, prefix = '') {
  return Object.entries(object).flatMap(([key, value]) => value && typeof value === 'object' && !Array.isArray(value) ? flattenKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`]);
}

export function localeErrors(resources, requiredKeys = []) {
  const errors = [];
  const expected = flattenKeys(resources.pt);
  for (const language of languages) {
    const actual = flattenKeys(resources[language]);
    for (const key of new Set([...expected, ...actual, ...requiredKeys])) {
      const value = key.split('.').reduce((object, part) => object?.[part], resources[language]);
      if (!expected.includes(key) && !requiredKeys.includes(key)) errors.push(`${language}: extra ${key}`);
      if (value === undefined || value === null || value === '') errors.push(`${language}: missing ${key}`);
    }
  }
  return errors;
}
