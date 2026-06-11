# Requirements Document

## Introduction

This document specifies the frontend requirements for the Employee Authentication feature in the AWSome Shop SPA. The feature covers employee self-registration with enterprise email validation and password strength enforcement, employee login with JWT-based session management and role-based routing, and secure logout with token cleanup. The frontend communicates with the backend authentication service via the API gateway (port 8080).

## Glossary

- **Registration_Form**: The React page component at `/register` that collects employee email, username, and password for account creation
- **Login_Form**: The React page component at `/login` that collects credentials (email/username and password) for authentication
- **Auth_Store**: The Zustand state store (`useAuthStore`) that manages authentication state including JWT tokens, user info, and session status
- **Auth_Guard**: The route protection component (`AuthGuard`) that checks authentication status and user role before granting access to protected routes
- **API_Gateway**: The backend gateway service at port 8080 that proxies authentication requests to the auth service
- **JWT_Token**: The JSON Web Token issued by the backend upon successful login, stored client-side for authenticating subsequent requests
- **Enterprise_Email**: An email address whose domain matches the organization's whitelist of allowed corporate domains
- **Password_Strength_Indicator**: A visual component that displays real-time feedback on password compliance with strength rules
- **Onboarding_Points**: Bonus points automatically granted by the backend upon successful employee registration

## Requirements

### Requirement 1: Employee Self-Registration Page

**User Story:** As a new employee, I want to register an account using my enterprise email, so that I can log in and start using the points redemption platform.

#### Acceptance Criteria

1. WHEN an employee navigates to `/register`, THE Registration_Form SHALL display input fields for email, username, password, and password confirmation
2. IF the email address does not belong to an Enterprise_Email domain (matching the configured whitelist pattern), THEN THE Registration_Form SHALL disable form submission and display an inline error message indicating only enterprise email addresses are accepted
3. THE Registration_Form SHALL validate that the username is between 3 and 30 characters long and contains only alphanumeric characters, hyphens, or underscores
4. THE Registration_Form SHALL validate password strength in real-time as the employee types, requiring a minimum of 8 characters and a maximum of 64 characters, at least one uppercase letter, one lowercase letter, one digit, and at least one special character from the set !@#$%^&*()-_+=
5. THE Password_Strength_Indicator SHALL display the current strength level as the employee types the password: weak (meets minimum length only), medium (meets length plus 2 of the 4 character-type rules), or strong (meets all rules)
6. WHEN the password and password confirmation fields do not match, THE Registration_Form SHALL display an inline error message indicating the mismatch
7. WHEN all fields pass client-side validation and the employee submits the form, THE Registration_Form SHALL disable the submit button to prevent duplicate submissions and send a POST request to the API_Gateway registration endpoint
8. WHEN the API_Gateway returns a success response, THE Registration_Form SHALL display a success notification for 3 seconds and then redirect the employee to the Login_Form
9. WHEN the API_Gateway returns an error indicating the email is already registered, THE Registration_Form SHALL re-enable the submit button and display an inline error message stating the email already exists
10. IF the API_Gateway returns a network or server error, THEN THE Registration_Form SHALL re-enable the submit button and display an error notification indicating the failure reason without clearing the form input data

### Requirement 2: Registration Form Accessibility and Internationalization

**User Story:** As an employee with accessibility needs, I want the registration form to be fully accessible and available in my preferred language, so that I can complete registration independently.

#### Acceptance Criteria

1. THE Registration_Form SHALL render all labels, placeholders, error messages, and instructions in the language matching the current i18n locale (English or Chinese), with no untranslated text visible to the user
2. THE Registration_Form SHALL associate each input field with a visible label using `aria-labelledby` or `htmlFor` attributes such that assistive technologies can programmatically determine the label for every input
3. WHEN a validation error occurs on a field, THE Registration_Form SHALL announce the error message to screen readers within 100ms using an `aria-live="assertive"` region or an `aria-describedby` association linking the field to its error message
4. THE Registration_Form SHALL support keyboard navigation where all interactive elements are reachable via Tab key in a logical top-to-bottom reading order, focus indicators have a minimum contrast ratio of 3:1 against adjacent colors per WCAG 2.1 AA, and pressing Enter while any field is focused submits the form
5. WHEN the password field value changes, THE Password_Strength_Indicator SHALL convey the current strength level (weak, fair, strong) to assistive technologies via an `aria-live="polite"` announcement or an updated `aria-label` reflecting the level name
6. WHEN the user switches the i18n locale while the Registration_Form is displayed, THE Registration_Form SHALL re-render all visible text content in the newly selected language without requiring a page reload and without clearing user-entered field values

