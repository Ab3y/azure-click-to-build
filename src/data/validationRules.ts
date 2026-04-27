import type { CanvasResource, ResourceGroup } from '../types';

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  resourceInstanceId?: string;
  docsUrl?: string;
}

export function validateArchitecture(
  resources: CanvasResource[],
  resourceGroups: ResourceGroup[],
  edges: Array<{ source: string; target: string }>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  let idx = 0;

  const connectedTo = (instanceId: string): Set<string> => {
    const peers = new Set<string>();
    for (const e of edges) {
      if (e.source === instanceId) peers.add(e.target);
      if (e.target === instanceId) peers.add(e.source);
    }
    return peers;
  };

  const resourceIdOf = (instanceId: string) =>
    resources.find((r) => r.instanceId === instanceId)?.resourceId;

  const peerResourceIds = (instanceId: string): string[] => {
    const peers = connectedTo(instanceId);
    return [...peers].map((id) => resourceIdOf(id)).filter(Boolean) as string[];
  };

  const hasResourceType = (type: string) =>
    resources.some((r) => r.resourceId === type);

  // ERROR: App Service without networking (no VNet connection)
  for (const r of resources) {
    if (r.resourceId === 'app-service') {
      const peers = peerResourceIds(r.instanceId);
      if (!peers.includes('virtual-network')) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'error',
          message: `App Service "${r.name}" has no Virtual Network connection — consider VNet integration for security.`,
          resourceInstanceId: r.instanceId,
          docsUrl: 'https://learn.microsoft.com/azure/app-service/overview-vnet-integration',
        });
      }
    }
  }

  // ERROR: SQL Database without SQL Server
  for (const r of resources) {
    if (r.resourceId === 'sql-database') {
      const peers = peerResourceIds(r.instanceId);
      if (!peers.includes('sql-server')) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'error',
          message: `SQL Database "${r.name}" is not connected to a SQL Server — a logical server is required.`,
          resourceInstanceId: r.instanceId,
          docsUrl: 'https://learn.microsoft.com/azure/azure-sql/database/logical-servers',
        });
      }
    }
  }

  // WARNING: VM without NSG
  for (const r of resources) {
    if (r.resourceId === 'virtual-machine') {
      const peers = peerResourceIds(r.instanceId);
      if (!peers.includes('network-security-group')) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'warning',
          message: `Virtual Machine "${r.name}" has no NSG — traffic is unrestricted.`,
          resourceInstanceId: r.instanceId,
        });
      }
    }
  }

  // WARNING: Key Vault without Private Endpoint
  for (const r of resources) {
    if (r.resourceId === 'key-vault') {
      const peers = peerResourceIds(r.instanceId);
      if (!peers.includes('private-endpoint')) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'warning',
          message: `Key Vault "${r.name}" has no Private Endpoint — secrets are accessible over the public internet.`,
          resourceInstanceId: r.instanceId,
          docsUrl: 'https://learn.microsoft.com/azure/key-vault/general/private-link-service',
        });
      }
    }
  }

  // WARNING: Public IP without NSG
  for (const r of resources) {
    if (r.resourceId === 'public-ip') {
      const peers = peerResourceIds(r.instanceId);
      if (!peers.includes('network-security-group')) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'warning',
          message: `Public IP "${r.name}" has no associated NSG — consider adding network security rules.`,
          resourceInstanceId: r.instanceId,
        });
      }
    }
  }

  // WARNING: Storage Account without HTTPS only
  for (const r of resources) {
    if (r.resourceId === 'storage-account') {
      if (r.properties.httpsOnly !== true) {
        issues.push({
          id: `v-${idx++}`,
          severity: 'warning',
          message: `Storage Account "${r.name}" does not enforce HTTPS-only access.`,
          resourceInstanceId: r.instanceId,
          docsUrl: 'https://learn.microsoft.com/azure/storage/common/storage-require-secure-transfer',
        });
      }
    }
  }

  // INFO: No monitoring resources
  if (!hasResourceType('application-insights') && !hasResourceType('log-analytics-workspace')) {
    if (resources.length > 0) {
      issues.push({
        id: `v-${idx++}`,
        severity: 'info',
        message: 'No monitoring resources (Application Insights or Log Analytics) are present — add observability.',
        docsUrl: 'https://learn.microsoft.com/azure/azure-monitor/overview',
      });
    }
  }

  // INFO: No tags configured
  if (resources.length > 0 && resourceGroups.length > 0) {
    issues.push({
      id: `v-${idx++}`,
      severity: 'info',
      message: 'Consider adding tags to resources for cost tracking and governance.',
    });
  }

  // INFO: Consider adding Managed Identity
  if (resources.length > 0 && !hasResourceType('managed-identity')) {
    const needsIdentity = resources.some((r) =>
      ['app-service', 'function-app', 'aks-cluster', 'container-app'].includes(r.resourceId),
    );
    if (needsIdentity) {
      issues.push({
        id: `v-${idx++}`,
        severity: 'info',
        message: 'Consider adding a Managed Identity for secure, credential-free authentication.',
        docsUrl:
          'https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview',
      });
    }
  }

  return issues;
}
