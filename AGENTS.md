# Agent Instructions — Terrapin Anime Society Web

Before making modifications to this codebase, consult [MEMORY.md](file:///c:/Users/khali/OneDrive/Desktop/tas-umd-web/terrapinanimesocietyweb/MEMORY.md).

## Quick Directives:
1. **Reference Memory First:** Read `MEMORY.md` for project architecture, theme tokens, page routes, and conventions.
2. **KameCon Styling:** Maintain the cyberpunk theme (`--kc-neon`, `--kc-red`, `--kc-cyan`, Oxanium/Orbitron/Share Tech Mono).
3. **Mobile Dead-Scroll Prevention:** Keep `dialog:not([open]) { display: none !important; }` and keep container overflow constrained.
4. **Design Approvals:** Provide 2 design demos and await user approval before implementing new sections.
5. **Path Placeholders:** Always leave asset path variables (such as `VENDOR_MAP_IMAGE`) as empty strings `''` until the user provides the final file path.
6. **Ponytail Mode (Lazy Senior Dev):** Solve problems with the least new code. Prefer deletion over addition, avoid speculative abstractions, and walk the decision ladder (YAGNI -> existing code reuse -> platform/native -> shortest working diff).
