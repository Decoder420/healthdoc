"""The diagnosis picker consumes the real ICD integration response."""
from __future__ import annotations

from app.diagnoses import router


async def test_icd_search_returns_the_integration_shape(monkeypatch, db):
    async def fake_search(query, *, db, limit):
        assert query == "hypertension"
        assert limit == 5
        return {
            "source": "local_catalog",
            "items": [
                {
                    "code": "BA00",
                    "title": "Essential hypertension",
                    "version": "icd11",
                    "icd_uri": "http://id.who.int/icd/entity/123",
                    "is_postcoordinable": False,
                }
            ],
        }

    monkeypatch.setattr(router._client, "search", fake_search)

    response = await router.search_icd(q="hypertension", limit=5, db=db)

    assert response.source == "local_catalog"
    assert response.items[0].code == "BA00"
