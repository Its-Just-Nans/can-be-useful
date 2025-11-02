FROM debian:bookworm

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl git sudo bash zsh \
    build-essential python3 python3-pip python3-venv \
    pkg-config libssl-dev libfontconfig1-dev liblzma-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

# Create developer user
ARG USERNAME=developer
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME
RUN groupadd --force n4n5
RUN useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -s /bin/bash
RUN usermod -aG sudo,n4n5 $USERNAME
RUN echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


# Give ownership of home
RUN sudo mkdir -p /workdir && chown -R "$USERNAME:n4n5" /workdir
RUN chown -R $USERNAME:n4n5 /home/$USERNAME

# change to $USERNAME
USER $USERNAME

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Copy from local project (if dotfiles are in ./dotfiles)
COPY --chown=$USERNAME:n4n5 . /home/$USERNAME/

# Load dotfiles (example: .bashrc, .zshrc, .gitconfig)
RUN if [ -f /home/$USERNAME/.bashrc ]; then \
        echo "source /home/$USERNAME/.bashrc" >> /home/$USERNAME/.bash_profile ; \
    fi

WORKDIR /workdir

CMD [ "bash" ]

# docker build . -t devdocker