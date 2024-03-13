#!/usr/bin/bash
## postCreateCommand.sh

## Node Startup 
# https://github.com/devcontainers/features/tree/main/src/node#using-nvm-from-postcreatecommand-or-another-lifecycle-command
# . ${NVM_DIR}/nvm.sh && nvm install --lts

## R ---- 

## R system dependencies
sudo apt-get update && sudo apt-get install -y \
  libfribidi-dev \
  libharfbuzz-dev \
  cmake

## setup R env prefs
cp /workspaces/media-impact-monitor/.devcontainer/.Rprofile /home/vscode/.Rprofile

Rscript -e 'renv::restore(project	= "/workspaces/media-impact-monitor/backend-R")'

####

echo 'eval "$(starship init bash)"' >> ~/.bashrc
cd backend-python && poetry install # install everything once at setup