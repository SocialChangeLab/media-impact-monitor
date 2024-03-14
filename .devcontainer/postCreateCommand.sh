#!/usr/bin/bash
## postCreateCommand.sh

## Node Startup 
# https://github.com/devcontainers/features/tree/main/src/node#using-nvm-from-postcreatecommand-or-another-lifecycle-command
# . ${NVM_DIR}/nvm.sh && nvm install --lts

## R ------------------------------------

## R system dependencies
sudo apt-get update
sudo apt-get install -y \
  cmake

## tidyverse dependencies (from https://packagemanager.posit.co/client/#/repos/cran/packages/overview?search=tidyverse)
sudo apt-get install -y \
  libicu-dev \
  make \
  libcurl4-openssl-dev \
  libssl-dev \
  zlib1g-dev \
  libfontconfig1-dev \
  libfreetype6-dev \
  libfribidi-dev \
  libharfbuzz-dev \
  libjpeg-dev \
  libpng-dev \
  libtiff-dev \
  pandoc \
  libxml2-dev

## setup R env prefs
# ~ = /home/vscode/ for Codespaces
cp /workspaces/media-impact-monitor/.devcontainer/R/.Rprofile ~/.Rprofile
cp /workspaces/media-impact-monitor/.devcontainer/R/.Renviron ~/.Renviron

# https://docs.rstudio.com/ide/server-pro/session-user-settings.html
cp /workspaces/media-impact-monitor/.devcontainer/R/rstudio-prefs.json ~/.config/rstudio/rstudio-prefs.json

mkdir -p ~/.config/rstudio/keybindings
cp /workspaces/media-impact-monitor/.devcontainer/R/addins.json ~/.config/rstudio/keybindings/addins.json
mkdir -p ~/.config/rstudio/snippets
cp /workspaces/media-impact-monitor/.devcontainer/R/r.snippets ~/.config/rstudio/snippets/r.snippets

## Restore renv library from lockfile
Rscript -e 'renv::restore(project	= "/workspaces/media-impact-monitor/backend-R")'

####

echo 'eval "$(starship init bash)"' >> ~/.bashrc
cd backend-python && poetry install # install everything once at setup