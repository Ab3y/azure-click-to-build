# Azure AI Services — CLI Command Reference

> **Verified against Azure CLI 2.67+.** All commands use the `az` CLI with the `cognitiveservices`, `search`, `ml`, and `bot` modules/extensions.
>
> 📖 Official docs: [Azure CLI Reference](https://learn.microsoft.com/cli/azure/) · [Azure AI Services](https://learn.microsoft.com/azure/ai-services/)

---

## Table of Contents

1. [Azure OpenAI Service](#1-azure-openai-service)
2. [Azure AI Services (Cognitive Services)](#2-azure-ai-services-cognitive-services)
3. [Azure AI Search](#3-azure-ai-search)
4. [Azure Machine Learning](#4-azure-machine-learning)
5. [Azure AI Document Intelligence](#5-azure-ai-document-intelligence)
6. [Azure AI Speech](#6-azure-ai-speech)
7. [Azure AI Vision](#7-azure-ai-vision)
8. [Azure Bot Service](#8-azure-bot-service)
9. [Appendix A: Common Patterns](#appendix-a-common-patterns)
10. [Appendix B: Quick Reference Table](#appendix-b-quick-reference-table)

---

## 1. Azure OpenAI Service

> 📖 [Azure OpenAI documentation](https://learn.microsoft.com/azure/ai-services/openai/)

### Prerequisites

```bash
# Ensure the cognitiveservices commands are available (built-in to az CLI)
az extension add --name cognitiveservices --upgrade

# Verify CLI version
az version
```

### Create / Deploy

```bash
# Create an Azure OpenAI resource
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind OpenAI \
  --sku S0 \
  --location eastus \
  --custom-domain <custom-domain-name>

# Deploy a model (e.g., GPT-4o)
az cognitiveservices account deployment create \
  --name <account-name> \
  --resource-group <rg-name> \
  --deployment-name <deployment-name> \
  --model-name gpt-4o \
  --model-version "2024-08-06" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard

# Deploy an embedding model
az cognitiveservices account deployment create \
  --name <account-name> \
  --resource-group <rg-name> \
  --deployment-name text-embedding-ada-002 \
  --model-name text-embedding-ada-002 \
  --model-version "2" \
  --model-format OpenAI \
  --sku-capacity 10 \
  --sku-name Standard
```

### List / View

```bash
# List all OpenAI resources in a resource group
az cognitiveservices account list \
  --resource-group <rg-name> \
  --query "[?kind=='OpenAI']" -o table

# Show resource details
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name>

# List deployments
az cognitiveservices account deployment list \
  --name <account-name> \
  --resource-group <rg-name> -o table

# Show deployment details
az cognitiveservices account deployment show \
  --name <account-name> \
  --resource-group <rg-name> \
  --deployment-name <deployment-name>

# List available models in a region
az cognitiveservices model list \
  --location eastus \
  --query "[?model.name=='gpt-4o']" -o table

# Get API keys
az cognitiveservices account keys list \
  --name <account-name> \
  --resource-group <rg-name>

# Get the endpoint URL
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv

# List available SKUs for the resource
az cognitiveservices account list-skus \
  --name <account-name> \
  --resource-group <rg-name>
```

### Update / Modify

```bash
# Scale deployment capacity (update token-per-minute limit)
az cognitiveservices account deployment create \
  --name <account-name> \
  --resource-group <rg-name> \
  --deployment-name <deployment-name> \
  --model-name gpt-4o \
  --model-version "2024-08-06" \
  --model-format OpenAI \
  --sku-capacity 20 \
  --sku-name Standard

# Regenerate API key
az cognitiveservices account keys regenerate \
  --name <account-name> \
  --resource-group <rg-name> \
  --key-name key1

# Add IP-based network rule
az cognitiveservices account network-rule add \
  --name <account-name> \
  --resource-group <rg-name> \
  --ip-address <ip-or-cidr>

# Update resource tags
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags environment=production team=ai
```

### Delete

```bash
# Delete a model deployment
az cognitiveservices account deployment delete \
  --name <account-name> \
  --resource-group <rg-name> \
  --deployment-name <deployment-name>

# Delete the OpenAI resource (soft-delete by default)
az cognitiveservices account delete \
  --name <account-name> \
  --resource-group <rg-name>

# Purge a soft-deleted resource (permanent — cannot be undone)
az cognitiveservices account purge \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

### Capacity & Quota

```bash
# Check quota and usage for a region
az cognitiveservices usage list \
  --location eastus -o table

# List soft-deleted accounts (recoverable)
az cognitiveservices account list-deleted

# Recover a soft-deleted account
az cognitiveservices account recover \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

---

## 2. Azure AI Services (Cognitive Services)

> 📖 [Azure AI Services documentation](https://learn.microsoft.com/azure/ai-services/)

Azure AI Services (formerly Cognitive Services) is an umbrella for multiple AI capabilities. You can create a **multi-service** resource or **single-service** resources depending on your needs.

### Create / Deploy

```bash
# Create a multi-service AI Services resource (access to multiple APIs)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind CognitiveServices \
  --sku S0 \
  --location eastus

# Create a single-service resource (examples)
# Text Analytics / Language
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind TextAnalytics \
  --sku S \
  --location eastus

# Translator
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind TextTranslation \
  --sku S1 \
  --location eastus

# Content Safety
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind ContentSafety \
  --sku S0 \
  --location eastus
```

### List / View

```bash
# List all Cognitive Services resources
az cognitiveservices account list \
  --resource-group <rg-name> -o table

# List resources of a specific kind
az cognitiveservices account list \
  --resource-group <rg-name> \
  --query "[?kind=='TextAnalytics']" -o table

# Show resource details
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name>

# Get API keys
az cognitiveservices account keys list \
  --name <account-name> \
  --resource-group <rg-name>

# Get the endpoint
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv

# List available kinds in a region
az cognitiveservices account list-kinds -o table
```

### Update / Modify

```bash
# Update SKU
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --sku-name S1

# Update tags
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags environment=staging project=nlp

# Enable system-assigned managed identity
az cognitiveservices account identity assign \
  --name <account-name> \
  --resource-group <rg-name>

# Add VNet network rule
az cognitiveservices account network-rule add \
  --name <account-name> \
  --resource-group <rg-name> \
  --subnet <subnet-resource-id>

# Remove a network rule
az cognitiveservices account network-rule remove \
  --name <account-name> \
  --resource-group <rg-name> \
  --ip-address <ip-or-cidr>

# Set default network action (Allow or Deny)
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --custom-domain <domain-name> \
  --api-properties "{\"networkAcls\":{\"defaultAction\":\"Deny\"}}"
```

### Delete

```bash
# Delete
az cognitiveservices account delete \
  --name <account-name> \
  --resource-group <rg-name>

# Purge (permanent)
az cognitiveservices account purge \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

---

## 3. Azure AI Search

> 📖 [Azure AI Search documentation](https://learn.microsoft.com/azure/search/)

### Prerequisites

```bash
# The search module is built into the az CLI — no extension needed
az search --help
```

### Create / Deploy

```bash
# Create a search service
az search service create \
  --name <search-name> \
  --resource-group <rg-name> \
  --sku standard \
  --location eastus \
  --partition-count 1 \
  --replica-count 1

# Create a free-tier search service (one per subscription)
az search service create \
  --name <search-name> \
  --resource-group <rg-name> \
  --sku free \
  --location eastus

# Create with semantic search enabled (standard tier and above)
az search service create \
  --name <search-name> \
  --resource-group <rg-name> \
  --sku standard \
  --location eastus \
  --semantic-search free
```

### List / View

```bash
# List search services in a resource group
az search service list --resource-group <rg-name> -o table

# Show service details
az search service show \
  --name <search-name> \
  --resource-group <rg-name>

# Get admin keys
az search admin-key show \
  --service-name <search-name> \
  --resource-group <rg-name>

# List query keys
az search query-key list \
  --service-name <search-name> \
  --resource-group <rg-name>
```

### Update / Modify

```bash
# Scale up replicas and partitions
az search service update \
  --name <search-name> \
  --resource-group <rg-name> \
  --partition-count 2 \
  --replica-count 2

# Create a new query key
az search query-key create \
  --service-name <search-name> \
  --resource-group <rg-name> \
  --name <key-name>

# Delete a query key
az search query-key delete \
  --service-name <search-name> \
  --resource-group <rg-name> \
  --key-value <key-value>

# Regenerate admin key
az search admin-key renew \
  --service-name <search-name> \
  --resource-group <rg-name> \
  --key-kind primary

# Enable/disable public network access
az search service update \
  --name <search-name> \
  --resource-group <rg-name> \
  --public-access disabled
```

### Private Endpoint & Networking

```bash
# List private endpoint connections
az search private-endpoint-connection list \
  --service-name <search-name> \
  --resource-group <rg-name>

# Show a specific private endpoint connection
az search private-endpoint-connection show \
  --service-name <search-name> \
  --resource-group <rg-name> \
  --name <pe-connection-name>

# List shared private link resources (for indexer connections)
az search shared-private-link-resource list \
  --service-name <search-name> \
  --resource-group <rg-name>

# Create a shared private link resource
az search shared-private-link-resource create \
  --service-name <search-name> \
  --resource-group <rg-name> \
  --name <link-name> \
  --privateLinkResourceId <target-resource-id> \
  --group-id blob \
  --request-message "Please approve"
```

### Delete

```bash
# Delete a search service
az search service delete \
  --name <search-name> \
  --resource-group <rg-name> \
  --yes
```

---

## 4. Azure Machine Learning

> 📖 [Azure Machine Learning documentation](https://learn.microsoft.com/azure/machine-learning/)

### Prerequisites

```bash
# Install/upgrade the ML extension (required)
az extension add --name ml --upgrade

# Verify
az ml --help
```

### Create / Deploy

```bash
# Create an ML workspace
az ml workspace create \
  --name <workspace-name> \
  --resource-group <rg-name> \
  --location eastus

# Create workspace with existing resources
az ml workspace create \
  --name <workspace-name> \
  --resource-group <rg-name> \
  --location eastus \
  --storage-account <storage-id> \
  --key-vault <keyvault-id> \
  --application-insights <appinsights-id> \
  --container-registry <acr-id>

# Create a compute instance (dev VM)
az ml compute create \
  --name <compute-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --type ComputeInstance \
  --size Standard_DS3_v2

# Create a compute cluster (training)
az ml compute create \
  --name <cluster-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --type AmlCompute \
  --size Standard_DS3_v2 \
  --min-instances 0 \
  --max-instances 4

# Create an online endpoint (inference)
az ml online-endpoint create \
  --name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>

# Create an online deployment (attach model to endpoint)
az ml online-deployment create \
  --name <deployment-name> \
  --endpoint-name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --file deployment.yml

# Create a batch endpoint
az ml batch-endpoint create \
  --name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>

# Register a model
az ml model create \
  --name <model-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --path <local-model-path> \
  --type custom_model

# Create an environment
az ml environment create \
  --name <env-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --file environment.yml
```

### List / View

```bash
# List workspaces
az ml workspace list --resource-group <rg-name> -o table

# Show workspace details
az ml workspace show \
  --name <workspace-name> \
  --resource-group <rg-name>

# List compute resources
az ml compute list \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table

# Show compute details
az ml compute show \
  --name <compute-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>

# List online endpoints
az ml online-endpoint list \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table

# Show endpoint details
az ml online-endpoint show \
  --name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>

# List online deployments
az ml online-deployment list \
  --endpoint-name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table

# List registered models
az ml model list \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table

# List environments
az ml environment list \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table

# List jobs (training runs)
az ml job list \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> -o table
```

### Update / Modify

```bash
# Update workspace tags
az ml workspace update \
  --name <workspace-name> \
  --resource-group <rg-name> \
  --tags environment=production

# Scale a compute cluster
az ml compute update \
  --name <cluster-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --max-instances 8

# Update traffic allocation on an endpoint
az ml online-endpoint update \
  --name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --traffic "<deployment-name>=100"

# Start a compute instance
az ml compute start \
  --name <compute-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>

# Stop a compute instance
az ml compute stop \
  --name <compute-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name>
```

### Delete

```bash
# Delete a workspace
az ml workspace delete \
  --name <workspace-name> \
  --resource-group <rg-name> \
  --yes

# Delete compute
az ml compute delete \
  --name <compute-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --yes

# Delete an online endpoint (and all its deployments)
az ml online-endpoint delete \
  --name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --yes

# Delete a specific deployment
az ml online-deployment delete \
  --name <deployment-name> \
  --endpoint-name <endpoint-name> \
  --resource-group <rg-name> \
  --workspace-name <workspace-name> \
  --yes
```

---

## 5. Azure AI Document Intelligence

> 📖 [Azure AI Document Intelligence documentation](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
>
> Formerly known as **Azure Form Recognizer**. The CLI kind is still `FormRecognizer`.

### Create / Deploy

```bash
# Create a Document Intelligence resource (free tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind FormRecognizer \
  --sku F0 \
  --location eastus

# Create a Document Intelligence resource (paid tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind FormRecognizer \
  --sku S0 \
  --location eastus
```

### List / View

```bash
# List Document Intelligence resources
az cognitiveservices account list \
  --resource-group <rg-name> \
  --query "[?kind=='FormRecognizer']" -o table

# Show details
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name>

# Get API keys
az cognitiveservices account keys list \
  --name <account-name> \
  --resource-group <rg-name>

# Get endpoint
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv
```

### Update / Modify

```bash
# Upgrade SKU
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --sku-name S0

# Regenerate key
az cognitiveservices account keys regenerate \
  --name <account-name> \
  --resource-group <rg-name> \
  --key-name key1

# Update tags
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags project=document-processing
```

### Delete

```bash
az cognitiveservices account delete \
  --name <account-name> \
  --resource-group <rg-name>

az cognitiveservices account purge \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

---

## 6. Azure AI Speech

> 📖 [Azure AI Speech documentation](https://learn.microsoft.com/azure/ai-services/speech-service/)

### Create / Deploy

```bash
# Create a Speech Services resource (free tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind SpeechServices \
  --sku F0 \
  --location eastus

# Create a Speech Services resource (paid tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind SpeechServices \
  --sku S0 \
  --location eastus
```

### List / View

```bash
# List Speech resources
az cognitiveservices account list \
  --resource-group <rg-name> \
  --query "[?kind=='SpeechServices']" -o table

# Show details
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name>

# Get keys
az cognitiveservices account keys list \
  --name <account-name> \
  --resource-group <rg-name>

# Get endpoint
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv
```

### Update / Modify

```bash
# Upgrade from free to paid
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --sku-name S0

# Regenerate key
az cognitiveservices account keys regenerate \
  --name <account-name> \
  --resource-group <rg-name> \
  --key-name key1

# Update tags
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags project=speech-app
```

### Custom Speech ⚠️ Preview

> Custom Speech model management is primarily done via the [Speech Studio](https://speech.microsoft.com/) portal or REST API. The CLI supports resource-level operations shown above.

### Delete

```bash
az cognitiveservices account delete \
  --name <account-name> \
  --resource-group <rg-name>

az cognitiveservices account purge \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

---

## 7. Azure AI Vision

> 📖 [Azure AI Vision documentation](https://learn.microsoft.com/azure/ai-services/computer-vision/)

### Create / Deploy

```bash
# Create a Computer Vision resource (free tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind ComputerVision \
  --sku F0 \
  --location eastus

# Create a Computer Vision resource (paid tier)
az cognitiveservices account create \
  --name <account-name> \
  --resource-group <rg-name> \
  --kind ComputerVision \
  --sku S1 \
  --location eastus
```

### List / View

```bash
# List Vision resources
az cognitiveservices account list \
  --resource-group <rg-name> \
  --query "[?kind=='ComputerVision']" -o table

# Show details
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name>

# Get keys
az cognitiveservices account keys list \
  --name <account-name> \
  --resource-group <rg-name>

# Get endpoint
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv
```

### Update / Modify

```bash
# Upgrade SKU
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --sku-name S1

# Regenerate key
az cognitiveservices account keys regenerate \
  --name <account-name> \
  --resource-group <rg-name> \
  --key-name key1

# Update tags
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags project=vision-app
```

### Delete

```bash
az cognitiveservices account delete \
  --name <account-name> \
  --resource-group <rg-name>

az cognitiveservices account purge \
  --name <account-name> \
  --resource-group <rg-name> \
  --location eastus
```

---

## 8. Azure Bot Service

> 📖 [Azure Bot Service documentation](https://learn.microsoft.com/azure/bot-service/)

### Create / Deploy

```bash
# Create a web app bot
az bot create \
  --name <bot-name> \
  --resource-group <rg-name> \
  --kind webapp \
  --sku S1 \
  --location global \
  --appid <microsoft-app-id> \
  --password <microsoft-app-password>

# Create a registration-only bot (BYO hosting)
az bot create \
  --name <bot-name> \
  --resource-group <rg-name> \
  --kind registration \
  --sku F0 \
  --location global \
  --appid <microsoft-app-id> \
  --endpoint <messaging-endpoint-url>
```

### List / View

```bash
# Show bot details
az bot show \
  --name <bot-name> \
  --resource-group <rg-name>

# List bots in a resource group
az bot list \
  --resource-group <rg-name> -o table

# Get the bot's messaging endpoint
az bot show \
  --name <bot-name> \
  --resource-group <rg-name> \
  --query "properties.endpoint" -o tsv
```

### Update / Modify

```bash
# Update the messaging endpoint
az bot update \
  --name <bot-name> \
  --resource-group <rg-name> \
  --endpoint <new-endpoint-url>

# Update tags
az bot update \
  --name <bot-name> \
  --resource-group <rg-name> \
  --tags environment=production

# Configure a channel (e.g., Microsoft Teams)
az bot msteams create \
  --name <bot-name> \
  --resource-group <rg-name>

# Configure Slack channel
az bot slack create \
  --name <bot-name> \
  --resource-group <rg-name> \
  --client-id <slack-client-id> \
  --client-secret <slack-client-secret> \
  --verification-token <slack-verification-token>

# Configure Direct Line channel
az bot directline create \
  --name <bot-name> \
  --resource-group <rg-name>

# Show Direct Line keys
az bot directline show \
  --name <bot-name> \
  --resource-group <rg-name>
```

### Delete

```bash
# Delete a bot
az bot delete \
  --name <bot-name> \
  --resource-group <rg-name>

# Remove a channel
az bot msteams delete \
  --name <bot-name> \
  --resource-group <rg-name>
```

---

## Appendix A: Common Patterns

### Private Endpoints for AI Services

```bash
# 1. Disable public access on the AI service
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --public-network-access Disabled

# 2. Create a private endpoint
az network private-endpoint create \
  --name <pe-name> \
  --resource-group <rg-name> \
  --vnet-name <vnet-name> \
  --subnet <subnet-name> \
  --private-connection-resource-id $(az cognitiveservices account show \
    --name <account-name> \
    --resource-group <rg-name> \
    --query id -o tsv) \
  --group-id account \
  --connection-name <connection-name>

# 3. Create a private DNS zone
az network private-dns zone create \
  --resource-group <rg-name> \
  --name privatelink.cognitiveservices.azure.com

# 4. Link DNS zone to VNet
az network private-dns link vnet create \
  --resource-group <rg-name> \
  --zone-name privatelink.cognitiveservices.azure.com \
  --name <link-name> \
  --virtual-network <vnet-name> \
  --registration-enabled false

# 5. Create DNS zone group for automatic record registration
az network private-endpoint dns-zone-group create \
  --resource-group <rg-name> \
  --endpoint-name <pe-name> \
  --name default \
  --private-dns-zone privatelink.cognitiveservices.azure.com \
  --zone-name cognitiveservices
```

### Managed Identity Setup

```bash
# Enable system-assigned managed identity on an AI service
az cognitiveservices account identity assign \
  --name <account-name> \
  --resource-group <rg-name>

# Get the principal ID
az cognitiveservices account show \
  --name <account-name> \
  --resource-group <rg-name> \
  --query "identity.principalId" -o tsv

# Assign a role (e.g., Storage Blob Data Reader for RAG scenarios)
az role assignment create \
  --assignee <principal-id> \
  --role "Storage Blob Data Reader" \
  --scope <storage-account-resource-id>

# Assign Cognitive Services User role to an app/user
az role assignment create \
  --assignee <app-or-user-principal-id> \
  --role "Cognitive Services OpenAI User" \
  --scope $(az cognitiveservices account show \
    --name <account-name> \
    --resource-group <rg-name> \
    --query id -o tsv)
```

### Diagnostic Settings

```bash
# Send AI service logs and metrics to Log Analytics
az monitor diagnostic-settings create \
  --name <setting-name> \
  --resource $(az cognitiveservices account show \
    --name <account-name> \
    --resource-group <rg-name> \
    --query id -o tsv) \
  --workspace <log-analytics-workspace-id> \
  --logs '[{"categoryGroup":"allLogs","enabled":true}]' \
  --metrics '[{"category":"AllMetrics","enabled":true}]'

# Send logs to a Storage Account for archival
az monitor diagnostic-settings create \
  --name <setting-name> \
  --resource $(az cognitiveservices account show \
    --name <account-name> \
    --resource-group <rg-name> \
    --query id -o tsv) \
  --storage-account <storage-account-id> \
  --logs '[{"categoryGroup":"allLogs","enabled":true,"retentionPolicy":{"enabled":true,"days":90}}]'
```

### Tagging Best Practices

```bash
# Tag resources for cost tracking and governance
az cognitiveservices account update \
  --name <account-name> \
  --resource-group <rg-name> \
  --tags \
    environment=production \
    team=ai-platform \
    cost-center=12345 \
    project=chatbot

# Tag a resource group
az group update \
  --name <rg-name> \
  --tags \
    environment=production \
    department=engineering

# List resources by tag
az resource list \
  --tag environment=production \
  --query "[?type=='Microsoft.CognitiveServices/accounts']" -o table
```

### Cost Management

```bash
# Show accumulated costs for a resource group (current billing period)
az consumption usage list \
  --start-date <YYYY-MM-DD> \
  --end-date <YYYY-MM-DD> \
  --query "[?contains(instanceName, '<account-name>')]" -o table

# Set a budget for AI spending
az consumption budget create \
  --budget-name <budget-name> \
  --resource-group <rg-name> \
  --amount 500 \
  --time-grain Monthly \
  --start-date <YYYY-MM-DD> \
  --end-date <YYYY-MM-DD> \
  --category Cost

# List existing budgets
az consumption budget list --resource-group <rg-name> -o table
```

---

## Appendix B: Quick Reference Table

| Service | CLI Kind | Common SKUs | Documentation |
|---------|----------|-------------|---------------|
| Azure OpenAI | `OpenAI` | S0 | [learn.microsoft.com/azure/ai-services/openai/](https://learn.microsoft.com/azure/ai-services/openai/) |
| AI Services (Multi) | `CognitiveServices` | S0 | [learn.microsoft.com/azure/ai-services/](https://learn.microsoft.com/azure/ai-services/) |
| AI Search | *(separate: `az search`)* | free, basic, standard, standard2, standard3 | [learn.microsoft.com/azure/search/](https://learn.microsoft.com/azure/search/) |
| ML Workspace | *(separate: `az ml`)* | *(workspace-level)* | [learn.microsoft.com/azure/machine-learning/](https://learn.microsoft.com/azure/machine-learning/) |
| Speech | `SpeechServices` | F0, S0 | [learn.microsoft.com/azure/ai-services/speech-service/](https://learn.microsoft.com/azure/ai-services/speech-service/) |
| Vision | `ComputerVision` | F0, S1 | [learn.microsoft.com/azure/ai-services/computer-vision/](https://learn.microsoft.com/azure/ai-services/computer-vision/) |
| Document Intelligence | `FormRecognizer` | F0, S0 | [learn.microsoft.com/azure/ai-services/document-intelligence/](https://learn.microsoft.com/azure/ai-services/document-intelligence/) |
| Language | `TextAnalytics` | F0, S | [learn.microsoft.com/azure/ai-services/language-service/](https://learn.microsoft.com/azure/ai-services/language-service/) |
| Translator | `TextTranslation` | F0, S1 | [learn.microsoft.com/azure/ai-services/translator/](https://learn.microsoft.com/azure/ai-services/translator/) |
| Content Safety | `ContentSafety` | S0 | [learn.microsoft.com/azure/ai-services/content-safety/](https://learn.microsoft.com/azure/ai-services/content-safety/) |
| Bot Service | *(separate: `az bot`)* | F0, S1 | [learn.microsoft.com/azure/bot-service/](https://learn.microsoft.com/azure/bot-service/) |

---

> **Tip:** Use `az interactive` for an auto-complete shell experience, or append `--help` to any command for full usage details.
>
> **Tip:** Set defaults to avoid repeating parameters:
> ```bash
> az configure --defaults group=<rg-name> location=eastus
> ```

---

*Last updated: 2025. Verified against Azure CLI 2.67+.*
