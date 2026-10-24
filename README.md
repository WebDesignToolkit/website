# website

A fast, searchable, responsive static front end for the canonical WebDesignToolkit catalog.

WebDesignToolkit is a community-maintained, zero-cost-first directory of open-source resources for building better websites. We prefer evidence over hype, original documentation over copied descriptions, and agent-readable formats over loose bookmarks.

## Start here

- [.github](https://github.com/WebDesignToolkit/.github) — Organization governance, contribution standards, agent guardrails and public profile.
- [catalog](https://github.com/WebDesignToolkit/catalog) — Canonical catalog of open-source tools, design resources and verified source metadata.
- [skills](https://github.com/WebDesignToolkit/skills) — Reusable AI-agent skills for research, web design, accessibility and tool evaluation.
- [mcp-servers](https://github.com/WebDesignToolkit/mcp-servers) — MCP server directory, compatibility notes and safe setup guides.
- [workflows](https://github.com/WebDesignToolkit/workflows) — Repeatable web-design agency procedures from intake to delivery.
- [design-system](https://github.com/WebDesignToolkit/design-system) — Shared hardline tactile design tokens, CSS primitives and examples.
- [knowledgebase](https://github.com/WebDesignToolkit/knowledgebase) — Evidence-backed guides, architectural decisions and tool comparisons.
- [website](https://github.com/WebDesignToolkit/website) — Searchable zero-dependency WebDesignToolkit resource portal.

## Principles

- Favor free and open-source projects; record actual license evidence, never assume.
- Curate links and original summaries instead of copying source code.
- Every proposal retains source, review status and dates.
- Keep AI automation controlled, auditable and minimally privileged.
- No GitHub Actions workflows or unauthorized third-party crawling.

## Local preview

From this directory, run python -m http.server 8000 and open http://localhost:8000. Search and category filtering work with the local generated JSON snapshot.

## Updating the public directory

1. Clone catalog beside website.
2. Run python scripts/sync_catalog.py ../catalog/data/resources.json
3. Inspect, commit and push generated data/resources.json.
4. Publish by approved static hosting (for example GitHub Pages manually configured after public access review).

No npm install, trackers, remote JavaScript, server, or GitHub Actions required.

## Contributing

Read [organization contributor guidance](https://github.com/WebDesignToolkit/.github/blob/main/CONTRIBUTING.md) and [agent guardrails](https://github.com/WebDesignToolkit/.github/blob/main/AGENTS.md).
