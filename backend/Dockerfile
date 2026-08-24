FROM python:3.12-slim AS runtime
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

FROM runtime AS dev
COPY requirements-dev.txt ./
RUN pip install --no-cache-dir -r requirements-dev.txt
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM runtime AS prod
RUN useradd --create-home --uid 10001 healthdoc \
    && mkdir -p /var/log/healthdoc \
    && chown -R healthdoc:healthdoc /var/log/healthdoc
USER healthdoc
