FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /code

RUN apt-get update && apt-get install -y gcc libpq-dev && apt-get clean

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]