### Requirement 3: Employee Login

**User Story:** As an employee, I want to log in with my email or username and password, so that I can access my points balance and redeem products.

#### Acceptance Criteria

1. WHEN an employee navigates to `/login`, THE Login_Form SHALL display input fields for username/email (maximum 254 characters) and password (maximum 128 characters), with the password field masked by default
2. WHEN the employee submits the login form with both username/email and password fields non-empty, THE Login_Form SHALL send a POST request to the API_Gateway login endpoint
3. IF the employee attempts to submit the login form while the username/email or password field is empty, THEN THE Login_Form SHALL prevent submission and not send a request to the API_Gateway
4. WHEN the API_Gateway returns a successful authentication response with a JWT_Token, THE Auth_Store SHALL store the JWT_Token and user information (username, displayName, role, points) in persistent browser storage
5. WHEN the Auth_Store receives a successful login for an employee-role user, THE Login_Form SHALL redirect to the employee home page (`/`)
6. WHEN the Auth_Store receives a successful login for an admin-role user, THE Login_Form SHALL redirect to the admin dashboard (`/admin`)
7. IF an already-authenticated user navigates to `/login`, THEN THE Login_Form SHALL redirect to the appropriate home page based on the user's role (`/` for employee, `/admin` for admin)
8. WHEN the API_Gateway returns an authentication failure response, THE Login_Form SHALL display a generic error message without revealing whether the username or password was incorrect
9. IF a network timeout (exceeding 30 seconds) or server error (HTTP 5xx) occurs during login, THEN THE Login_Form SHALL display an error notification indicating a connection problem
10. WHILE a login request is in progress, THE Login_Form SHALL disable the submit button and display a loading indicator

### Requirement 4: Login Form Accessibility and Internationalization

**User Story:** As an employee using assistive technology, I want the login form to be accessible and localized, so that I can authenticate without barriers.

#### Acceptance Criteria

1. THE Login_Form SHALL render all user-visible text — including field labels, placeholders, error messages, button text, and navigational links — in the language matching the current i18next locale (English when locale is "en", Chinese when locale is "zh"), with "zh" as the fallback when a translation key is missing
2. THE Login_Form SHALL associate each input field with a visible label element where the label's `htmlFor` attribute matches the input's `id` attribute, or the input references the label via `aria-labelledby` with a matching element id
3. WHEN a login error occurs, THE Login_Form SHALL display the error message in an element with `role="alert"` or `aria-live="assertive"` so that screen readers announce the error without requiring the user to navigate to it
4. THE Login_Form SHALL support keyboard-only navigation with a logical tab order (username field, password field, password visibility toggle, submit button, register link) and visible focus indicators with at least a 3:1 contrast ratio against adjacent colors per WCAG 2.1 AA Success Criterion 1.4.11
5. THE Login_Form SHALL include a toggle button to show or hide the password field content, where the button's accessible name indicates the action it will perform (e.g., "Show password" when password is hidden, "Hide password" when password is visible)
6. WHEN the user presses the Enter key while focus is within the username or password field, THE Login_Form SHALL submit the login credentials as if the submit button were activated

### Requirement 5: JWT Token Management

**User Story:** As an employee, I want my session to persist across page refreshes but expire appropriately, so that I stay logged in during active use without compromising security.

#### Acceptance Criteria

1. WHEN a JWT_Token is received from the API_Gateway after successful authentication, THE Auth_Store SHALL persist the token in local storage under the key "token"
2. WHEN the application loads and a JWT_Token exists in local storage, THE Auth_Store SHALL display a loading indicator and validate the token by calling the API_Gateway token verification endpoint within 5 seconds
3. IF the API_Gateway token verification returns invalid or expired, THEN THE Auth_Store SHALL remove the stored token and clear the user state, and THE Auth_Guard SHALL redirect the user to the Login_Form
4. IF the API_Gateway token verification request fails due to a network error or timeout, THEN THE Auth_Store SHALL remove the stored token and clear the user state, and THE Auth_Guard SHALL redirect the user to the Login_Form
5. IF any API request returns a 401 Unauthorized response, THEN THE Auth_Store SHALL remove the stored token, clear the user state, and redirect the user to the Login_Form
6. THE Auth_Store SHALL include the JWT_Token in the Authorization header of all API requests to protected endpoints using the Bearer scheme
7. WHEN the user triggers logout, THE Auth_Store SHALL remove the JWT_Token from local storage, clear the user state, and THE Auth_Guard SHALL redirect the user to the Login_Form

