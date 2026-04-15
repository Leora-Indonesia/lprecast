# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vendor-register.spec.ts >> Vendor Registration Flow >> Step Navigation >> should allow clicking on completed steps
- Location: e2e/vendor-register.spec.ts:199:5

# Error details

```
Error: Channel closed
```

```
Error: page.fill: Target page, context or browser has been closed
Call log:
  - waiting for locator('#instagram')
    - locator resolved to <input id="instagram" data-slot="input" placeholder="@namaptjaya" name="company_info.instagram" class="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:curso…/>
    - fill("@testvendor")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

```

```
Error: browserContext.close: Target page, context or browser has been closed
```