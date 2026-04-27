import type { CanvasResource, ResourceGroup } from '../types';
import { allResources } from '../data/azureResources';

export interface OptimizationChange {
  type: 'added_resource' | 'added_dependency' | 'updated_property' | 'suggestion';
  description: string;
  severity: 'info' | 'warning';
}

export interface OptimizationResult {
  resources: CanvasResource[];
  edges: Array<{ source: string; target: string }>;
  changes: OptimizationChange[];
}

function getBicepType(resourceId: string): string | undefined {
  return allResources.find((r) => r.id === resourceId)?.bicepType;
}

export function optimizeArchitecture(
  resources: CanvasResource[],
  _resourceGroups: ResourceGroup[],
  edges: Array<{ source: string; target: string }>
): OptimizationResult {
  const result: OptimizationResult = {
    resources: [...resources],
    edges: [...edges],
    changes: [],
  };

  const resourceIds = new Set(resources.map((r) => r.resourceId));
  const bicepTypes = new Set(resources.map((r) => getBicepType(r.resourceId)).filter(Boolean));

  // Rule: VM without NSG
  const hasVm =
    bicepTypes.has('Microsoft.Compute/virtualMachines') ||
    bicepTypes.has('Microsoft.Compute/virtualMachineScaleSets');
  const hasNsg = resourceIds.has('network-security-group');
  if (hasVm && !hasNsg) {
    result.changes.push({
      type: 'suggestion',
      description:
        'Virtual Machine detected without a Network Security Group. Consider adding an NSG to control inbound and outbound traffic.',
      severity: 'warning',
    });
  }

  // Rule: Any resource without Application Insights
  if (resources.length > 0 && !resourceIds.has('application-insights')) {
    result.changes.push({
      type: 'suggestion',
      description:
        'No Application Insights resource found. Consider adding Application Insights for monitoring and diagnostics.',
      severity: 'info',
    });
  }

  // Rule: Key Vault without Private Endpoint
  const hasKeyVault = resourceIds.has('key-vault');
  const hasPrivateEndpoint = resourceIds.has('private-endpoint');
  if (hasKeyVault && !hasPrivateEndpoint) {
    result.changes.push({
      type: 'suggestion',
      description:
        'Key Vault detected without a Private Endpoint. Consider adding a Private Endpoint for secure network access.',
      severity: 'warning',
    });
  }

  // Rule: Storage Account — enforce HTTPS-only
  for (const res of result.resources) {
    if (getBicepType(res.resourceId) === 'Microsoft.Storage/storageAccounts') {
      if (!res.properties.supportsHttpsTrafficOnly) {
        res.properties = {
          ...res.properties,
          supportsHttpsTrafficOnly: true,
        };
        result.changes.push({
          type: 'updated_property',
          description: `Storage Account "${res.name}": enabled supportsHttpsTrafficOnly for secure transfer.`,
          severity: 'info',
        });
      }
    }
  }

  // Rule: App Service without App Service Plan
  const hasAppService =
    resources.some(
      (r) =>
        getBicepType(r.resourceId) === 'Microsoft.Web/sites' &&
        r.resourceId !== 'function-app'
    );
  const hasAppServicePlan = resourceIds.has('app-service-plan');
  if (hasAppService && !hasAppServicePlan) {
    result.changes.push({
      type: 'added_dependency',
      description:
        'App Service detected without an App Service Plan. An App Service Plan is required to host the App Service.',
      severity: 'warning',
    });
  }

  // Rule: SQL Database without SQL Server
  const hasSqlDb = resourceIds.has('sql-database');
  const hasSqlServer = resourceIds.has('sql-server');
  if (hasSqlDb && !hasSqlServer) {
    result.changes.push({
      type: 'added_dependency',
      description:
        'SQL Database detected without a SQL Server. A SQL Server resource is required as the parent for the database.',
      severity: 'warning',
    });
  }

  // Rule: Recommend tags
  const hasAnyResourceWithoutTags = resources.some(
    (r) => !r.properties.tags || Object.keys(r.properties.tags as Record<string, unknown>).length === 0
  );
  if (hasAnyResourceWithoutTags && resources.length > 0) {
    result.changes.push({
      type: 'suggestion',
      description:
        'Consider adding tags (e.g., environment, owner, costCenter) to all resources for better organization and cost tracking.',
      severity: 'info',
    });
  }

  // Rule: App Insights without Log Analytics Workspace
  const hasAppInsights = resourceIds.has('application-insights');
  const hasLogAnalytics = resourceIds.has('log-analytics-workspace');
  if (hasAppInsights && !hasLogAnalytics) {
    result.changes.push({
      type: 'suggestion',
      description:
        'Application Insights detected without a Log Analytics Workspace. A workspace-based Application Insights is recommended for full observability.',
      severity: 'warning',
    });
  }

  return result;
}
