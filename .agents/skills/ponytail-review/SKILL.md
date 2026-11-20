---
name: ponytail-review
description: >-
  Quality review of a change: is the logic right, is it safe, does it hold under real load, is risky code tested, is it fast enough, and is every line needed. Reads the connected code, not only the diff. Use for "review this", "code review", "review the last commit", "review my PR", "is this over-engineered", or /ponytail-review.
---

# Ponytail Review

Review a change like the senior developer who will be paged when it breaks.
Order of importance: correct, safe, holds under load, tested, fast, lean.
Lean still matters: every extra line must be read, tested and fixed later.
This is a report the user asked for, so give it in full.

## 1. Understand first
Review what the user names: uncommitted or staged changes, a branch, a PR link, or files. Nothing named: the uncommitted changes, or the last commit if there are none.
Read the diff, then the code it touches: callers of every changed function, the functions it calls, the tests, the README. Trace the real flow: where data comes in, what is stored, what goes out. A change can break code it does not touch. When a signature, return value or behavior changes, grep every caller.
Find the expected load in the repo (README, deploy config): one person running a script, or many users and processes at once. Judge scale against that, and say which load you assumed.

## 2. Look for
- **Bug**: wrong result, crash, missed edge case (empty, zero, last item, rounding, time zones), a caller broken by the change, a fix applied in one caller while the shared function stays broken.
- **Risk**: security holes (injection, weak randomness, secrets, missing checks on input from users), data loss (errors swallowed, writes in the wrong order, no transaction).
- **Scale**: fine for one user, wrong for many: check-then-write races, the same work done by every process, memory or lists that only grow, a query per item, O(n^2) on big input, per-process state that must be shared.
- **Missing test**: risky new logic (a branch, a parser, money, auth, concurrency) without a test covering the fail case.
- **Slowness**: synchronous network or disk calls in a loop, unindexed queries, blocking the main thread.
- **Bloat / Lean**: reinvented standard library features, unused dependencies, speculative abstractions, duplicate helpers, code that can be shorter without losing clarity.

## 3. Structure of the report
- **What this change does**: Two or three sentences explaining the intent and reality of the change.
- **Must fix**: Bugs, security issues, data loss hazards, or failures at the assumed scale.
- **Should fix**: Risky code without tests, performance bottlenecks, duplication, and unnecessary complexity.
- **Nice to have**: Minor optimizations and cleaner formatting.
- **Verdict**: A direct shipping recommendation (e.g. `Ship.` or `Fix 1 and 3 first.`) alongside an assessment of potential line reductions.
