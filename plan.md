# Azure Click to Build — Implementation Plan

## Problem Statement
Build a modern, browser-only web application that lets users visually construct Azure infrastructure by selecting resources from categorized menus, grouping them into resource groups, and generating valid Bicep or Terraform scripts. The app must support import/export, visual canvas with drag-and-drop, connection lines between resources, context menus, dark mode, best-practice tooltips, and an optimize function.

## Core Design Principle: Offline-First / No Authentication
This application runs **100% in the browser** with **zero external dependencies**:
- No Microsoft account or Azure login required
- No API calls to any cloud services
- No backend server — everything is client-side TypeScript
- Works fully offline after initial page load
- All resource catalogs, pricing data, and best-practice rules are bundled locally
- Import/export via local files only
- Can be deployed as a static site (GitHub Pages, Azure Static Web Apps, etc.)

## Demo Mode: Azure AI Capacity Architecture
A built-in interactive demo that walks users through a real-world Azure AI architecture:
- Pre-loaded canvas showing a complete AI capacity pipeline (Azure OpenAI, AI Search, Cosmos DB, App Service, Key Vault, VNet, etc.)
- Step-by-step guided walkthrough explaining each component and how they connect
- Tooltips explaining capacity planning concepts (PTU vs token-based, regional availability, model deployment)
- Shows how the generated Bicep/Terraform code maps to the visual
- Users can modify the demo architecture and see code changes in real-time
- Accessible from a "Try Demo" button on the empty canvas state and from the toolbar
- Reference docs: https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput

## Tech Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 + TypeScript | Component model, ecosystem, type safety |
| Build | Vite | Fast dev server, zero-config |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, dark mode built-in, polished components |
| Visual Canvas | React Flow | Drag-drop nodes, edges, context menus, grouping |
| Code Editor | Monaco Editor (@monaco-editor/react) | VS Code-quality syntax highlighting, Bicep/HCL support |
| State Management | Zustand | Lightweight, works well with React Flow |
| Icons | Lucide React | Clean, consistent icon set |
| Tooltips | Radix UI (via shadcn) | Accessible, composable |

All runs in-browser — no backend required.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        App Shell                            │
│  ┌──────────┐  ┌──────────────────────┐  ┌───────────────┐ │
│  │  Left     │  │   Visual Canvas      │  │  Code Panel   │ │
│  │  Panel    │  │   (React Flow)       │  │  (Monaco)     │ │
│  │          │  │                      │  │               │ │
│  │ Accordion │  │  Nodes = Resources   │  │  Bicep or     │ │
│  │ Categories│  │  Groups = RG nodes   │  │  Terraform    │ │
│  │ Checkboxes│  │  Edges = connections │  │  output       │ │
│  │          │  │                      │  │               │ │
│  └──────────┘  └──────────────────────┘  └───────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Toolbar: Dark Mode | Bicep/TF toggle | Import | Export  ││
│  │          Optimize | Add Resource Group                   ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Azure Resource Categories & Resources

Each category is an accordion section. Resources inside have checkboxes.
All links point to official Microsoft Learn documentation.

### 1. Compute
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Virtual Machine | Microsoft.Compute/virtualMachines | https://learn.microsoft.com/azure/virtual-machines/ |
| VM Scale Set | Microsoft.Compute/virtualMachineScaleSets | https://learn.microsoft.com/azure/virtual-machine-scale-sets/ |
| App Service | Microsoft.Web/sites | https://learn.microsoft.com/azure/app-service/ |
| Function App | Microsoft.Web/sites (kind: functionapp) | https://learn.microsoft.com/azure/azure-functions/ |
| Container Instance | Microsoft.ContainerInstance/containerGroups | https://learn.microsoft.com/azure/container-instances/ |
| Container App | Microsoft.App/containerApps | https://learn.microsoft.com/azure/container-apps/ |
| AKS Cluster | Microsoft.ContainerService/managedClusters | https://learn.microsoft.com/azure/aks/ |
| Batch Account | Microsoft.Batch/batchAccounts | https://learn.microsoft.com/azure/batch/ |

