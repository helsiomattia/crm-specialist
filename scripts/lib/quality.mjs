import { parse } from '@babel/parser';

function stringValues(node) {
  if (!node) return [];
  if (node.type === 'StringLiteral') return [node.value];
  if (node.type === 'JSXExpressionContainer') return stringValues(node.expression);
  if (node.type === 'ConditionalExpression') return [...stringValues(node.consequent), ...stringValues(node.alternate)];
  return [];
}
export function javascriptErrors(source, file) {
  const errors = [];
  let ast;
  try { ast = parse(source, { sourceType: 'unambiguous', plugins: ['jsx'] }); }
  catch (error) { return [`${file}:${error.loc?.line || 1}: ${error.message}`]; }
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXOpeningElement') {
      const attribute = name => node.attributes.find(item => item.type === 'JSXAttribute' && item.name.name === name)?.value;
      if (stringValues(attribute('target')).includes('_blank')) {
        const rels = stringValues(attribute('rel'));
        if (!rels.length || rels.some(rel => !['noopener', 'noreferrer'].every(part => rel.split(/\s+/).includes(part)))) errors.push(`${file}:${node.loc.start.line}: target=_blank requires noopener noreferrer on this element`);
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === 'object' && value.type) visit(value);
    }
  }
  visit(ast);
  return errors;
}

export function whitespaceErrors(source, file) {
  return source.split('\n').flatMap((raw, index) => {
    const line = raw.replace(/\r$/, '');
    // Exactly two spaces are the intentional CommonMark hard line break.
    if (/\.md$/i.test(file) && /\S {2}$/.test(line)) return [];
    return /[ \t]$/.test(line) ? [`${file}:${index + 1}: trailing whitespace`] : [];
  });
}
