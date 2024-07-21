# backend/Dockerfile

FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Copy project files
COPY . .

# Expose the port that the app runs on
EXPOSE 8000

# Set Python path
ENV PYTHONPATH=/app:$PYTHONPATH

# Start the Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
