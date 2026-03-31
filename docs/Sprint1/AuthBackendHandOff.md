# Sprint 1 Auth Backend Hand-off

This note is for teammates continuing Sprint 1 backend/frontend work after `T-1.11`, `T-1.12`, `T-1.13b`, and `T-1.14a` are in place.

## What is already done

- `T-1.11`: auth-related DTO/service read-write paths are available
- `T-1.12`: OpenAPI baseline is frozen
- `T-1.13b`: `POST /api/v1/auth/register/complete`
- `T-1.14a`: `POST /api/v1/auth/login`

## Fixed contract entry

- Source file: `backend/DeliveryManagement/src/main/resources/static/openapi/sprint1-baseline.yaml`
- Runtime URL: `http://localhost:8080/openapi/sprint1-baseline.yaml`

## Important implementation notes

- Global JSON naming is `snake_case`
- Request bodies should use fields like `challenge_id`, `otp_code`, `access_token`
- Password and OTP hash format is:
  - `sha256$<salt>$<sha256(salt:raw_value)>`
- JWT is currently issued in `JwtService` using HS256
- JWT verification / protected routes are not implemented yet; that is the remaining `T-1.14b`

## Local run command

```powershell
cd backend\DeliveryManagement
$env:DATABASE_USERNAME='qhuang258'
$env:DATABASE_PASSWORD='Simao@618255'
.\gradlew.bat bootRun --args="--spring.profiles.active=dev"
```

## Current working endpoints

### Complete registration

- Method: `POST`
- Path: `/api/v1/auth/register/complete`
- Request:

```json
{
  "challenge_id": "b0000002-0000-0000-0000-000000000004",
  "otp_code": "654321"
}
```

### Login

- Method: `POST`
- Path: `/api/v1/auth/login`
- Request:

```json
{
  "identifier": "alice@example.com",
  "password": "AlicePass123!"
}
```

## Dev seed data for verification

- Login user:
  - `alice@example.com` / `AlicePass123!`
- Pending registration user:
  - `pending@example.com` / `PendingPass123!`
- Pending registration OTP challenge:
  - `challenge_id = b0000002-0000-0000-0000-000000000004`
  - `otp_code = 654321`

## What Yanjia needs for `T-1.13a`

- Implement `POST /api/v1/auth/register/otp`
- Reuse:
  - `AppUserService.createUser(...)`
  - `OtpChallengeService.createChallenge(...)`
  - `PasswordHashService.hash(...)`
- Expected flow:
  - check duplicate email / phone
  - create pending user with `guest = true`
  - hash OTP and store challenge
  - return `challenge_id`, `channel`, `expires_at`

## What Lei needs for `T-1.14b`

- Add JWT verification and protected route behavior
- Reuse:
  - `JwtService` config values in `application.yml`
- Protect at least:
  - `GET /api/v1/auth/me`
  - `GET /api/v1/centers`
  - `GET /api/v1/centers/{centerId}`
  - `GET /api/v1/centers/{centerId}/vehicles`
  - `GET /api/v1/vehicles/{vehicleId}`

## What frontend needs to know

- The contract is already frozen in the OpenAPI baseline file
- The backend currently supports:
  - login
  - complete register
- The request/response field naming is `snake_case`
