FROM python:3.9-slim

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates

WORKDIR /app

# Agregamos libssl-dev y libffi-dev para evitar errores de criptografía
RUN apt-get update && apt-get install -y \
    build-essential \
    libpoppler-cpp-dev \
    libssl-dev \
    libffi-dev \
    python3-dev

COPY requirements.txt .
# Actualizamos pip antes de instalar para evitar errores viejos
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]