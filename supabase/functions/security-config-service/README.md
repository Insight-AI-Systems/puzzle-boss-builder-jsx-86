
# Security Configuration Service

This edge function serves as a centralized security configuration service for the PuzzleBoss application. It allows front-end and back-end components to retrieve security settings, validate permissions, and manage security configuration in a consistent, secure manner.

## Purpose

The Security Configuration Service addresses several key needs:

1. **Centralization** - Removes hardcoded security values scattered across the codebase
2. **Consistency** - Ensures all application components use the same security rules
3. **Security** - Provides role-based access to sensitive configuration settings
4. **Auditability** - Logs all security configuration access for audit purposes

## Available Actions

The service supports the following actions:

### `getSecurityConstants`

Retrieves security constants appropriate for the caller's role level.

**Request:**
```json
{
  "action": "getSecurityConstants"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "config": {
      "ROLES": { ... },
      "AUTH_LEVELS": { ... },
      "SESSION": { ... },
      "CSRF": { ... }
    }
  }
}
```

### `validateAdminAccess`

Checks if the current user has admin privileges, either by role or by being in the protected admins list.

**Request:**
```json
{
  "action": "validateAdminAccess"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isAdmin": true,
    "details": {
      "byRole": true,
      "byEmail": false
    }
  }
}
```

### `getPermissionsForRole`

Retrieves the permissions associated with a specific role.

**Request:**
```json
{
  "action": "getPermissionsForRole",
  "params": {
    "role": "category_manager"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "role": "category_manager",
    "permissions": [
      {
        "name": "manage_category_content",
        "description": "Can manage content within assigned categories"
      },
      ...
    ]
  }
}
```

### `getAdminEmails`

Retrieves the list of protected admin emails (super admins only).

**Request:**
```json
{
  "action": "getAdminEmails"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "adminEmails": [
      "alan@insight-ai-systems.com",
      ...
    ]
  }
}
```

### `addProtectedAdmin`

Adds an email to the protected admin list (super admins only).

**Request:**
```json
{
  "action": "addProtectedAdmin",
  "params": {
    "email": "new.admin@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Protected admin added successfully",
    "adminEmails": [
      "alan@insight-ai-systems.com",
      "new.admin@example.com",
      ...
    ]
  }
}
```

### `removeProtectedAdmin`

Removes an email from the protected admin list (super admins only).

**Request:**
```json
{
  "action": "removeProtectedAdmin",
  "params": {
    "email": "admin.to.remove@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Protected admin removed successfully",
    "adminEmails": [
      "alan@insight-ai-systems.com",
      ...
    ]
  }
}
```

## Security Considerations

1. **Authentication** - All requests to this service (except OPTIONS for CORS) require authentication
2. **Authorization** - Sensitive operations require admin or super_admin privileges
3. **Audit Logging** - All access attempts are logged in the security_audit_logs table
4. **Error Handling** - Detailed errors are logged server-side, but only generic error messages are returned to clients

## Client Usage

Use the client utility functions in `src/utils/security/securityConfigService.ts` to interact with this service from frontend code.

Example:

```typescript
import { validateAdminAccess } from '@/utils/security/securityConfigService';

async function checkAdminAccess() {
  const { isAdmin } = await validateAdminAccess();
  
  if (isAdmin) {
    // Show admin interface
  } else {
    // Show regular interface
  }
}
```

## Extending the Service

When adding new security features:

1. Add new constants to the `SECURITY_CONSTANTS` object if they're static
2. For dynamic settings, store them in the `security_config` table
3. Create a new action to retrieve or modify the settings
4. Add appropriate role-based access controls
5. Update the client utility functions as needed
6. Document the changes in this README
