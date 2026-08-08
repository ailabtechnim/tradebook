# TradeBook Security & Production Readiness Notes

**Status:** Front-end MVP (no backend yet). This document describes what is
protected today, and what must be replaced when a real server is added.

## ✅ What is protected in this codebase

| Area | Implementation |
|---|---|
| Password storage | **Salted one-way hashes** (WebCrypto SHA-256, per-account random salt). Plain-text passwords are never written to storage. Legacy plain-text records are migrated automatically on first load. |
| Credential verification | Constant-work comparison (`safeEqual`); timing-equalizing hash is computed even for unknown emails. |
| Account take-over | `register()` **rejects duplicate emails** — an existing account can never be silently overwritten. |
| Brute force | 5 failed attempts per email → 60 s client-side lockout (`tradebook-login-lockouts`). |
| User enumeration | Single unified error: "Invalid email or password." |
| Session integrity | On every load the session is cross-checked against the account registry; role/profile always come from the registry, and orphaned or tampered sessions are dropped. |
| Input handling | `sanitizeText` (length caps), `isValidEmail`, `sanitizePhone`, `sanitizeUrl` — only `http(s)` URLs accepted for websites / product photos / story videos (`javascript:` / `data:` rejected). React escapes all rendered strings; no `dangerouslySetInnerHTML` anywhere. |
| Trust signals | New manufacturers/products start **unverified** with zero ratings. The "Verified" badge is only displayable after (future) platform review; no auto-badging. |
| Demo data | The platform ships **empty**. A storage schema version (`tradebook-schema = 2`) wipes any legacy seeded/demo records from returning browsers exactly once. |

## ⚠️ Inherent limits of a front-end-only MVP

- Data lives in the visitor's browser `localStorage`. It is not shared
  across devices and can be edited by a determined user via dev tools.
  Escrow amounts, prices, and roles are therefore **demo-grade**.
- The payment simulation (MoMo USSD / card OTP / bank transfer) is a UX
  prototype — no real money moves.

## 🚀 Production checklist (when adding a backend)

1. Replace `readAccounts`/`writeAccounts` and `hashCredential` in
   `src/context/AppContext.tsx` with a real auth API (Argon2/bcrypt
   server-side, HTTP-only JWT or session cookies, CSRF protection).
2. Move all persistence (users, manufacturers, products, orders,
   group buys, notifications) to a database with server-side validation
   mirroring the client validators in `src/lib/security.ts`.
3. Re-price every order server-side; never trust client-computed totals.
4. Integrate a licensed escrow/payment provider (e.g. MTN MoMo API,
   Flutterwave) for real fund holding and release.
5. Rate-limit login/registration endpoints server-side.
6. Enforce HTTPS + HSTS, secure cookies, and a strict Content-Security-Policy.
7. Add a verification workflow for the manufacturer "Verified" badge and
   RDB registration checks.
