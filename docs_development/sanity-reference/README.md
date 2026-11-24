# Sanity reference

The old Sanity Studio this site used before it became a full app. **Reference only: it is not part of the
app and does not run.** It is excluded from type-checking and linting.

| Folder | Use it for |
| --- | --- |
| `schemaTypes/` | The content model: the starting shape for the database tables, and the field descriptions that become help text in the admin forms |
| `scripts/seed.mts` | The demo content: the starting point for `src/db/seed.ts`. The images it names are now in `src/assets/images/`. |
| `components/` | The custom opening-hours and social-profiles inputs: the layout for those admin forms |
| `structure.ts` | How the old Studio grouped content: a starting point for the admin navigation |

Delete this folder once the port is done (step 9 of `docs_development/PLAN.md`).
