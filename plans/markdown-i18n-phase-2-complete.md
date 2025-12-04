## Phase 2 Complete: Implement MarkdownI18n component

TL;DR: Implemented a shared `MarkdownI18n` component that uses Docusaurus `translate()` and `react-markdown` to render i18n messages as Markdown.

**Files created/changed:**
- `src/components/MarkdownI18n.tsx` (new)

**Functions created/changed:**
- `MarkdownI18n` component which accepts `id`, `defaultMessage`, `values`, `className`, and `components` props.

**Tests created/changed:**
- None (manual build-time validation performed)

**Review Status:** APPROVED with minor improvements implemented (include `values` as second arg and link handling improvements).

**Git Commit Message:**
feat: create MarkdownI18n component

- Implement `MarkdownI18n` to render `translate()` strings via `react-markdown`
- Handle internal links via `@docusaurus/Link`
- Include `values` support for future placeholders
