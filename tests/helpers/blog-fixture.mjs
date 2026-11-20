export function blogFixture(slug, changes = {}) {
  return {
    id: `test-${slug}`, slug, title: { pt: 'Arquitetura de integração', en: 'Integration architecture', es: 'Arquitectura de integración' },
    excerpt: { pt: 'Conectando sistemas com segurança', en: 'Connecting systems securely', es: 'Conectar sistemas de forma segura' },
    category: 'salesforce', tags: ['crm', 'integracoes'], author: 'Autor de teste', language: 'pt', languages: ['pt'], type: 'technical',
    status: 'published', editorialStatus: 'published', confidentialityStatus: 'validated', factualStatus: 'validated',
    approvedBy: 'Revisor de teste', publishedAt: '2026-11-20', reviewedAt: '2026-11-20', updatedAt: null,
    featured: false, series: null, seriesOrder: null, relatedArticles: [], maturity: null,
    sources: [{ title: 'Referência de teste', url: 'https://example.com/reference', checkedAt: '2026-11-20' }], ...changes,
  };
}
