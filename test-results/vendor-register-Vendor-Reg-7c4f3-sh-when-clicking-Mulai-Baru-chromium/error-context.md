# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vendor-register.spec.ts >> Vendor Registration Flow >> Draft Persistence >> should start fresh when clicking Mulai Baru
- Location: e2e/vendor-register.spec.ts:231:5

# Error details

```
Error: Channel closed
```

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://localhost:3000/vendor/register", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```