#!/usr/bin/bash
## postCreateCommand.sh

echo 'eval "$(starship init bash)"' >> ~/.bashrc;
cd backend-python && poetry install; # install everything once at setup
