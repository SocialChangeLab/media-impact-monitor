FROM --platform=linux/amd64 ubuntu:22.04

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get -y install \
    git \
    curl \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Install and setup poetry
RUN pip install poetry
RUN poetry config virtualenvs.create true

# Install starship terminal prompt
RUN sh -c "$(curl -fsSL https://starship.rs/install.sh)" -- "--yes" && echo 'eval "$(starship init bash)"' >> ~/.bashrc

CMD ["bash"]