### 2. Networking
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Virtual Network | Microsoft.Network/virtualNetworks | https://learn.microsoft.com/azure/virtual-network/ |
| Subnet | Microsoft.Network/virtualNetworks/subnets | https://learn.microsoft.com/azure/virtual-network/virtual-network-manage-subnet |
| Network Security Group | Microsoft.Network/networkSecurityGroups | https://learn.microsoft.com/azure/virtual-network/network-security-groups-overview |
| Load Balancer | Microsoft.Network/loadBalancers | https://learn.microsoft.com/azure/load-balancer/ |
| Application Gateway | Microsoft.Network/applicationGateways | https://learn.microsoft.com/azure/application-gateway/ |
| Azure Firewall | Microsoft.Network/azureFirewalls | https://learn.microsoft.com/azure/firewall/ |
| VPN Gateway | Microsoft.Network/virtualNetworkGateways | https://learn.microsoft.com/azure/vpn-gateway/ |
| Public IP Address | Microsoft.Network/publicIPAddresses | https://learn.microsoft.com/azure/virtual-network/ip-services/ |
| Private Endpoint | Microsoft.Network/privateEndpoints | https://learn.microsoft.com/azure/private-link/ |
| DNS Zone | Microsoft.Network/dnsZones | https://learn.microsoft.com/azure/dns/ |
| Front Door | Microsoft.Cdn/profiles | https://learn.microsoft.com/azure/frontdoor/ |

### 3. Storage
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Storage Account | Microsoft.Storage/storageAccounts | https://learn.microsoft.com/azure/storage/ |
| Blob Container | Microsoft.Storage/storageAccounts/blobServices/containers | https://learn.microsoft.com/azure/storage/blobs/ |
| File Share | Microsoft.Storage/storageAccounts/fileServices/shares | https://learn.microsoft.com/azure/storage/files/ |
| Data Lake Storage | Microsoft.Storage/storageAccounts (isHnsEnabled) | https://learn.microsoft.com/azure/storage/blobs/data-lake-storage-introduction |
| Managed Disk | Microsoft.Compute/disks | https://learn.microsoft.com/azure/virtual-machines/managed-disks-overview |

### 4. Databases
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| SQL Database | Microsoft.Sql/servers/databases | https://learn.microsoft.com/azure/azure-sql/ |
| SQL Server | Microsoft.Sql/servers | https://learn.microsoft.com/azure/azure-sql/database/logical-servers |
| Cosmos DB Account | Microsoft.DocumentDB/databaseAccounts | https://learn.microsoft.com/azure/cosmos-db/ |
| PostgreSQL Flexible Server | Microsoft.DBforPostgreSQL/flexibleServers | https://learn.microsoft.com/azure/postgresql/ |
| MySQL Flexible Server | Microsoft.DBforMySQL/flexibleServers | https://learn.microsoft.com/azure/mysql/ |
| Redis Cache | Microsoft.Cache/redis | https://learn.microsoft.com/azure/azure-cache-for-redis/ |

### 5. AI & Machine Learning
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Azure OpenAI | Microsoft.CognitiveServices/accounts (kind: OpenAI) | https://learn.microsoft.com/azure/ai-services/openai/ |
| Cognitive Services | Microsoft.CognitiveServices/accounts | https://learn.microsoft.com/azure/ai-services/ |
| Machine Learning Workspace | Microsoft.MachineLearningServices/workspaces | https://learn.microsoft.com/azure/machine-learning/ |
| AI Search | Microsoft.Search/searchServices | https://learn.microsoft.com/azure/search/ |
| Bot Service | Microsoft.BotService/botServices | https://learn.microsoft.com/azure/bot-service/ |

### 6. Identity & Security
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Key Vault | Microsoft.KeyVault/vaults | https://learn.microsoft.com/azure/key-vault/ |
| Managed Identity | Microsoft.ManagedIdentity/userAssignedIdentities | https://learn.microsoft.com/azure/active-directory/managed-identities-azure-resources/ |
| Application Insights | Microsoft.Insights/components | https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview |
| Log Analytics Workspace | Microsoft.OperationalInsights/workspaces | https://learn.microsoft.com/azure/azure-monitor/logs/log-analytics-workspace-overview |

