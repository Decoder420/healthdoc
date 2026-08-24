"""Prometheus exposure and cardinality contracts for issue #250."""


def test_metrics_exposes_normalized_health_request(client) -> None:
    assert client.get("/api/v1/health").status_code == 200

    response = client.get("/metrics")

    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    assert response.headers["content-type"].startswith("text/plain")
    assert "healthdoc_http_requests_total" in response.text
    assert 'route="/api/v1/health"' in response.text
    assert 'status="200"' in response.text


def test_metrics_uses_unmatched_label_instead_of_raw_unknown_path(client) -> None:
    marker = "patient-id-must-not-be-a-metric-label"
    assert client.get(f"/unknown/{marker}").status_code == 404

    response = client.get("/metrics")

    assert 'route="<unmatched>"' in response.text
    assert marker not in response.text
