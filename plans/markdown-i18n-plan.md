## Plan: Add Markdown-based i18n component (MarkdownI18n)

TL;DR: Add `react-markdown` and implement `MarkdownI18n` which renders `translate()` messages as Markdown via `react-markdown`. Start by converting the FAQ answers in the landing FAQ component to use `MarkdownI18n` and validate that build and rendering works.

**Phases**
1. **Phase 1: Add dependency**
    - Objective: Add `react-markdown` to project dependencies to support Markdown render.
    - Files/Functions to Modify/Create: `package.json`.
    - Tests to Write: None (but run a project build to confirm no errors).
    - Steps:
        1. Add a dependency entry in `package.json` for `react-markdown`.
        2. Run package manager to install (get confirmation locally).
        3. Verify build commands succeed.

2. **Phase 2: Implement `MarkdownI18n`**
    - Objective: Create a new shared component to render Markdown from i18n messages.
    - Files/Functions to Modify/Create: `src/components/MarkdownI18n.tsx`.
    - Tests to Write: Basic TypeScript compile / Docusaurus build integration.
    - Steps:
        1. Create `MarkdownI18n.tsx` as a TypeScript React component using `translate` and `react-markdown`.
        2. Export it and add minimal prop types: `id`, `defaultMessage`, `values?`, `className?`.
        3. Add a couple of unit checks by building the project and running dev server manually.

3. **Phase 3: Replace existing usage**
    - Objective: Replace a couple of existing `Translate` usages (FAQ answers) with `MarkdownI18n`.
    - Files/Functions to Modify/Create: `src/components/landing/LandingPageFAQ/index.tsx`, `i18n/**/code.json` entries for those messages.
    - Tests to Write: Ensure localized versions still render and build passes.
    - Steps:
        1. Replace `<Translate>` in `LandingPageFAQ` answers with `MarkdownI18n` while preserving `id`.
        2. Update `defaultMessage` to use Markdown (e.g., convert link text and maintain punctuation). For now, just use the same text; in follow-ups markdown can be applied more.
        3. Confirm `i18n` JSON entries exist for the chosen ids; if not, create them in `i18n/en/code.json` (and `i18n/ja` as needed) with the message matching `defaultMessage`.
        4. Build and check the UI local preview.

**Open Questions**
1. Should short labels/titles (e.g., headings or nav labels) also be converted to `MarkdownI18n`? (Usually no; keep `Translate` for short single-line labels.)
2. Do you want to adopt a naming suffix (like `.markdown`) for messages that are Markdown-only? Optionally yes for clarity.
3. Do you prefer `react-markdown` plugins (e.g., to enable link parsing) or keep default minimal features initially? (I'll keep it minimal unless asked otherwise.)

Once you approve the plan I'll implement Phase 1 changes (add dependency) and proceed.
