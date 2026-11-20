export const PROJECT_EMBED_LOADERS = {
  'crm-customer-360': () => import('../../projects/customer360_generico_interativo_v4.html?raw'),
  'service-cloud-console': () => import('../../projects/Service360_Generic_Embed_V2.html?raw'),
  'customer-journey-360': () => import('../../projects/Customer_Journey_360_Generic.html?raw'),
  'intelligence-360': () => import('../../projects/Intelligence360_Generic.html?raw'),
  'revenue-churn-intelligence': () => import('../../projects/Revenue_Churn_Intelligence_Generic.html?raw'),
  'salesforce-architecture-control-center': () => import('../../projects/Salesforce_Architecture_Control_Center_Generic.html?raw'),
  'lwc-enterprise-integration-reliability-hub': () => import('../../projects/lwc/enterprise-integration-reliability-hub-preview.html?raw'),
  'lwc-deal-governance-center': () => import('../../projects/lwc/deal-governance-center-preview.html?raw'),
  'lwc-customer-relationship-graph': () => import('../../projects/lwc/customer-relationship-graph-preview.html?raw'),
  'lwc-customer-data-quality-center': () => import('../../projects/lwc/customer-data-quality-center-preview.html?raw'),
  'lwc-lead-account-routing-studio': () => import('../../projects/lwc/lead-account-routing-studio-preview.html?raw'),
  'lwc-intelligent-workload-routing-studio': () => import('../../projects/lwc/intelligent-workload-routing-studio-preview.html?raw'),
  'lwc-omni-transfer-intelligence': () => import('../../projects/lwc/omni-transfer-intelligence-preview.html?raw'),
  'lwc-pipeline-risk-inspector': () => import('../../projects/lwc/pipeline-risk-inspector-preview.html?raw'),
  'lwc-sla-escalation-control-tower': () => import('../../projects/lwc/sla-escalation-control-tower-preview.html?raw'),
  'lwc-unified-interaction-timeline': () => import('../../projects/lwc/unified-interaction-timeline-preview.html?raw'),
};

export async function loadPortfolioProjectEmbed(id, loaders = PROJECT_EMBED_LOADERS) {
  if (!Object.hasOwn(loaders, id)) throw new Error(`No embed loader for ${id}`);
  const module = await loaders[id]();
  if (typeof module.default !== 'string' || !module.default.trim()) throw new Error(`Empty embed for ${id}`);
  return module.default;
}
