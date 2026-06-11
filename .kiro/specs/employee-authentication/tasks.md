# Implementation Plan: Employee Authentication

## Overview

This plan converts the employee authentication design into incremental coding tasks. The implementation builds utilities first (pure validation functions), then the API client layer, then enhances the auth store, and finally builds/enhances the UI components and wires everything together. Each task builds on previous steps so there is no orphaned code.

## Tasks

- [ ] 1. Implement validation utilities
  - [ ] 1.1 Create `src/utils/validation.ts` with pure validation functions
    - Implement `isEnterpriseEmail(email, allowedDomains)` that validates email syntax and domain against whitelist
    - Implement `isValidUsername(username)` that checks 3-30 chars, alphanumeric/hyphens/underscores only
    - Implement `validatePassword(password)` that returns `PasswordValidationResult` with strength classification (weak/medium/strong) and individual checks (minLength, maxLength, hasUppercase, hasLowercase, hasDigit, hasSpecialChar)
    - Implement `passwordsMatch(password, confirmation)` that returns strict equality check
    - Export all types: `PasswordStrength`, `PasswordValidationResult`
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

  - [ ]* 1.2 Write property tests for validation utilities in `src/utils/validation.test.ts`
    - **Property 1: Enterprise Email Validation** — For any string, `isEnterpriseEmail` returns true iff it's a valid email with domain in the allowed list
    - **Property 2: Username Validation** — For any string, `isValidUsername` returns true iff length is 3-30 and only contains `[a-zA-Z0-9_-]`
    - **Property 3: Password Strength Classification** — For any string, `validatePassword` classifies as strong (all rules), medium (length + 2-3 char rules), or weak (length only)
    - **Property 4: Password Confirmation Mismatch Detection** — For any two strings, `passwordsMatch(a, b)` returns true iff `a === b`
    - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6**

- [ ] 2. Implement centralized API client
  - [ ] 2.1 Create `src/api/client.ts` with axios instance and interceptors
    - Create axios instance with `baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'` and default timeout of 10000ms
    - Add request interceptor: read token from `localStorage.getItem('token')`, inject `Authorization: Bearer <token>` header if token exists
    - Add response interceptor: on 401 status, import `useAuthStore` and call `getState().clearAuth()`, then redirect to `/login`
    - Export the configured `apiClient` instance
    - _Requirements: 5.5, 5.6_

  - [ ]* 2.2 Write property tests for API client in `src/api/client.test.ts`
    - **Property 9: Bearer Token Injection** — For any token string in localStorage, outgoing requests include `Authorization: Bearer <token>` header
    - **Property 8: 401 Response Triggers Consistent Cleanup** — For any 401 response, auth state is cleared (token removed, user null, isAuthenticated false)
    - **Validates: Requirements 5.5, 5.6**

- [ ] 3. Enhance auth store with JWT support
  - [ ] 3.1 Enhance `src/store/useAuthStore.ts` with real API calls and token management
    - Add `token: string | null`, `isLoading: boolean`, `isLoggingOut: boolean` to state interface
    - Add `VITE_USE_MOCK` env flag check: when true, retain existing mock logic; when false, use `apiClient`
    - Implement `login` to POST `/auth/login` (with 30s timeout), store token in localStorage, set user and isAuthenticated
    - Implement `register(data: RegisterPayload)` to POST `/auth/register`, return `RegisterResult` with success/error
    - Implement `verifyToken()` to GET `/auth/verify` (with 5s timeout), update user state on success, clear auth on failure
    - Implement `logout()` to POST `/auth/logout` (with 10s timeout), always clear client state regardless of API response, set `isLoggingOut` to prevent duplicate calls
    - Implement `clearAuth()` helper to remove token from localStorage, reset user/isAuthenticated/token/isLoading
    - Persist token separately via `localStorage.setItem('token', jwt)` outside Zustand persist
    - _Requirements: 3.4, 5.1, 5.2, 5.7, 7.1, 7.2, 7.4, 7.5_

  - [ ]* 3.2 Write property tests for auth store in `src/store/useAuthStore.test.ts`
    - **Property 7: Login Response Data Persistence** — For any valid token and UserInfo from login response, store persists token and user correctly
    - **Property 10: Logout Clears All Auth State** — For any auth state, logout results in token removed, user null, isAuthenticated false
    - **Validates: Requirements 3.4, 5.1, 7.2, 7.4**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Enhance AuthGuard with loading state and token verification
  - [ ] 5.1 Enhance `src/router/AuthGuard.tsx` with loading state and token verification
    - On mount, if token exists in localStorage, call `verifyToken()` from auth store
    - While `isLoading` is true, render a centered `CircularProgress` loading spinner
    - Add 3-second timeout: if verification takes longer, clear auth and redirect to `/login`
    - After verification completes, check authentication status and role as before
    - If not authenticated, redirect to `/login`
    - If role mismatch, redirect to appropriate home page
    - _Requirements: 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_

  - [ ]* 5.2 Write unit tests for AuthGuard in `src/router/AuthGuard.test.tsx`
    - Test: shows loading spinner during token verification
    - Test: redirects to /login when unauthenticated
    - Test: redirects employee away from admin routes
    - Test: redirects admin away from employee routes
    - Test: times out after 3 seconds and redirects to /login
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 6. Enhance Login page with accessibility and Enter key handling
  - [ ] 6.1 Enhance `src/pages/Login/index.tsx` with accessibility, Enter key, and loading state
    - Add `htmlFor`/`id` associations for username and password fields
    - Add `aria-label` to password visibility toggle (dynamic: "Show password"/"Hide password")
    - Add `onKeyDown` handler on both fields: submit on Enter key press
    - Add empty-field submission prevention: don't call `login()` if username or password is empty
    - Connect `isLoading` from auth store to disable submit button and show loading indicator during login
    - Wrap error Alert with `role="alert"` for screen reader announcement
    - _Requirements: 3.2, 3.3, 3.10, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 6.2 Write unit tests for Login page in `src/pages/Login/Login.test.tsx`
    - Test: renders all fields with proper labels and accessibility attributes
    - Test: prevents submission when fields are empty (Property 6)
    - Test: submits form on Enter key press
    - Test: shows loading state during login request
    - Test: displays error with role="alert" on failed login
    - Test: redirects authenticated users based on role
    - **Property 6: Empty Field Submission Prevention**
    - **Validates: Requirements 3.2, 3.3, 3.7, 3.8, 3.10, 4.2, 4.3, 4.5, 4.6**

