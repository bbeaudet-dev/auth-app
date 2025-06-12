### Step 1: Create the Basic App Structure
- [x] Set up Express (or Elysia) server
- [x] Create two endpoints:
  - [x] `GET /api/public` - Returns: `{ message: "This is public information" }`
  - [x] `GET /api/protected` - Returns: `{ message: "Only admin should be able to see this" }`
- [x] **Problem**: Both endpoints are actually public! Anyone can access the "protected" one.

### Step 2: Add API Documentation
- [x] Add Swagger/OpenAPI documentation for both endpoints
- [x] Serve interactive docs at `/api-docs`
- [x] Document request/response schemas
- [x] Test both endpoints through Swagger UI

### Step 3: Create User System
- [x] Create an in-memory list of users with different roles:
  ```javascript
  const users = [
    { id: 1, username: "admin", password: "admin123", role: "admin" },
    { id: 2, username: "user", password: "user123", role: "basic" }
  ];
  ```
- [x] **Problem**: How do we know which user is making the request to `/api/protected`?

### Step 4: Add Authentication Middleware (First Attempt)
- [x] Create middleware that checks if user is admin
- [x] Apply it to the protected endpoint
- [x] **Problem**: There's no way to identify the user from the request! We need some way to know who they are.

### Step 5: Introduce User Secrets
- [ ] Give each user a unique SECRET:
  ```javascript
  const users = [
    { id: 1, username: "admin", password: "admin123", role: "admin", secret: "admin-secret-123" },
    { id: 2, username: "user", password: "user123", role: "basic", secret: "user-secret-456" }
  ];
  ```
- [ ] Update middleware to check for secret in:
  - [ ] `Authorization` header: `Bearer admin-secret-123`
- [ ] Find user by secret, check if role is "admin"
- [ ] **Success**: Now the protected endpoint actually works!

### Step 6: Realize the Problems with Secrets
Think about these security issues:
1. **Interception**: Anyone who sees the network request gets the secret
2. **Theft**: Malicious browser extensions can steal cookies
3. **No Expiry**: Secrets never expire - if stolen, they work forever
4. **No Rotation**: Can't easily change secrets without breaking everything

**Solution**: We need something that can expire and be renewed automatically → **JWT Tokens**

### Step 7: Learn About JWTs
- [ ] Read about JWT structure (header.payload.signature)
- [ ] Understand signing vs verification
- [ ] Learn about expiry (`exp` claim)
- [ ] Practice signing and decoding JWTs manually

### Step 8: Implement JWT System
- [ ] Install JWT library (`jsonwebtoken` or `jose`)
- [ ] Create functions to:
  - [ ] Sign JWTs with user info and expiration
  - [ ] Verify and decode JWTs
  - [ ] Handle expired tokens

### Step 9: Create Login Endpoint
- [ ] `POST /api/login` - Takes username/password
  - [ ] Verify credentials against user list
  - [ ] Sign JWT with user ID and role
  - [ ] Set JWT in cookie AND return it in response
  - [ ] Document in Swagger with examples

### Step 10: Update Authentication Middleware
- [ ] Modify middleware to:
  - [ ] Extract JWT from Authorization header OR cookie
  - [ ] Verify JWT signature
  - [ ] Decode user info from JWT
  - [ ] Check if user role is "admin"
  - [ ] Handle expired tokens gracefully

### Step 11: Add More Protected Endpoints
- [ ] `POST /api/chat` - AI chat (requires any authenticated user)
- [ ] `GET /api/chat/history` - Chat history (requires authentication)
- [ ] `DELETE /api/chat/history` - Clear history (requires authentication)
- [ ] Update Swagger with authentication schemes

### Step 12: Test the Full Flow
- [ ] Use Swagger UI to:
  - [ ] Try accessing protected endpoints (should fail)
  - [ ] Login via `/api/login` endpoint
  - [ ] Use returned JWT in "Authorize" button
  - [ ] Access protected endpoints (should work)

### Step 13: Professional Implementation with Better Auth
- [ ] Replace your custom system with [Better Auth](https://www.better-auth.com/)
- [ ] Implement proper user database
- [ ] Add features like password hashing, email verification, etc.
- [ ] Keep your existing API endpoints but use Better Auth for authentication

### Step 14: Add real API endpoints for querying an AI app that you are building:

All of these endpoints must require valid authentication:
- [ ] `POST /api/chat` - AI chat completion using Vercel AI SDK
  - [ ] Accept messages in OpenAI format
  - [ ] Return streaming or non-streaming responses
  - [ ] Require authentication token/session
- [ ] `GET /api/chat/history` - Retrieve user's chat history
  - [ ] Return paginated chat history for authenticated user
- [ ] `DELETE /api/chat/history` - Clear user's chat history
  - [ ] Only allow users to delete their own history
- [ ] `GET /api/profile` - Get authenticated user profile
- [ ] `PUT /api/profile` - Update authenticated user profile