### 7. Integration
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Service Bus Namespace | Microsoft.ServiceBus/namespaces | https://learn.microsoft.com/azure/service-bus-messaging/ |
| Event Hub Namespace | Microsoft.EventHub/namespaces | https://learn.microsoft.com/azure/event-hubs/ |
| Event Grid Topic | Microsoft.EventGrid/topics | https://learn.microsoft.com/azure/event-grid/ |
| Logic App | Microsoft.Logic/workflows | https://learn.microsoft.com/azure/logic-apps/ |
| API Management | Microsoft.ApiManagement/service | https://learn.microsoft.com/azure/api-management/ |

### 8. DevOps & Monitoring
| Resource | Bicep Type | Docs |
|----------|-----------|------|
| Container Registry | Microsoft.ContainerRegistry/registries | https://learn.microsoft.com/azure/container-registry/ |
| Dashboard | Microsoft.Portal/dashboards | https://learn.microsoft.com/azure/azure-portal/azure-portal-dashboards |
| Action Group | Microsoft.Insights/actionGroups | https://learn.microsoft.com/azure/azure-monitor/alerts/action-groups |
| Metric Alert | Microsoft.Insights/metricAlerts | https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-metric-overview |

---

## Feature Breakdown (Todos)

### Phase 1: Project Scaffolding
- **scaffold-project**: Initialize Vite + React + TypeScript project with Tailwind CSS, install all dependencies (react-flow, monaco, zustand, shadcn/ui, lucide-react)

### Phase 2: Core Layout & Theme
- **app-shell**: Build the 3-panel layout (left sidebar, center canvas, right code panel) with responsive resizable panels
- **dark-mode**: Implement dark/light mode toggle using Tailwind's `dark` class strategy with system preference detection and localStorage persistence
- **toolbar**: Top toolbar with mode toggle (Bicep/Terraform), import/export buttons, optimize button, add resource group button

### Phase 3: Left Panel — Resource Catalog
- **resource-data**: Define the complete Azure resource catalog data structure (categories → resources with bicep types, terraform types, doc links, tooltips)
- **accordion-menu**: Build accordion-style category sections using shadcn Accordion component
- **resource-checkboxes**: Checkboxes inside each accordion for individual resources; checking adds to canvas, unchecking removes
- **resource-tooltips**: Hover tooltips on each resource showing best-practice tips with link to Microsoft docs
- **resource-group-selector**: Dropdown or assignment UI to choose which resource group a resource belongs to when selecting it

### Phase 4: Visual Canvas (React Flow)
- **canvas-setup**: Initialize React Flow canvas with custom node types, minimap, controls, and background
- **resource-nodes**: Custom node component showing resource icon, name, type, and resource group badge
- **resource-group-nodes**: Group node (React Flow parent node) representing Azure Resource Groups — visually contains child resource nodes
- **drag-drop**: Enable dragging/repositioning nodes on canvas
- **connection-lines**: Edges/connections between resources showing dependencies (e.g., VM → VNet, App Service → SQL DB)
- **context-menu-node**: Right-click on node: Delete resource, Change resource group, View docs
- **context-menu-canvas**: Right-click on canvas: Add resource, Add resource group
- **context-menu-edge**: Right-click on edge/line: Add resource in between, Delete connection
- **hover-edge**: Hovering over connection lines shows tooltip with relationship info and right-click option
- **add-remove-rg**: UI to add new resource groups (modal/dialog) and remove empty ones

### Phase 5: Code Generation
- **bicep-generator**: Generate valid Bicep code from canvas state (resources + resource groups + connections)
- **terraform-generator**: Generate valid Terraform HCL code from canvas state
- **code-panel**: Monaco Editor panel showing generated code with syntax highlighting, read-only by default
- **live-sync**: Code updates reactively as user adds/removes/moves resources
- **bicep-tf-toggle**: Toggle between Bicep and Terraform output; regenerates code on switch

