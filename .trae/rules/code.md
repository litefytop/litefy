# Code Style Rules

## Prohibit Code Comments

- **Never add code comments** in any code files (`.tsx`, `.ts`, `.js`, `.jsx`, `.css`, etc.)
- Code should be self-explanatory through clear naming and structure
- If code needs explanation, refactor it to be clearer instead of adding comments
- This rule applies to:
  - Single-line comments (`// comment`)
  - Multi-line comments (`/* comment */`)
  - JSDoc comments (`/** comment */`)
  - Inline comments
  - TODO/FIXME/HACK comments

## Exceptions

- Legal/copyright headers (if required)
- Compiler/tool directives (e.g., `// eslint-disable-next-line`)
