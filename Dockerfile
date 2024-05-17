# build it: docker build -t socialchangelab/media-impact-monitor --build-arg VCS_REF=$(git rev-parse --short HEAD) --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') .
# run it: docker run -p 8000:8000 -e MEDIACLOUD_API_TOKEN="${MEDIACLOUD_API_TOKEN}" -e ACLED_EMAIL="${ACLED_EMAIL}" -e ACLED_KEY="${ACLED_KEY}" socialchangelab/media-impact-monitor
FROM --platform=linux/amd64 python:3.10-slim
# install poetry
RUN pip install --upgrade pip
RUN pip install poetry
# copy the poetry files and install the dependencies
COPY backend-python/poetry.lock backend-python/pyproject.toml backend-python/README.md /app/backend-python/
WORKDIR /app/backend-python
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi
# copy the rest of the files and set the working directory
WORKDIR /app/
COPY . /app/
WORKDIR /app/backend-python
# set git commit and build date
ARG VCS_REF
ARG BUILD_DATE
ENV VCS_REF=$VCS_REF
ENV BUILD_DATE=$BUILD_DATE
# run the application
ARG PORT=8000
CMD ["uvicorn", "media_impact_monitor.api:app", "--host", "0.0.0.0", "--port", "${PORT}"]
# OCI Labels as per https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL org.opencontainers.image.title="media-impact-monitor"
LABEL org.opencontainers.image.description="Media Impact Monitor"
LABEL org.opencontainers.image.authors="Social Change Lab"
LABEL org.opencontainers.image.url="https://hub.docker.com/repository/docker/socialchangelab/media-impact-monitor"
LABEL org.opencontainers.image.source="https://github.com/SocialChangeLab/media-impact-monitor"
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${VCS_REF}
