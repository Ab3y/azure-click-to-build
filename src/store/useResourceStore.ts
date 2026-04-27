import { create } from 'zustand';
import type { CanvasResource, ResourceGroup } from '../types';
import { allResources } from '../data/azureResources';

interface ResourceState {
  selectedResources: Map<string, CanvasResource>;
  resourceGroups: ResourceGroup[];

  addResource: (resourceId: string, resourceGroupId: string) => string;
  removeResource: (instanceId: string) => void;
  updateResourceProperty: (
    instanceId: string,
    key: string,
    value: unknown
  ) => void;

  addResourceGroup: (name: string, location: string) => string;
  removeResourceGroup: (id: string) => void;
  updateResourceGroup: (
    id: string,
    updates: Partial<Omit<ResourceGroup, 'id'>>
  ) => void;

  getResourcesByGroup: (groupId: string) => CanvasResource[];
  isResourceTypeSelected: (resourceId: string) => boolean;
  replaceAll: (resources: CanvasResource[], resourceGroups: ResourceGroup[]) => void;
  updateResourceRG: (instanceId: string, newRgId: string) => void;
}

const RG_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
];

let rgColorIdx = 1; // 0 is used by the default RG

function nextId() {
  return `inst-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  selectedResources: new Map<string, CanvasResource>(),

  resourceGroups: [
    {
      id: 'rg-default',
      name: 'rg-main',
      location: 'eastus',
      color: '#3b82f6',
    },
  ],

  addResource: (resourceId, resourceGroupId) => {
    const definition = allResources.find((r) => r.id === resourceId);
    if (!definition) throw new Error(`Unknown resource: ${resourceId}`);

    const instanceId = nextId();
    const resource: CanvasResource = {
      resourceId,
      instanceId,
      resourceGroupId,
      name: definition.name.toLowerCase().replace(/\s+/g, '-'),
      properties: { ...definition.defaultProperties },
    };

    set((state) => {
      const next = new Map(state.selectedResources);
      next.set(instanceId, resource);
      return { selectedResources: next };
    });

    return instanceId;
  },

  removeResource: (instanceId) =>
    set((state) => {
      const next = new Map(state.selectedResources);
      next.delete(instanceId);
      return { selectedResources: next };
    }),

  updateResourceProperty: (instanceId, key, value) =>
    set((state) => {
      const next = new Map(state.selectedResources);
      const existing = next.get(instanceId);
      if (!existing) return state;
      next.set(instanceId, {
        ...existing,
        properties: { ...existing.properties, [key]: value },
      });
      return { selectedResources: next };
    }),

  addResourceGroup: (name, location) => {
    const id = `rg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const color = RG_COLORS[rgColorIdx % RG_COLORS.length];
    rgColorIdx++;

    set((state) => ({
      resourceGroups: [
        ...state.resourceGroups,
        { id, name, location, color },
      ],
    }));

    return id;
  },

  removeResourceGroup: (id) => {
    const { selectedResources } = get();
    const hasResources = Array.from(selectedResources.values()).some(
      (r) => r.resourceGroupId === id
    );
    if (hasResources) {
      throw new Error(
        'Cannot remove resource group that still contains resources.'
      );
    }
    set((state) => ({
      resourceGroups: state.resourceGroups.filter((rg) => rg.id !== id),
    }));
  },

  updateResourceGroup: (id, updates) =>
    set((state) => ({
      resourceGroups: state.resourceGroups.map((rg) =>
        rg.id === id ? { ...rg, ...updates } : rg
      ),
    })),

  getResourcesByGroup: (groupId) => {
    const { selectedResources } = get();
    return Array.from(selectedResources.values()).filter(
      (r) => r.resourceGroupId === groupId
    );
  },

  isResourceTypeSelected: (resourceId) => {
    const { selectedResources } = get();
    return Array.from(selectedResources.values()).some(
      (r) => r.resourceId === resourceId
    );
  },

  replaceAll: (resources, resourceGroups) => {
    const map = new Map<string, CanvasResource>();
    for (const r of resources) {
      map.set(r.instanceId, r);
    }
    set({ selectedResources: map, resourceGroups });
  },

  updateResourceRG: (instanceId, newRgId) =>
    set((state) => {
      const next = new Map(state.selectedResources);
      const existing = next.get(instanceId);
      if (!existing) return state;
      next.set(instanceId, { ...existing, resourceGroupId: newRgId });
      return { selectedResources: next };
    }),
}));
