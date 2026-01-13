# Software Engineering Principles

## Environment Management
Modern applications follow **environment separation**:

```
Development → Staging → Production
     ↓            ↓           ↓
test-api    staging-api   api
test-keys   staging-keys  prod-keys
```

**Key Principle**: Each environment has isolated:
- API endpoints (different base URLs)
- Credentials (separate API keys)
- Data (dedicated databases)

## Configuration Strategy (12-Factor App)
- **Store config in environment variables**, never in code
- `NODE_ENV` determines which config set to use
- Build once, deploy anywhere - same code, different config

## Third-Party Integration Pattern
When integrating external services:
1. **Read their docs FIRST** - understand their environment model
2. **Check for environment-specific endpoints** - test vs prod URLs are common
3. **Validate configuration** - wrong environment = wrong endpoint = cryptic errors
4. **Never assume** - 403 often means "calling prod with test key" or vice versa

## Debugging Workflow
```
User reports issue
       ↓
Check environment (dev/prod?)
       ↓
Read service documentation
       ↓
Verify config matches environment
       ↓
Only then check credentials
```

## Common Anti-Patterns to Avoid
- ❌ Hardcoding environment URLs
- ❌ Blaming credentials first
- ❌ Changing code before understanding the system
- ❌ Assuming without verifying

## What to Do First
1. Identify the environment (check NODE_ENV, config files)
2. Read official docs for that environment
3. Verify configuration matches the environment
4. Then investigate specific issues

**Remember**: Most "API key issues" are actually "wrong environment" issues.