### Requirement 6: Role-Based Route Protection

**User Story:** As a platform operator, I want routes protected by role so that employees and admins only access their designated areas.

#### Acceptance Criteria

1. WHEN an unauthenticated user attempts to access a protected route (`/` or `/admin/*`), THE Auth_Guard SHALL redirect to `/login`
2. WHEN an authenticated employee attempts to access an admin-only route (`/admin/*`), THE Auth_Guard SHALL redirect to the employee home page (`/`)
3. WHEN an authenticated admin attempts to access an employee-only route (`/*` excluding `/admin/*` and `/login`), THE Auth_Guard SHALL redirect to the admin dashboard (`/admin`)
4. WHILE the Auth_Guard is verifying token validity on initial page load, THE Auth_Guard SHALL display a visible loading indicator instead of flashing the login page, for no longer than 3 seconds before falling back to the `/login` redirect
5. WHEN an already-authenticated user navigates to `/login`, THE Auth_Guard SHALL redirect to their role-based home page (`/` for employees, `/admin` for admins)

### Requirement 7: Employee Logout

**User Story:** As an employee, I want to securely log out so that my session is terminated and my account is protected on shared devices.

#### Acceptance Criteria

1. WHEN an employee clicks the logout action in the AvatarMenu, THE Auth_Store SHALL send a POST request to the API_Gateway logout endpoint with a timeout of 10 seconds
2. WHEN the logout API request succeeds, THE Auth_Store SHALL remove the JWT_Token from local storage, clear the persisted auth session data (user object and isAuthenticated flag), and reset Auth_Store state to its initial unauthenticated values
3. WHEN the Auth_Store completes the logout cleanup, THE application SHALL redirect to `/login`
4. IF the logout API request fails for any reason (network error, timeout, or server error response), THEN THE Auth_Store SHALL still remove the JWT_Token from local storage, clear the persisted auth session data, reset Auth_Store state, and redirect to `/login`
5. WHILE a logout request is in progress, THE Auth_Store SHALL ignore subsequent logout action clicks until the current logout operation completes

### Requirement 8: Registration Link from Login Page

**User Story:** As a new employee, I want to easily navigate from the login page to the registration page, so that I can create an account if I do not have one.

#### Acceptance Criteria

1. THE Login_Form SHALL display a link or button labeled "Register" that targets the `/register` route, rendered within the initial viewport without requiring scrolling
2. WHEN an employee clicks the registration link on the Login_Form, THE application SHALL navigate to the Registration_Form using client-side routing without a full page reload
3. THE Registration_Form SHALL display a link or button labeled "Sign In" that targets the `/login` route, rendered within the initial viewport without requiring scrolling
4. WHEN an employee clicks the "Sign In" link on the Registration_Form, THE application SHALL navigate to the Login_Form using client-side routing without a full page reload
5. THE Login_Form registration link and THE Registration_Form sign-in link SHALL each be keyboard-focusable and activatable via the Enter key

### Requirement 9: Page Load Performance

**User Story:** As an employee, I want authentication pages to load quickly so that I can start working without delay.

#### Acceptance Criteria

1. THE Login_Form SHALL achieve First Contentful Paint within 3 seconds on a network connection with 50 Mbps downstream bandwidth and latency no greater than 100 ms
2. THE Registration_Form SHALL achieve First Contentful Paint within 3 seconds on a network connection with 50 Mbps downstream bandwidth and latency no greater than 100 ms
3. WHILE authentication API requests are pending, THE application SHALL display a loading indicator that does not prevent the employee from navigating away from the page
4. IF an authentication API request does not complete within 10 seconds, THEN THE application SHALL dismiss the loading indicator and display an error message indicating the request timed out
