# HealthDoc API documentation (BA-W8-01)

The API is self-documenting via FastAPI/OpenAPI — this file is the human index.

## Live references (when the stack is up)
- Swagger UI: `https://localhost/api/v1/docs`
- OpenAPI JSON: `https://localhost/api/v1/openapi.json`
- Export a static copy: `curl -k https://localhost/api/v1/openapi.json > docs/openapi.json`

## Conventions (all endpoints)
- Response envelope: `{success, data, error, meta:{request_id}}` — see `common/envelope.py`.
- Auth: `Authorization: Bearer <Keycloak JWT>`; 401 = not logged in, 403 = wrong role/ABAC deny.
- Path `{id}` params are UUIDs; business identifiers are query/body only.
- Money as strings (`"50.00"`); timestamps ISO-8601 UTC.

## B1-owned surface
| Area | Endpoint(s) | Auth |
|---|---|---|
| Health | `/api/v1/health`, `/health/deep` | public |
| Users | `/api/v1/users` CRUD, `/{id}/activate`·`/deactivate` | admin |
| User requests | `/api/v1/user-requests` + approve/reject | admin/superadmin |
| Break-glass | `/api/v1/break-glass` | emergency/doctor + MFA |
| ABHA link | `/api/v1/abdm/abha/link` | receptionist/doctor |
| Capabilities | `/api/v1/facility/capabilities` | any authed |

Full table of every module's endpoints: `../healthdoc/docs/database-schema.md` §4.4.