### Phase 6: Import / Export
- **export-script**: Export generated Bicep (.bicep) or Terraform (.tf) files as download
- **export-json**: Export project state as JSON (for re-import with visual layout preserved)
- **import-script**: Import existing Bicep or Terraform files; parse and populate canvas + check appropriate sidebar options
- **import-json**: Import project JSON to restore full state (resources, layout, connections, resource groups)

### Phase 7: Optimize
- **optimize-engine**: "Optimize" button that rewrites the script applying best practices:
  - Adds missing dependencies (e.g., NSG for subnet, managed identity for Key Vault)
  - Reorders resources for proper dependency chain
  - Adds recommended parameters (SKU tiers, redundancy settings)
  - Suggests missing monitoring (App Insights, Log Analytics)
  - Reformats code for readability
- **optimize-diff**: Show before/after diff or highlight changes after optimization

### Phase 8: Polish & UX
- **responsive-layout**: Ensure panels resize properly; collapsible sidebar on small screens
- **keyboard-shortcuts**: Common shortcuts (Ctrl+S export, Ctrl+Z undo, Delete remove selected)
- **auto-layout**: Button to auto-arrange nodes on canvas using dagre/elkjs layout algorithm
- **search-filter**: Search/filter bar in left panel to find resources quickly

### Phase 9: Enhanced UX — Nice-to-Have Modern Features

#### 9a. Onboarding & Discoverability
- **onboarding-tour**: Guided walkthrough for first-time users using a step-by-step tour overlay (e.g., react-joyride). Highlights the sidebar, canvas, code panel, and key actions. Stored in localStorage so it only shows once, with a "Replay Tour" button in the help menu.
- **command-palette**: Ctrl+K / Cmd+K command palette (like VS Code / Notion) for quick access to any action — add resource, switch theme, export, optimize, toggle Bicep/TF, search resources. Uses a fuzzy-search dialog.
- **help-panel**: Slide-out help panel with keyboard shortcut cheat sheet, FAQ, and links to Azure docs.

#### 9b. Templates & Starter Architectures
- **template-gallery**: Pre-built architecture templates users can load in one click:
  - 3-Tier Web App (App Service + SQL DB + VNet + NSG + Key Vault)
  - Microservices on AKS (AKS + ACR + Key Vault + Service Bus + Cosmos DB)
  - Serverless API (Function App + API Management + Cosmos DB + App Insights)
  - Data Pipeline (Data Lake + Event Hub + Databricks/ML Workspace + SQL DB)
  - AI Chat Application (Azure OpenAI + AI Search + App Service + Cosmos DB + Key Vault)
  - Hub-Spoke Network (Hub VNet + Spoke VNets + Firewall + VPN Gateway)
  - Each template pre-populates canvas, connections, resource groups, and generated code
  - Docs: https://learn.microsoft.com/azure/architecture/browse/

#### 9c. Resource Property Editor
- **property-panel**: When a resource node is selected, a property panel slides in (bottom or right drawer) allowing configuration of:
  - Resource name (with naming convention validation per CAF)
  - SKU / pricing tier dropdown
  - Azure region selector
  - Tags (key-value pairs)
  - Resource-specific settings (e.g., Storage Account replication type, VM size)
  - Changes reflect immediately in the generated code
  - Docs: https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming

#### 9d. Cost Estimation
- **cost-estimator**: Estimated monthly cost indicator based on selected resources and their SKU/tier. Uses a local pricing lookup table (no API calls) showing ranges. Displays as a floating badge or panel footer. Links to Azure Pricing Calculator for exact quotes.
  - Docs: https://azure.microsoft.com/pricing/calculator/
  - Reference: https://learn.microsoft.com/azure/cost-management-billing/costs/

