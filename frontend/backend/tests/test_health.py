def test_health_envelope(client):
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ok"
    assert body["error"] is None
    assert "request_id" in body["meta"]


def test_module_stub_mounted(client):
    resp = client.get("/api/v1/patients/ping")
    assert resp.status_code == 200
    assert resp.json()["data"]["module"] == "patients"
