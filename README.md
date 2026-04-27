<div align="center">

# ☁️ Azure Click to Build

**Visually design Azure infrastructure and generate production-ready Bicep or Terraform code — 100% in your browser.**

[![Beta](https://img.shields.io/badge/status-beta-orange?style=flat-square)](https://github.com/Ab3y/azure-click-to-build)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

![Azure Click to Build](docs/screenshot.png)

## ✨ Features

- 🎨 **Visual drag-and-drop architecture canvas** with React Flow
- 🏗️ **48 Azure resources across 8 categories** — Compute, Networking, Storage, Databases, AI/ML, Identity & Security, Integration, DevOps
- 📝 **Live Bicep & Terraform code generation** with syntax highlighting via Monaco Editor
- 📦 **Resource group management** — create, resize, drag resources in and out
- 🔗 **Connection lines** showing resource dependencies
- 📋 **6 pre-built architecture templates** — 3-Tier Web, AKS Microservices, Serverless API, Data Pipeline, AI Chat App, Hub-Spoke Network
- 🌙 **Dark/light mode** with system preference detection
- ✅ **Real-time validation panel** — errors, warnings, and best-practice checks
- ⚡ **Optimize button** — applies Azure Well-Architected Framework recommendations
- 📥 **Import/Export** — `.bicep`, `.tf`, and JSON project files
- 💾 **Visual layout saved in code comments** — reload your diagram from the exported script
- 🔍 **Search and filter** resources in the sidebar
- 📐 **Auto-layout** with dagre algorithm
- ⌨️ **Keyboard shortcuts** — Ctrl+S, Delete, Escape, and more
- 🚫 **No login required** — no Azure account, no API keys, no backend
- 📖 **Direct links to official Microsoft Learn docs** for every resource

## 🚀 Quick Start

```bash
git clone https://github.com/Ab3y/azure-click-to-build.git
cd azure-click-to-build
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Canvas | [React Flow (@xyflow/react)](https://reactflow.dev/) |
| Code Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| State | [Zustand](https://zustand-demo.pmnd.rs/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |

## 📦 Azure Resource Categories

| Category | Resources | Examples |
|----------|-----------|----------|
| **Compute** | 8 | Virtual Machine, App Service, Function App, Container App, AKS, Container Instance, Static Web App, Batch |
| **Networking** | 7 | Virtual Network, Subnet, NSG, Load Balancer, Application Gateway, Front Door, DNS Zone |
| **Storage** | 5 | Storage Account, Blob Container, File Share, Data Lake, Managed Disk |
| **Databases** | 7 | SQL Database, Cosmos DB, PostgreSQL, MySQL, Redis Cache, SQL Managed Instance, Table Storage |
| **AI / ML** | 7 | OpenAI Service, AI Search, Machine Learning Workspace, Cognitive Services, Bot Service, Document Intelligence, Speech Service |
| **Identity & Security** | 5 | Key Vault, Managed Identity, Entra ID, Firewall, DDoS Protection |
| **Integration** | 5 | Service Bus, Event Hub, Event Grid, API Management, Logic App |
| **DevOps** | 4 | Container Registry, Application Insights, Log Analytics, Monitor |

> 📖 Every resource links directly to its [Microsoft Learn](https://learn.microsoft.com/azure/) documentation.

## 📋 Architecture Templates

| Template | Description |
|----------|-------------|
| **3-Tier Web App** | Classic web architecture with App Service frontend, API backend, and SQL Database — behind an Application Gateway with Key Vault for secrets. |
| **AKS Microservices** | Kubernetes-based microservices with AKS, Container Registry, Virtual Network, and monitoring via Log Analytics and Application Insights. |
| **Serverless API** | Event-driven API using Function App, API Management, Cosmos DB, and Service Bus — with Application Insights for observability. |
| **Data Pipeline** | End-to-end data platform with Data Lake Storage, Event Hub ingestion, Machine Learning workspace, and SQL Database for serving. |
| **AI Chat App** | Conversational AI stack with Azure OpenAI, AI Search (RAG), App Service frontend, Cosmos DB for chat history, and Key Vault for secrets. |
| **Hub-Spoke Network** | Enterprise networking topology with a central hub VNet (Firewall, VPN Gateway) peered to spoke VNets — with NSGs and DDoS Protection. |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Export code |
| `Delete` | Remove selected resource |
| `Ctrl+Z` | Undo *(coming soon)* |
| `Escape` | Close dialogs |
| Right-click | Context menu on canvas/resources |

## 📁 Project Structure

```
src/
├── App.tsx                        # Root application component
├── main.tsx                       # Vite entry point
├── index.css                      # Global styles (Tailwind)
├── assets/                        # Static images and SVGs
├── components/
│   ├── canvas/                    # React Flow canvas components
│   │   ├── FlowCanvas.tsx         # Main canvas with drag-and-drop
│   │   ├── ResourceNode.tsx       # Custom node for Azure resources
│   │   ├── ResourceGroupNode.tsx  # Grouping node for resource groups
│   │   ├── EdgeWithMenu.tsx       # Interactive edge connections
│   │   └── ContextMenu.tsx        # Right-click context menu
│   ├── code/
│   │   └── CodePanel.tsx          # Monaco editor for Bicep/Terraform
│   ├── dialogs/
│   │   ├── AddResourceGroupDialog.tsx
│   │   ├── ImportDialog.tsx
│   │   ├── OptimizeDiffDialog.tsx
│   │   └── TemplateGalleryDialog.tsx
│   ├── layout/
│   │   ├── AppShell.tsx           # Main layout wrapper
│   │   ├── StatusBar.tsx          # Bottom status bar
│   │   ├── ThemeToggle.tsx        # Dark/light mode switch
│   │   └── Toolbar.tsx            # Top toolbar with actions
│   ├── panels/
│   │   └── ValidationPanel.tsx    # Errors, warnings, best practices
│   └── sidebar/
│       ├── ResourceSidebar.tsx    # Resource category browser
│       ├── CategoryAccordion.tsx  # Collapsible category sections
│       ├── ResourceCheckbox.tsx   # Individual resource toggle
│       └── SearchFilter.tsx       # Search and filter input
├── data/
│   ├── azureResources.ts          # 48 Azure resource definitions
│   ├── templates.ts               # 6 architecture templates
│   └── validationRules.ts         # Validation rule definitions
├── generators/
│   ├── bicepGenerator.ts          # Bicep code generation
│   ├── terraformGenerator.ts      # Terraform code generation
│   └── optimizer.ts               # WAF optimization engine
├── hooks/
│   └── useKeyboardShortcuts.ts    # Keyboard shortcut bindings
├── parsers/                       # Import file parsers
├── store/
│   ├── useAppStore.ts             # Global app state (Zustand)
│   ├── useCanvasStore.ts          # Canvas/flow state
│   └── useResourceStore.ts        # Resource selection state
├── types/
│   └── index.ts                   # TypeScript type definitions
└── utils/
    ├── codeFormatter.ts           # Code formatting utilities
    ├── iconMap.ts                 # Resource icon mapping
    └── layoutEngine.ts            # Dagre auto-layout engine
```

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add my new feature"
   ```
4. **Push** to your fork and **open a Pull Request**

Please make sure your code passes the existing linter (`npm run lint`) before submitting.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🔗 Links

- 🌐 **Live Demo:** [azure-click-to-build.azurewebsites.net](https://azure-click-to-build.azurewebsites.net)
- 💻 **GitHub:** [github.com/Ab3y/azure-click-to-build](https://github.com/Ab3y/azure-click-to-build)
- 📘 **Azure CLI Reference:** [docs/azure-ai-cli-reference.md](docs/azure-ai-cli-reference.md)

---

<div align="center">
  Built with ❤️ for the Azure community
</div>
