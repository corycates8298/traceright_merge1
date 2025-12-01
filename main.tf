# main.tf - Voltron Production-Grade Infrastructure
# Deploys the full enterprise backbone for the 'alldoing' project.
# ARCHITECTURE: Serverless GPU (Muscle) + Redis (Speed) + Vertex AI (Brain)

# --- PROTOCOL: VARIABLE DEFINITIONS ---
# All environment-specific values are declared here and provided via .tfvars
variable "gcp_project_id" {
  description = "The GCP project ID to deploy resources into."
  type        = string
}

variable "gcp_region" {
  description = "The GCP region for deployment."
  type        = string
  default     = "us-central1"
}

# --- TERRAFORM & PROVIDER CONFIGURATION ---

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# --- 1. FUTURE-PROOF API ENABLEMENT ---
# Enables the Neural Nervous System of the architecture.
resource "google_project_service" "run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "iam" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "storage" {
  service            = "storage.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "vertex" {
  service            = "aiplatform.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "redis" {
  service            = "redis.googleapis.com"
  disable_on_destroy = false
}
resource "google_project_service" "vpcaccess" {
  service            = "vpcaccess.googleapis.com"
  disable_on_destroy = false
}

# --- 2. THE SECURE NETWORK BRIDGE (VPC) ---
# Allows the Cloud Brain to talk to Redis and your 8TB Beast securely.
resource "google_compute_network" "vpc_network" {
  name                    = "voltron-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "vpc_subnetwork" {
  name          = "voltron-subnetwork"
  ip_cidr_range = "10.10.0.0/24"
  region        = var.gcp_region
  network       = google_compute_network.vpc_network.id
}

resource "google_vpc_access_connector" "vpc_connector" {
  name          = "voltron-connector"
  region        = var.gcp_region
  subnet {
    name = google_compute_subnetwork.vpc_subnetwork.name
  }
  machine_type  = "e2-micro"
  min_instances = 2
  max_instances = 3
  depends_on    = [google_project_service.vpcaccess]
}

# --- 3. THE VAULTS (INTELLIGENT STORAGE) ---
# Secure repositories for Video Bob and Tax Data.
resource "google_storage_bucket" "video_raw" {
  name          = "${var.gcp_project_id}-video-raw" # Protocol: Bucket names must be globally unique.
  location      = "US"
  force_destroy = true
  lifecycle_rule {
    condition { age = 30 }
    action { type = "Delete" }
  }
}

resource "google_storage_bucket" "tax_data" {
  name          = "${var.gcp_project_id}-tax-data-lake"
  location      = "US"
  force_destroy = true
}

resource "google_storage_bucket" "secure_docs" {
  name          = "${var.gcp_project_id}-secure-docs"
  location      = "US"
  force_destroy = true
}

# --- 4. IDENTITY (THE KEYMASTER) ---
resource "google_service_account" "prime_agent" {
  account_id   = "alldoing-prime-agent"
  display_name = "Alldoing Prime Agent"
}

# Grant the Agent permission to use Vertex AI and Storage
resource "google_project_iam_member" "agent_storage_admin" {
  project = var.gcp_project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.prime_agent.email}"
}

resource "google_project_iam_member" "agent_vertex_user" {
  project = var.gcp_project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.prime_agent.email}"
}

# --- 5. THE MUSCLE (GPU-POWERED CLOUD RUN) ---
# This hosts the Tax Engine and Heavy Compute.
resource "google_cloud_run_v2_service" "alldoing_service" {
  name     = "alldoing"
  location = var.gcp_region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.prime_agent.email

    scaling {
      min_instance_count = 0 # SCALE TO ZERO (Cost Efficiency)
      max_instance_count = 5
    }

    containers {
      # Using your actual container image from the repository
      image = "us-docker.pkg.dev/cloudrun/container/hello" # Placeholder - will be updated via gcloud builds submit

      # Resource allocation for HEAVY tasks
      resources {
        limits = {
          "cpu"    = "4"
          "memory" = "16Gi"
          # Uncomment below if you have GPU Quota approved in Google Cloud
          # "nvidia.com/gpu" = "1"
        }
      }
    }

    # Network configuration to talk to Redis
    vpc_access {
      connector = google_vpc_access_connector.vpc_connector.id
      egress    = "ALL_TRAFFIC"
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [google_project_service.run]
}

# --- 6. THE SPEED LAYER (REDIS) ---
# CRUSH THE COMPETITION: Real-time state management for truck icons & map tracking.
resource "google_redis_instance" "live_tracking_cache" {
  name               = "live-tracking-cache"
  tier               = "BASIC"
  memory_size_gb     = 1
  region             = var.gcp_region
  authorized_network = google_compute_network.vpc_network.id
  connect_mode       = "DIRECT_PEERING"

  depends_on = [google_project_service.redis]
}

# --- OUTPUTS ---
output "service_url" {
  value       = google_cloud_run_v2_service.alldoing_service.uri
  description = "The public URL of your Alldoing Voltron Core"
}

output "redis_ip" {
  value       = google_redis_instance.live_tracking_cache.host
  description = "Internal IP for the high-speed cache"
}

output "agent_email" {
  value       = google_service_account.prime_agent.email
  description = "Service Account for Vertex AI"
}

output "video_bucket" {
  value       = google_storage_bucket.video_raw.name
  description = "Video storage bucket"
}

output "tax_bucket" {
  value       = google_storage_bucket.tax_data.name
  description = "Tax data lake bucket"
}
