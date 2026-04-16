# Use a lightweight Python base image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.11-alpine AS builder

# Set the working directory
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy project files
COPY pyproject.toml uv.lock ./

# Install dependencies into a project-local .venv
# We add gunicorn explicitly as it's often not in dev dependencies but required for production
RUN uv sync --frozen --no-install-project --no-dev && \
    uv pip install gunicorn

# Final stage
FROM python:3.11-alpine

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /app/.venv /app/.venv
COPY . .

# Ensure the virtualenv is used
ENV PATH="/app/.venv/bin:$PATH"

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_DEBUG=False

# Expose the port
EXPOSE 8021

# Start the application with gunicorn as requested
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8021", "app:app"]
