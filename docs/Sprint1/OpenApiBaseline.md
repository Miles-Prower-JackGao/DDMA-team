# Sprint 1 OpenAPI Baseline

This Sprint 1 baseline is frozen as the contract source for auth and minimum protected read APIs.

## Fixed source file

- Backend source: `backend/DeliveryManagement/src/main/resources/static/openapi/sprint1-baseline.yaml`

## Fixed local access path

- After starting backend normally: `http://localhost:8080/openapi/sprint1-baseline.yaml`

## Covered endpoints

- `POST /api/v1/auth/register/otp`
- `POST /api/v1/auth/register/complete`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/centers`
- `GET /api/v1/centers/{centerId}`
- `GET /api/v1/centers/{centerId}/vehicles`
- `GET /api/v1/vehicles/{vehicleId}`

## Baseline rules

- Sprint 1 frontend and backend should align to this file first.
- Field changes should be updated in this file before or together with implementation changes.
- If a path or schema changes, the PR should explicitly mention the baseline update.
