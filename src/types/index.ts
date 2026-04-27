import type { Node, Edge } from '@xyflow/react';

export type CodeLanguage = 'bicep' | 'terraform';
export type ThemeMode = 'light' | 'dark';

export interface AzureResourceDefinition {
  id: string;
  name: string;
  category: string;
  bicepType: string;
  terraformType?: string;
  icon: string;
  description?: string;
  docsUrl?: string;
  tooltip?: string;
  defaultProperties: Record<string, unknown>;
  allowedConnections?: string[];
  dependencies?: string[];
}

export interface AzureCategory {
  id: string;
  name: string;
  icon: string;
  resources: AzureResourceDefinition[];
}

export interface ResourceGroup {
  id: string;
  name: string;
  location: string;
  color: string;
}

export interface CanvasResource {
  resourceId: string;
  instanceId: string;
  resourceGroupId: string;
  name: string;
  bicepType?: string;
  properties: Record<string, unknown>;
}

// Alias used by data file
export type AzureResource = AzureResourceDefinition;

export interface ProjectState {
  resources: CanvasResource[];
  resourceGroups: ResourceGroup[];
  nodes: Node[];
  edges: Edge[];
  codeLanguage: CodeLanguage;
}

export type ResourceNodeData = {
  label: string;
  resourceId: string;
  instanceId: string;
  resourceGroupId: string;
  category: string;
  bicepType: string;
  icon: string;
  description?: string;
  docsUrl?: string;
  properties: Record<string, unknown>;
  [key: string]: unknown;
};

export type ResourceGroupNodeData = {
  label: string;
  rgId: string;
  color: string;
  location: string;
  [key: string]: unknown;
};
