variable "ARM_SUBSCRIPTION_ID" {}
variable "ARM_CLIENT_ID" {}
variable "ARM_CLIENT_SECRET" {}
variable "ARM_TENANT_ID" {}

variable "DOCKER_IMAGE" {}

variable "MEDIACLOUD_API_TOKEN" {}
variable "ACLED_EMAIL" {}
variable "ACLED_KEY" {}
variable "ZENROWS_API_KEY" {}

terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform"
    storage_account_name = "terraformstatestoragedfx"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  subscription_id = var.ARM_SUBSCRIPTION_ID
  client_id       = var.ARM_CLIENT_ID
  client_secret   = var.ARM_CLIENT_SECRET
  tenant_id       = var.ARM_TENANT_ID
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-terraform"
  location = "Germany West Central"
}

resource "azurerm_container_group" "media_impact_monitor" {
  name                = "media-impact-monitor"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"

  container {
    name   = "media-impact-monitor"
    image  = var.DOCKER_IMAGE
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }

    environment_variables = {
      MEDIACLOUD_API_TOKEN = var.MEDIACLOUD_API_TOKEN
      ACLED_EMAIL          = var.ACLED_EMAIL
      ACLED_KEY            = var.ACLED_KEY
      ZENROWS_API_KEY      = var.ZENROWS_API_KEY
    }
  }

  ip_address_type = "Public"
}

output "media_impact_monitor_ip" {
  value = azurerm_container_group.media_impact_monitor.ip_address
}
