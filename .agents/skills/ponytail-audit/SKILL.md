---
name: ponytail-audit
description: >-
  Repository-wide quality audit for over-engineering, bugs, security vulnerabilities, performance bottlenecks, and dead/bloated code. Use for "audit the repo", "audit code", "check for bloat", or /ponytail-audit.
---

# Ponytail Audit

Audit the whole repository like the senior developer who just inherited it and will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean. Lean matters because every extra line must be read, tested and fixed later.
This is a one-shot diagnostic report; propose fixes without applying them automatically.

## 1. Map first
Audit what the user names (a folder, a package, or the whole repo; if nothing is named, audit the whole repo).
Read the README, deploy/build config, dependency list, entry points (main, routes, handlers, jobs, CLI commands), and tests.
Determine expected scale and load.

## 2. Trace main flows
Trace data coming in, what is stored, what goes out, money, auth, and data writes end-to-end.

## 3. Validation rules (Check before you report)
- Every finding needs a concrete case ("this input or situation leads to this wrong result"). No case, no finding.
- Before calling code unused, grep the entire tree for it, including tests, fixtures, config, and dynamic references.
- Propose the smallest fix that works, preferring solutions that delete code without adding unnecessary frameworks or abstraction layers.
- No subjective style taste, no "consider", no vague worries.
