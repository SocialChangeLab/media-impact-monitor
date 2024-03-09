terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform"
    storage_account_name = "terraformstatestoragedfx"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-terraform"
  location = "Germany West Central"
}

variable "DOCKER_IMAGE" {
  type        = string
  description = "The docker image to deploy"
}

variable "MEDIACLOUD_API_TOKEN" {
  type        = string
  description = "The API token for the Media Cloud API"
}

variable "ACLED_EMAIL" {
  type        = string
  description = "The email for the ACLED API"
}

variable "ACLED_KEY" {
  type        = string
  description = "The API token for the ACLED API"
}

variable "ZENROWS_API_KEY" {
  type        = string
  description = "The API token for the Zenrows API"
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
