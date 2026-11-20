import React from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { normalizeBlogSearch } from './blog.js';

const nodeText = node => node.value || (node.children || []).map(nodeText).join(' ');
const headingId = value => normalizeBlogSearch(value).replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') || 'secao';

export function markdownOutline(content) {
  const tree = unified().use(remarkParse).parse(content);
  const headings = [];
  const used = new Map();
  const visit = node => {
    if (node.type === 'heading') {
      const title = nodeText(node);
      const key = headingId(title);
      const number = (used.get(key) || 0) + 1;
      used.set(key, number);
      const id = `blog-${key}${number > 1 ? `-${number}` : ''}`;
      node.data = { ...node.data, hProperties: { id, tabIndex: -1 } };
      node.depth = Math.max(2, node.depth);
      headings.push({ id, title, depth: node.depth });
    }
    for (const child of node.children || []) visit(child);
  };
  visit(tree);
  return { tree, headings, text: nodeText(tree) };
}

export function MarkdownContent({ content, base = '', availableSlugs }) {
  const addHeadings = () => () => markdownOutline(content).tree;
  const transform = url => {
    const safe = defaultUrlTransform(url);
    if (safe.startsWith('/') && !safe.startsWith('//') && !(base && safe.startsWith(`${base}/`))) return `${base}${safe}`;
    return safe;
  };
  return React.createElement(ReactMarkdown, {
    skipHtml: true, remarkPlugins: [addHeadings], urlTransform: transform,
    components: {
      a: ({ node: _node, href, children, ...props }) => {
        const internal = href?.match(/\/blog\/([a-z0-9-]+)(?:[?#]|$)/)?.[1];
        if (internal && availableSlugs && !availableSlugs.includes(internal)) return React.createElement('span', null, children);
        return React.createElement('a', { ...props, href, ...(href?.startsWith('https://') ? { rel: 'noopener noreferrer' } : {}) }, children);
      },
      img: ({ node: _node, ...props }) => React.createElement('img', { ...props, loading: 'lazy', decoding: 'async' }),
    },
  }, content);
}
