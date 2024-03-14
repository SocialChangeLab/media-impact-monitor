# build it: docker build -t mim .
# run it: docker run -e MEDIACLOUD_API_TOKEN="${MEDIACLOUD_API_TOKEN}" -e ACLED_EMAIL="${ACLED_EMAIL}" -e ACLED_KEY="${ACLED_KEY}" mim
FROM python:3.10-slim
# install poetry
RUN pip install --upgrade pip
RUN pip install poetry
# copy the poetry files and install the dependencies
COPY backend-python/poetry.lock backend-python/pyproject.toml /app/backend-python/
WORKDIR /app/backend-python
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi
# copy the rest of the files and set the working directory
WORKDIR /app/
COPY . /app/
WORKDIR /app/backend-python
# run the application
CMD ["uvicorn", "media_impact_monitor.api:app", "--host", "0.0.0.0", "--port", "8000"]
# OCI Labels as per https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL org.opencontainers.image.title="media-impact-monitor"
LABEL org.opencontainers.image.description="Media Impact Monitor"
LABEL org.opencontainers.image.authors="Social Change Lab"
LABEL org.opencontainers.image.url="https://hub.docker.com/repository/docker/socialchangelab/media-impact-monitor"
LABEL org.opencontainers.image.source="https://github.com/SocialChangeLab/media-impact-monitor"
LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.revision=${VCS_REF}