#### 9e. Validation & Warnings
- **validation-panel**: A bottom panel (like VS Code's Problems panel) showing real-time validation:
  - Missing required dependencies (e.g., App Service Plan for App Service)
  - Orphaned resources (not connected to anything)
  - Naming convention violations
  - Security warnings (e.g., public IP without NSG, Key Vault without private endpoint)
  - Each warning links to the relevant Microsoft docs
  - Severity levels: Error (blocks export), Warning (best practice), Info (suggestion)

#### 9f. Undo / Redo & Version Snapshots
- **undo-redo**: Full undo/redo stack using command pattern. Tracks all canvas mutations (add, remove, move, connect, disconnect, property changes). Ctrl+Z / Ctrl+Shift+Z with visible undo/redo buttons in toolbar.
- **version-snapshots**: Save named snapshots of the current architecture ("v1 - initial", "v2 - added monitoring"). Snapshots stored in localStorage/IndexedDB. Can restore any snapshot. Useful for comparing iterations.

#### 9g. Sharing & Collaboration
- **shareable-url**: Encode the entire project state into a compressed URL (using lz-string compression + base64 in the URL hash). Users can share a link that opens the exact architecture. For large projects, falls back to a "Copy as JSON" button.
- **export-image**: Export the canvas as a high-resolution PNG or SVG image for documentation, presentations, or architecture review meetings. Uses html-to-image or React Flow's built-in toImage API.
- **export-pdf**: Export a full project report as PDF including: architecture diagram, resource list, generated code, and cost estimate.

#### 9h. Drag-from-Sidebar
- **drag-from-sidebar**: Instead of only using checkboxes, users can drag a resource directly from the sidebar onto the canvas. The resource appears where it's dropped. Uses React DnD or React Flow's built-in drag-and-drop. Checkboxes still work as an alternative.

#### 9i. Multi-Select & Bulk Operations
- **multi-select**: Shift+click or lasso-select multiple nodes on canvas. Selected nodes can be:
  - Moved together
  - Deleted together
  - Assigned to a resource group together
  - Copied/duplicated as a group
- **copy-paste-nodes**: Ctrl+C / Ctrl+V to duplicate selected resources (with auto-incremented names)

#### 9j. Favorites & Recently Used
- **favorites**: Pin frequently used resources to a "Favorites" section at the top of the sidebar. Stored in localStorage.
- **recently-used**: Track the last 10 resources added and show them in a "Recent" section for quick re-access.

#### 9k. Animations & Micro-interactions
- **smooth-animations**: Framer Motion for:
  - Accordion expand/collapse
  - Node appear/disappear on canvas (scale + fade)
  - Panel resize transitions
  - Toast notification slide-in
  - Context menu pop-in
  - Theme toggle transition (smooth color crossfade)
- **toast-notifications**: Non-intrusive toast messages for user feedback: "Exported successfully", "3 resources optimized", "Import complete — 12 resources loaded". Uses sonner (shadcn-compatible toast library).

#### 9l. Status Bar
- **status-bar**: Bottom status bar showing:
  - Total resource count
  - Resource group count
  - Current mode (Bicep / Terraform)
  - Estimated cost range
  - Last saved timestamp
  - Zoom level percentage

#### 9m. Accessibility (a11y)
- **accessibility**: WCAG 2.1 AA compliance:
  - Full keyboard navigation (Tab through sidebar, canvas, code panel)
  - ARIA labels on all interactive elements
  - Focus rings visible in both light and dark mode
  - Screen reader announcements for state changes ("Resource added to canvas", "Code generated")
  - Reduced motion support via `prefers-reduced-motion` media query
  - Color contrast ratios meet AA standards in both themes
  - Docs: https://learn.microsoft.com/azure/well-architected/operational-excellence/observability

#### 9n. PWA & Offline Support
- **pwa-support**: Progressive Web App configuration:
  - Service worker for offline caching (Workbox via vite-plugin-pwa)
  - Install prompt ("Add to Home Screen" / desktop install)
  - Works fully offline after first load
  - App manifest with Azure-themed icons
  - Splash screen on mobile

#### 9o. Multiple Projects / Tabs
- **multi-project**: Tab bar allowing multiple architecture projects open simultaneously. Each tab has independent state (resources, canvas, code). Projects stored in IndexedDB. Can rename, close, or duplicate tabs.

---

## Best Practices & Tooltips Content (sourced from Microsoft Learn)

Tooltips will reference these official best practice guides:
- **Naming conventions**: https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming
- **Resource tagging**: https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-tagging
- **Resource groups**: https://learn.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal
- **Bicep best practices**: https://learn.microsoft.com/azure/azure-resource-manager/bicep/best-practices
- **Terraform on Azure best practices**: https://learn.microsoft.com/azure/developer/terraform/best-practices-terraform-azure
- **Security baseline**: https://learn.microsoft.com/azure/security/benchmarks/overview
- **Well-Architected Framework**: https://learn.microsoft.com/azure/well-architected/

Example tooltip: "**Storage Account**: Use `Standard_GRS` for production workloads to ensure geo-redundancy. Enable soft delete for blob protection. [Learn more](https://learn.microsoft.com/azure/storage/common/storage-redundancy)"

---

## File Structure

```
azure-click-to-build/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                    # Tailwind imports + custom styles + animations
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # 3-panel layout with resizable panels
│   │   │   ├── Toolbar.tsx          # Top toolbar
│   │   │   ├── StatusBar.tsx        # Bottom status bar (resource count, cost, zoom)
│   │   │   ├── ThemeToggle.tsx      # Dark mode toggle with transition
│   │   │   └── TabBar.tsx           # Multi-project tabs
│   │   ├── sidebar/
│   │   │   ├── ResourceSidebar.tsx  # Left panel container
│   │   │   ├── CategoryAccordion.tsx# Accordion sections with resource count badges
│   │   │   ├── ResourceCheckbox.tsx # Individual resource checkbox (draggable)
│   │   │   ├── SearchFilter.tsx     # Resource search/filter
│   │   │   ├── FavoritesSection.tsx # Pinned favorite resources
│   │   │   └── RecentSection.tsx    # Recently used resources
│   │   ├── canvas/
│   │   │   ├── FlowCanvas.tsx       # React Flow wrapper
│   │   │   ├── ResourceNode.tsx     # Custom resource node (animated)
│   │   │   ├── ResourceGroupNode.tsx# Custom RG group node
│   │   │   ├── ContextMenu.tsx      # Right-click context menu
│   │   │   └── EdgeWithMenu.tsx     # Custom edge with hover/right-click
│   │   ├── code/
│   │   │   ├── CodePanel.tsx        # Monaco editor wrapper
│   │   │   └── CodeToolbar.tsx      # Copy, download, toggle language
│   │   ├── panels/
│   │   │   ├── PropertyPanel.tsx    # Resource property editor (name, SKU, region, tags)
│   │   │   ├── ValidationPanel.tsx  # Errors/warnings panel (like VS Code Problems)
│   │   │   └── CostEstimator.tsx    # Estimated monthly cost display
│   │   ├── dialogs/
│   │   │   ├── AddResourceGroupDialog.tsx
│   │   │   ├── ImportDialog.tsx
│   │   │   ├── OptimizeDiffDialog.tsx
│   │   │   ├── TemplateGalleryDialog.tsx  # Starter architecture templates
│   │   │   ├── SnapshotDialog.tsx         # Version snapshot manager
│   │   │   └── CommandPalette.tsx          # Ctrl+K command palette
│   │   └── onboarding/
│   │       ├── TourOverlay.tsx      # Step-by-step guided tour
│   │       └── HelpPanel.tsx        # Keyboard shortcuts & FAQ
│   ├── data/
│   │   ├── azureResources.ts        # Full resource catalog with categories, types, docs, tooltips
│   │   ├── templates.ts             # Pre-built architecture templates
│   │   ├── pricingData.ts           # Static pricing lookup table for cost estimation
│   │   └── validationRules.ts       # Dependency & security validation rules
│   ├── generators/
│   │   ├── bicepGenerator.ts        # Canvas state → Bicep code
│   │   ├── terraformGenerator.ts    # Canvas state → Terraform HCL
│   │   └── optimizer.ts             # Best-practice optimization logic
│   ├── parsers/
│   │   ├── bicepParser.ts           # Parse .bicep → canvas state
│   │   └── terraformParser.ts       # Parse .tf → canvas state
│   ├── store/
│   │   ├── useAppStore.ts           # Zustand store: theme, mode, panels, tabs
│   │   ├── useResourceStore.ts      # Zustand store: selected resources, RGs, properties
│   │   ├── useCanvasStore.ts        # Zustand store: nodes, edges, layout
│   │   └── useHistoryStore.ts       # Zustand store: undo/redo stack, snapshots
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces
│   └── utils/
│       ├── codeFormatter.ts         # Code formatting utilities
│       ├── layoutEngine.ts          # Auto-layout with dagre
│       ├── urlEncoder.ts            # lz-string compression for shareable URLs
│       ├── imageExporter.ts         # Canvas → PNG/SVG export
│       └── pdfExporter.ts           # Full project → PDF report
```

---

## Implementation Order

1. **scaffold-project** — get the project running with all deps
2. **resource-data** — define the catalog (no UI dependency)
3. **app-shell** + **dark-mode** + **toolbar** — layout skeleton
4. **accordion-menu** + **resource-checkboxes** + **resource-tooltips** — left panel
5. **canvas-setup** + **resource-nodes** + **resource-group-nodes** — basic canvas
6. **drag-drop** + **connection-lines** + **context-menu-node/canvas/edge** — canvas interactions
7. **bicep-generator** + **terraform-generator** + **code-panel** + **live-sync** — code output
8. **add-remove-rg** + **resource-group-selector** — resource group management
9. **export-script** + **export-json** + **import-script** + **import-json** — I/O
10. **optimize-engine** + **optimize-diff** — optimization
11. **responsive-layout** + **keyboard-shortcuts** + **auto-layout** + **search-filter** — core polish
12. **onboarding-tour** + **command-palette** + **help-panel** — discoverability (Phase 9a)
13. **template-gallery** — starter architectures (Phase 9b)
14. **property-panel** — resource configuration editor (Phase 9c)
15. **cost-estimator** — pricing estimates (Phase 9d)
16. **validation-panel** — errors & warnings (Phase 9e)
17. **undo-redo** + **version-snapshots** — history management (Phase 9f)
18. **shareable-url** + **export-image** + **export-pdf** — sharing (Phase 9g)
19. **drag-from-sidebar** — drag resources onto canvas (Phase 9h)
20. **multi-select** + **copy-paste-nodes** — bulk operations (Phase 9i)
21. **favorites** + **recently-used** — quick access (Phase 9j)
22. **smooth-animations** + **toast-notifications** — micro-interactions (Phase 9k)
23. **status-bar** — info footer (Phase 9l)
24. **accessibility** — WCAG 2.1 AA compliance (Phase 9m)
25. **pwa-support** — offline & installable (Phase 9n)
26. **multi-project** — tabbed projects (Phase 9o)

---

## Key Design Decisions

1. **No backend**: All parsing, generation, and optimization happens in-browser via TypeScript
2. **Zustand over Redux**: Simpler API, less boilerplate, works naturally with React Flow
3. **React Flow for canvas**: Industry-standard for node-based editors; built-in support for grouping, custom nodes, edges, context menus, minimap
4. **Monaco for code**: Same editor as VS Code; Bicep and HCL syntax highlighting available
5. **shadcn/ui**: Not a component library — copies components into your project for full control; built on Radix UI for accessibility
6. **Dagre for auto-layout**: Well-proven algorithm for directed acyclic graph layout

---

## Notes & Risks

- **Bicep/Terraform parsing** is complex; initial import will support a structured subset and improve iteratively
- **Optimize engine** applies rule-based heuristics, not AI — keeps it fully offline/browser-based
- **Resource catalog** starts with ~50 resources across 8 categories; extensible by adding entries to `azureResources.ts`
- **Connection inference**: When a user adds related resources (e.g., VM + VNet), the app suggests connections automatically based on known Azure dependency patterns
