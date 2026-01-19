# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

# Install system dependencies (gcc/libpq if needed for some python packages like psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements if it exists, otherwise we assume we might need to generate or install manually
# For now, I'll copy the whole directory and install. 
# Best practice: Copy requirements.txt first (if it exists). 
# I will check if requirements.txt exists in the next step, but for this 'write' I'll assume standard layout.
# If no requirements.txt, I'll assume usage of pip install based on code.
# But for robustness, let's copy the app code.

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy application code
COPY . .

# Create a non-root user for security
# RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
# USER appuser

# Cloud Run expects the app to listen on $PORT (default 8080)
CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT} --workers 2
