# TraceRight Merge (Voltron)

> Enterprise platform combining Tax Intelligence, Supply Chain Optimization, Video Processing, and Construction CRM into one multi-tenant system.

## Architecture Overview

```
                    ┌─────────────────────────────────────────┐
                    │            VOLTRON PRIME                │
                    │         (Cloud Run - US Central)        │
                    └─────────────────┬───────────────────────┘
                                      │
        ┌─────────────┬───────────────┼───────────────┬─────────────┐
        ▼             ▼               ▼               ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐  ┌──────────┐
   │   Tax   │  │  Supply  │  │  Video Bob  │  │   CRM    │  │ BigQuery │
   │ Engine  │  │  Chain   │  │  (VEO 3)    │  │ Builder  │  │  Vault   │
   └─────────┘  └──────────┘  └─────────────┘  └──────────┘  └──────────┘
```

## Modules

| Module | Purpose | Status |
|--------|---------|--------|
| **Tax Engine** | CA S-Corp/LLC optimization, quarterly estimates, IRS compliance | 🔧 Building |
| **Supply Chain** | Material tracking, vendor arbitrage, inventory optimization | 🔧 Building |
| **Video Bob** | Job site monitoring via VEO 3, progress tracking, safety compliance | 🔧 Building |
| **Construction CRM** | Client management, project tracking, invoicing | 🔧 Building |

## Zero-Cost Strategy

This system is designed to minimize cloud costs through:

- **Cloud Run Scale-to-Zero**: $0 when idle
- **OpenStreetMap Fallback**: Free geocoding before Google Maps API
- **30-Day Caching**: Reduce API calls by 90%+
- **Vision API Batching**: Cut costs in half
- **No Redis**: In-memory caching via Cloud Run instances
- **BigQuery Free Tier**: 10GB/month included

## Quick Start

### Prerequisites

- Google Cloud account with billing enabled
- Project ID: `alldoing`
- Terraform installed (or use Google Cloud Shell)

### Deploy Infrastructure

```bash
# Option 1: Google Cloud Shell (recommended - no install needed)
# Go to https://console.cloud.google.com and click the >_ icon

# Option 2: Local deployment
brew install terraform
gcloud auth application-default login

# Clone and deploy
git clone https://github.com/corycates8298/traceright_merge1.git
cd traceright_merge1
terraform init
terraform plan
terraform apply
```

### Environment Variables

```bash
# Backend
GOOGLE_CLOUD_PROJECT=alldoing
REGION=us-central1
MAP_STRATEGY=ARBITRAGE_MODE

# Frontend
NEXT_PUBLIC_API_URL=https://alldoing-xxxxx-uc.a.run.app
```

## MCP Integration (AI Tentacles)

This project uses Model Context Protocol (MCP) servers for AI orchestration:

| MCP Server | Purpose |
|------------|---------|
| Slack MCP | War Room communication |
| Notion MCP | Knowledge base & documentation |
| GitHub MCP | Code management |
| Chart Server | Data visualization |
| Deep Wiki | Knowledge retrieval |

### Slack MCP Setup

```bash
# Install
npm install -g @anthropic-ai/mcp-server-slack

# Configure (~/Library/Application Support/Claude/claude_desktop_config.json)
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-YOUR-TOKEN",
        "SLACK_TEAM_ID": "T01234567"
      }
    }
  }
}
```

## War Room Channels (Slack)

```
#00-central-command  → Command & Control
#01-architect        → System Design
#02-builder          → Deployments & CI/CD
#03-creative         → UX/Content
#04-growth           → Marketing
#05-knowledge        → Documentation
```

## Project Structure (Target)

```
traceright_merge/
├── terraform/           # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── backend/             # Cloud Run API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tax/
│   │   │   ├── supply-chain/
│   │   │   ├── video-bob/
│   │   │   └── crm/
│   │   └── index.ts
│   └── Dockerfile
├── frontend/            # Next.js Dashboard
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
├── mcp/                 # MCP Server configs
└── docs/                # Documentation
```

## Development URLs

| Environment | URL |
|-------------|-----|
| Frontend (local) | http://localhost:3000 |
| Backend (Cloud Run) | `terraform output service_url` |
| Railway (staging) | https://traceright-development.up.railway.app |

## Cost Optimization Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   SmartAPIGateway                       │
└─────────────────────────┬───────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
    ┌─────────┐     ┌──────────┐    ┌───────────┐
    │  Cache  │────▶│   Free   │───▶│  Google   │
    │  Layer  │     │   Tier   │    │  Paid API │
    └─────────┘     └──────────┘    └───────────┘
    (30 days)       (OSM, etc.)     (Last resort)
```

## License

Proprietary - All rights reserved

## Contact

- Project: TraceRight Merge (Voltron)
- Status: Active Development
