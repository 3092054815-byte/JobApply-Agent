# AGENTS.md

Project-specific guidance for Codex. These rules are meant to reduce common
LLM coding mistakes while keeping changes small, verifiable, and aligned with
the user's actual request.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks,
use judgment and keep the response lightweight.

## 1. Think Before Coding

Do not assume. Do not hide confusion. Surface tradeoffs.

Before implementing:
- State important assumptions explicitly.
- If multiple interpretations exist, present them instead of silently choosing.
- If a simpler approach exists, say so.
- Push back when the requested approach seems unnecessarily risky or complex.
- If something is unclear and a wrong guess would be costly, stop, name what is
  confusing, and ask.

## 2. Simplicity First

Write the minimum code that solves the problem. Do not add speculative behavior.

- No features beyond what was asked.
- No abstractions for single-use code.
- No flexibility or configurability that was not requested.
- No error handling for impossible scenarios.
- If a solution becomes much larger than it needs to be, simplify it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, reduce the
scope or implementation.

## 3. Surgical Changes

Touch only what is necessary. Clean up only the mess created by the current
change.

When editing existing code:
- Do not improve adjacent code, comments, or formatting unless required.
- Do not refactor things that are not part of the request.
- Match the existing style, even when another style would be preferred.
- If unrelated dead code or problems are noticed, mention them instead of
  deleting or rewriting them.

When the current changes create orphans:
- Remove imports, variables, functions, or files made unused by this change.
- Do not remove pre-existing dead code unless asked.

Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

Turn tasks into verifiable goals and loop until they are checked.

Examples:
- "Add validation" -> write tests for invalid inputs, then make them pass.
- "Fix the bug" -> write or run a reproduction, then make it pass.
- "Refactor X" -> ensure relevant tests pass before and after when practical.

For multi-step tasks, state a brief plan:

```text
1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]
```

Strong success criteria allow independent progress. Weak criteria such as
"make it work" should be clarified when the intended behavior is not evident
from the codebase.

## Working Definition of Success

These guidelines are working when diffs are smaller, unnecessary changes are
rarer, implementations are easier to review, and clarifying questions happen
before mistakes instead of after them.
