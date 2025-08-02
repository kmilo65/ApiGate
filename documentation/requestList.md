# ApiGate RESTful APIs - Postman Collection

## Overview

This document contains all the RESTful API endpoints for the ApiGate application, including request/response examples, error handling, and testing instructions.

## Base Configuration

### Environment Variables
```json
{
  "base_url": "http://localhost:3000",
  "api_key": "pk_abc123_def456",
  "api_key_id": "uuid-of-your-api-key"
}
```

---

## 1. API Keys Management

### 1.1 GET /api/keys - List all API keys

**Request:**
```http
GET {{base_url}}/api/keys
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My API Key",
      "key": "pk_abc123_def456",
      "description": "Description",
      "permissions": [],
      "created_at": "2024-01-01T00:00:00.000Z",
      "last_used": null
    }
  ],
  "count": 1
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to fetch API keys",
  "details": "Database connection error"
}
```

---

### 1.2 POST /api/keys - Create new API key

**Request:**
```http
POST {{base_url}}/api/keys
Content-Type: application/json

{
  "name": "My New API Key",
  "description": "Optional description",
  "permissions": ["read", "write"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My New API Key",
    "key": "pk_xyz789_abc123",
    "description": "Optional description",
    "permissions": ["read", "write"],
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_used": null
  },
  "message": "API key created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Name is required and must be a non-empty string"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to create API key",
  "details": "Database error"
}
```

---

### 1.3 GET /api/keys/{id} - Get specific API key

**Request:**
```http
GET {{base_url}}/api/keys/{{api_key_id}}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "key": "pk_abc123_def456",
    "description": "Description",
    "permissions": [],
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_used": null
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "API key ID is required"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "API key not found"
}
```

---

### 1.4 PUT /api/keys/{id} - Update API key

**Request:**
```http
PUT {{base_url}}/api/keys/{{api_key_id}}
Content-Type: application/json

{
  "name": "Updated API Key Name",
  "description": "Updated description",
  "permissions": ["read", "write", "delete"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated API Key Name",
    "key": "pk_abc123_def456",
    "description": "Updated description",
    "permissions": ["read", "write", "delete"],
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z",
    "last_used": null
  },
  "message": "API key updated successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Request body is required"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "API key not found"
}
```

---

### 1.5 DELETE /api/keys/{id} - Delete API key

**Request:**
```http
DELETE {{base_url}}/api/keys/{{api_key_id}}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "API key ID is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to delete API key",
  "details": "Database error"
}
```

---

## 2. GitHub Summaries

### 2.1 GET /api/summaries - List user's summaries

**Request:**
```http
GET {{base_url}}/api/summaries
x-api-key: {{api_key}}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [],
  "count": 0,
  "message": "Summaries endpoint - implement database storage for summaries"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "API key is required in x-api-key header",
  "success": false
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid API key",
  "success": false
}
```

---

### 2.2 POST /api/summaries - Create new summary from GitHub URL

**Request:**
```http
POST {{base_url}}/api/summaries
x-api-key: {{api_key}}
Content-Type: application/json

{
  "gitHubUrl": "https://github.com/username/repository"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1704067200000,
    "api_key_id": "uuid",
    "github_url": "https://github.com/username/repository",
    "summary": "A concise 1-2 sentence summary of what the project does and its main purpose",
    "cool_facts": [
      "Interesting fact 1",
      "Interesting fact 2",
      "Interesting fact 3"
    ],
    "created_at": "2024-01-01T00:00:00.000Z",
    "api_key_name": "My API Key"
  },
  "message": "Summary created successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "GitHub URL is required",
  "success": false
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid GitHub URL format. Expected: https://github.com/username/repository",
  "success": false
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "API key is required in x-api-key header",
  "success": false
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid API key",
  "success": false
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Internal server error",
  "details": "Failed to fetch README from GitHub: GitHub API error: 404 Not Found"
}
```

---

## 3. Authentication

### 3.1 POST /api/auth/validate - Validate API key

**Request:**
```http
POST {{base_url}}/api/auth/validate
Content-Type: application/json

{
  "apiKey": "pk_abc123_def456"
}
```

**Response (200 OK) - Valid:**
```json
{
  "valid": true,
  "message": "Valid API key",
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "permissions": ["read", "write"],
    "last_used": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "API key is required",
  "valid": false
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Invalid API key format",
  "valid": false
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid API key",
  "valid": false
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Database error occurred",
  "valid": false
}
```

---

## Error Response Standards

All endpoints follow consistent error response patterns:

### 400 Bad Request
```json
{
  "error": "Request body is required"
}
```

### 401 Unauthorized
```json
{
  "error": "API key is required in x-api-key header",
  "success": false
}
```

### 404 Not Found
```json
{
  "error": "API key not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "details": "Failed to process request"
}
```

---

## Testing Flow

### Recommended Testing Sequence:

1. **Create API Key**
   ```http
   POST {{base_url}}/api/keys
   ```
   - Save the returned `key` value to your environment variable

2. **Validate API Key**
   ```http
   POST {{base_url}}/api/auth/validate
   ```
   - Verify the API key is working

3. **Create Summary**
   ```http
   POST {{base_url}}/api/summaries
   ```
   - Use a valid GitHub repository URL

4. **List API Keys**
   ```http
   GET {{base_url}}/api/keys
   ```
   - Verify your key appears in the list

5. **Update API Key**
   ```http
   PUT {{base_url}}/api/keys/{{api_key_id}}
   ```
   - Modify name, description, or permissions

6. **Delete API Key** (Optional)
   ```http
   DELETE {{base_url}}/api/keys/{{api_key_id}}
   ```
   - Clean up test data

---

## Postman Collection Import

### Collection JSON Structure:
```json
{
  "info": {
    "name": "ApiGate RESTful APIs",
    "description": "Complete RESTful API collection for ApiGate",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000"
    },
    {
      "key": "api_key",
      "value": "pk_abc123_def456"
    },
    {
      "key": "api_key_id",
      "value": "uuid-of-your-api-key"
    }
  ],
  "item": [
    {
      "name": "API Keys",
      "item": [
        {
          "name": "List API Keys",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/keys",
              "host": ["{{base_url}}"],
              "path": ["api", "keys"]
            }
          }
        },
        {
          "name": "Create API Key",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"My New API Key\",\n  \"description\": \"Optional description\",\n  \"permissions\": [\"read\", \"write\"]\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/keys",
              "host": ["{{base_url}}"],
              "path": ["api", "keys"]
            }
          }
        }
      ]
    },
    {
      "name": "Summaries",
      "item": [
        {
          "name": "List Summaries",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "x-api-key",
                "value": "{{api_key}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/api/summaries",
              "host": ["{{base_url}}"],
              "path": ["api", "summaries"]
            }
          }
        },
        {
          "name": "Create Summary",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "x-api-key",
                "value": "{{api_key}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"gitHubUrl\": \"https://github.com/username/repository\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/summaries",
              "host": ["{{base_url}}"],
              "path": ["api", "summaries"]
            }
          }
        }
      ]
    },
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Validate API Key",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"apiKey\": \"{{api_key}}\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/api/auth/validate",
              "host": ["{{base_url}}"],
              "path": ["api", "auth", "validate"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## Notes

- All endpoints require proper authentication via API keys
- GitHub summaries require a valid GitHub repository URL
- Error responses include detailed information for debugging
- The API follows RESTful conventions with proper HTTP status codes
- Database operations are handled through Supabase
- AI summarization uses OpenAI/LangChain for content processing 