# Production observability

The production Compose stack scrapes the internal backend `/metrics` endpoint
with Prometheus and provisions a read-only HealthDoc API dashboard in Grafana.
Neither Prometheus nor `/metrics` is published by Nginx. Grafana binds only to
the host loopback interface.

## Access

Set a unique `GRAFANA_ADMIN_PASSWORD` in the protected production environment
file. On the deployment host open `http://127.0.0.1:3001`, or forward it over
SSH without opening a firewall port:

```bash
ssh -L 3001:127.0.0.1:3001 operator@healthdoc-host
```

Change `GRAFANA_PORT` if 3001 is already allocated. Anonymous access and user
registration are disabled. Prometheus data is retained for 15 days in the
`prometheus-data` volume; Grafana configuration is kept in `grafana-data`.
Grafana update checks, plugin administration, and automatic plugin downloads
are disabled so the production container does not make unapproved background
network requests.

## Initial technical alerts

- `HealthDocBackendDown`: scrape unavailable for one minute (critical).
- `HealthDocHighErrorRate`: aggregate 5xx ratio above 1% for five minutes.
- `HealthDocHighP95Latency`: aggregate p95 latency above two seconds for five
  minutes.

These are service-health baselines, not clinical rules. Do not add a clinical
threshold (for example a critical lab value) without the responsible clinical
owner approving the value, escalation route, and coverage hours.

Prometheus evaluates alerts but this repository does not invent an on-call
receiver. Before go-live, the operator must connect the chosen Alertmanager or
managed notification channel and test one warning and one critical delivery.
