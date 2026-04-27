export interface ArchitectureTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  resources: Array<{ resourceId: string; name: string; position: { x: number; y: number } }>;
  connections: Array<{ source: string; target: string }>;
  resourceGroups: Array<{ name: string; location: string }>;
}

export const architectureTemplates: ArchitectureTemplate[] = [
  {
    id: 'three-tier-web',
    name: '3-Tier Web App',
    description: 'Classic web architecture with App Service, SQL Database, networking, and monitoring.',
    icon: 'Layers',
    resources: [
      { resourceId: 'app-service', name: 'app-service', position: { x: 400, y: 50 } },
      { resourceId: 'sql-server', name: 'sql-server', position: { x: 200, y: 250 } },
      { resourceId: 'sql-database', name: 'sql-database', position: { x: 200, y: 450 } },
      { resourceId: 'virtual-network', name: 'virtual-network', position: { x: 600, y: 250 } },
      { resourceId: 'network-security-group', name: 'network-security-group', position: { x: 800, y: 250 } },
      { resourceId: 'key-vault', name: 'key-vault', position: { x: 600, y: 450 } },
      { resourceId: 'application-insights', name: 'application-insights', position: { x: 400, y: 450 } },
    ],
    connections: [
      { source: 'app-service', target: 'sql-database' },
      { source: 'app-service', target: 'virtual-network' },
      { source: 'app-service', target: 'key-vault' },
      { source: 'app-service', target: 'application-insights' },
      { source: 'sql-server', target: 'sql-database' },
      { source: 'virtual-network', target: 'network-security-group' },
    ],
    resourceGroups: [{ name: 'rg-webapp', location: 'eastus' }],
  },
  {
    id: 'microservices-aks',
    name: 'Microservices on AKS',
    description: 'Kubernetes-based microservices with service bus messaging and Cosmos DB.',
    icon: 'Network',
    resources: [
      { resourceId: 'aks-cluster', name: 'aks-cluster', position: { x: 400, y: 50 } },
      { resourceId: 'container-registry', name: 'container-registry', position: { x: 150, y: 50 } },
      { resourceId: 'key-vault', name: 'key-vault', position: { x: 150, y: 250 } },
      { resourceId: 'service-bus', name: 'service-bus', position: { x: 650, y: 50 } },
      { resourceId: 'cosmos-db', name: 'cosmos-db', position: { x: 650, y: 250 } },
      { resourceId: 'application-insights', name: 'application-insights', position: { x: 400, y: 450 } },
      { resourceId: 'log-analytics-workspace', name: 'log-analytics-workspace', position: { x: 150, y: 450 } },
    ],
    connections: [
      { source: 'aks-cluster', target: 'container-registry' },
      { source: 'aks-cluster', target: 'key-vault' },
      { source: 'aks-cluster', target: 'service-bus' },
      { source: 'aks-cluster', target: 'cosmos-db' },
      { source: 'aks-cluster', target: 'application-insights' },
      { source: 'application-insights', target: 'log-analytics-workspace' },
    ],
    resourceGroups: [{ name: 'rg-microservices', location: 'eastus' }],
  },
  {
    id: 'serverless-api',
    name: 'Serverless API',
    description: 'Event-driven API with Function App, API Management, and Cosmos DB.',
    icon: 'Zap',
    resources: [
      { resourceId: 'api-management', name: 'api-management', position: { x: 150, y: 150 } },
      { resourceId: 'function-app', name: 'function-app', position: { x: 450, y: 150 } },
      { resourceId: 'cosmos-db', name: 'cosmos-db', position: { x: 750, y: 150 } },
      { resourceId: 'application-insights', name: 'application-insights', position: { x: 450, y: 370 } },
      { resourceId: 'storage-account', name: 'storage-account', position: { x: 750, y: 370 } },
    ],
    connections: [
      { source: 'api-management', target: 'function-app' },
      { source: 'function-app', target: 'cosmos-db' },
      { source: 'function-app', target: 'storage-account' },
      { source: 'function-app', target: 'application-insights' },
    ],
    resourceGroups: [{ name: 'rg-serverless', location: 'eastus' }],
  },
  {
    id: 'data-pipeline',
    name: 'Data Pipeline',
    description: 'Ingest, store, and analyze data with Event Hub, Data Lake, and SQL.',
    icon: 'Database',
    resources: [
      { resourceId: 'event-hub', name: 'event-hub', position: { x: 100, y: 150 } },
      { resourceId: 'storage-account', name: 'storage-account', position: { x: 380, y: 50 } },
      { resourceId: 'data-lake-storage', name: 'data-lake-storage', position: { x: 380, y: 300 } },
      { resourceId: 'sql-server', name: 'sql-server', position: { x: 660, y: 50 } },
      { resourceId: 'sql-database', name: 'sql-database', position: { x: 660, y: 300 } },
      { resourceId: 'log-analytics-workspace', name: 'log-analytics-workspace', position: { x: 380, y: 500 } },
    ],
    connections: [
      { source: 'event-hub', target: 'storage-account' },
      { source: 'event-hub', target: 'data-lake-storage' },
      { source: 'data-lake-storage', target: 'sql-database' },
      { source: 'sql-server', target: 'sql-database' },
      { source: 'sql-database', target: 'log-analytics-workspace' },
    ],
    resourceGroups: [{ name: 'rg-data', location: 'eastus' }],
  },
  {
    id: 'ai-chat-app',
    name: 'AI Chat App',
    description: 'RAG-powered chat application with Azure OpenAI, AI Search, and Cosmos DB.',
    icon: 'Brain',
    resources: [
      { resourceId: 'app-service', name: 'app-service', position: { x: 100, y: 150 } },
      { resourceId: 'azure-openai', name: 'azure-openai', position: { x: 400, y: 50 } },
      { resourceId: 'ai-search', name: 'ai-search', position: { x: 700, y: 50 } },
      { resourceId: 'cosmos-db', name: 'cosmos-db', position: { x: 400, y: 300 } },
      { resourceId: 'key-vault', name: 'key-vault', position: { x: 700, y: 300 } },
      { resourceId: 'application-insights', name: 'application-insights', position: { x: 100, y: 400 } },
    ],
    connections: [
      { source: 'app-service', target: 'azure-openai' },
      { source: 'app-service', target: 'cosmos-db' },
      { source: 'app-service', target: 'key-vault' },
      { source: 'app-service', target: 'application-insights' },
      { source: 'azure-openai', target: 'ai-search' },
    ],
    resourceGroups: [{ name: 'rg-ai-chat', location: 'eastus' }],
  },
  {
    id: 'hub-spoke-network',
    name: 'Hub-Spoke Network',
    description: 'Enterprise hub-spoke topology with firewall, VPN gateway, and NSGs.',
    icon: 'Shield',
    resources: [
      { resourceId: 'virtual-network', name: 'vnet-hub', position: { x: 400, y: 50 } },
      { resourceId: 'virtual-network', name: 'vnet-spoke1', position: { x: 100, y: 350 } },
      { resourceId: 'virtual-network', name: 'vnet-spoke2', position: { x: 700, y: 350 } },
      { resourceId: 'azure-firewall', name: 'azure-firewall', position: { x: 250, y: 50 } },
      { resourceId: 'vpn-gateway', name: 'vpn-gateway', position: { x: 550, y: 50 } },
      { resourceId: 'network-security-group', name: 'nsg-spoke1', position: { x: 100, y: 550 } },
      { resourceId: 'network-security-group', name: 'nsg-spoke2', position: { x: 700, y: 550 } },
    ],
    connections: [
      { source: 'vnet-hub', target: 'vnet-spoke1' },
      { source: 'vnet-hub', target: 'vnet-spoke2' },
      { source: 'vnet-hub', target: 'azure-firewall' },
      { source: 'vnet-hub', target: 'vpn-gateway' },
      { source: 'vnet-spoke1', target: 'nsg-spoke1' },
      { source: 'vnet-spoke2', target: 'nsg-spoke2' },
    ],
    resourceGroups: [{ name: 'rg-networking', location: 'eastus' }],
  },
];