- [ ] 7. Implement Registration page
  - [ ] 7.1 Add i18n translations for registration namespace
    - Add `register` namespace to `src/i18n/locales/en.json` with all labels, placeholders, error messages, and strength indicators
    - Add `register` namespace to `src/i18n/locales/zh.json` with Chinese translations
    - _Requirements: 2.1_

  - [ ] 7.2 Create `src/pages/Register/index.tsx` with full registration form
    - Left brand panel matching Login page layout for visual consistency
    - Form fields: email, username, password (with strength indicator), confirm password
    - Use validation utilities from `src/utils/validation.ts` for real-time field validation
    - Show inline error messages below each field with `aria-describedby` associations
    - Implement `PasswordStrengthIndicator` sub-component with colored bar and `aria-live="polite"` announcement
    - Submit handler: validate all fields, disable button during submission, call `register()` from auth store
    - On success: show success notification for 3 seconds, redirect to `/login`
    - On error (409 email exists): show inline error, re-enable form
    - On error (network/server): show error notification, re-enable form, preserve form data
    - Add keyboard navigation: Tab order top-to-bottom, Enter key submits form
    - Add "Sign In" link navigating to `/login` via client-side routing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 8.3, 8.4, 8.5_

  - [ ]* 7.3 Write unit tests for Registration page in `src/pages/Register/Register.test.tsx`
    - Test: renders all fields with proper labels and accessibility attributes
    - Test: shows inline validation errors for invalid email/username/password
    - Test: password strength indicator updates in real-time with aria-live
    - Test: prevents submission when fields are invalid
    - Test: disables submit button during API call
    - Test: shows success message and redirects on successful registration
    - Test: shows email-exists error on 409 response
    - Test: preserves form data on network error
    - Test: Enter key submits form
    - **Property 5: Locale Switch Preserves Form Data** (integration aspect)
    - **Validates: Requirements 1.1–1.10, 2.1–2.6**

- [ ] 8. Enhance AvatarMenu with logout protection
  - [ ] 8.1 Enhance `src/components/AvatarMenu.tsx` with async logout and duplicate-click prevention
    - Update `handleLogout` to call async `logout()` from store (which now calls the API)
    - Disable logout menu item while `isLoggingOut` is true from auth store
    - After logout completes, navigate to `/login`
    - _Requirements: 7.1, 7.2, 7.3, 7.5_

  - [ ]* 8.2 Write unit tests for AvatarMenu logout in `src/components/AvatarMenu.test.tsx`
    - Test: triggers logout on menu item click
    - Test: disables logout item while logout is in progress
    - Test: navigates to /login after logout completes
    - Test: handles API failure gracefully (still clears state)
    - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [ ] 9. Wire router and finalize integration
  - [ ] 9.1 Add `/register` route to `src/router/index.tsx`
    - Import Register page component
    - Add `/register` as a public route alongside `/login`
    - Ensure register route is accessible without authentication
    - _Requirements: 8.1, 8.2_

  - [ ]* 9.2 Write integration tests in `src/__tests__/auth-integration.test.tsx`
    - Test: login flow → token stored → protected route accessible → logout → redirect to /login
    - Test: registration link from login navigates to register page (client-side)
    - Test: sign-in link from register navigates to login page (client-side)
    - Test: unauthenticated access to protected route redirects to /login
    - Test: 401 on API call triggers auto-logout and redirect
    - _Requirements: 6.1, 6.5, 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `VITE_USE_MOCK` environment variable allows toggling between mock and real API mode
- All existing code is enhanced in-place; no files are recreated from scratch

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "7.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "5.1"] },
    { "id": 4, "tasks": ["5.2", "6.1", "7.2", "8.1"] },
    { "id": 5, "tasks": ["6.2", "7.3", "8.2", "9.1"] },
    { "id": 6, "tasks": ["9.2"] }
  ]
}
```
