provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-terraform"
  location = "Germany West Central"
}

variable "MEDIACLOUD_API_TOKEN" {
  type = string
  description = "The API token for the Media Cloud API"
}

variable "ACLED_EMAIL" {
  type = string
  description = "The email for the ACLED API"
}

variable "ACLED_KEY" {
  type = string
  description = "The API token for the ACLED API"
}

resource "azurerm_container_group" "media_impact_monitor" {
  name                = "media-impact-monitor"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"

  container {
    name   = "media-impact-monitor"
    image  = "socialchangelab/media-impact-monitor:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }

    environment_variables = {
      "MEDIACLOUD_API_TOKEN" = "your-api"
    }
  }

  ip_address_type = "Public"
}

output "media_impact_monitor_ip" {
  value = azurerm_container_group.media_impact_monitor.ip_address
}
