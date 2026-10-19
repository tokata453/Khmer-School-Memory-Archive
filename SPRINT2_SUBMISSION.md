# Sprint 2 submission worksheet

## Links

- Live URL: https://tokata-achive.vercel.app
- Repository: https://github.com/tokata453/TOKATA-ACHIVE

## Prompt Journal

Use real prompts only. Paste two earlier prompts from chat history before submission. Do not invent them.

### Entry 1 — October 19, 2026

**Prompt as sent:** The Sprint 2 submission and rubric prompt beginning, “help me to complete sprint2 submission...”

**Technique:** Rubric-driven prompting

**What came back:** Repository audit against five rubric rows; fixes for edit data loss, Khmer contributor text, database input constraints, grant hardening, and submission checks.

**What I changed before accepting:** [Student: state one change you requested or made after reviewing this work.]

### Entry 2 — [date work happened]

**Prompt as sent:** [Paste exact earlier prompt.]

**Technique:** [Name used technique, such as iterative prompting, role prompting, or constraint prompting.]

**What came back:** [Summarize result.]

**What I changed before accepting:** [Name your review change.]

### Entry 3 — [date work happened]

**Prompt as sent:** [Paste exact earlier prompt.]

**Technique:** [Name technique.]

**What came back:** [Summarize result.]

**What I changed before accepting:** [Name your review change.]

## Reflection draft — personalize before submitting

### What did you build, and what security decision did you make that the brief did not make for you?

I built contributor signup and login, a form for adding a Khmer school memory with text and a photo, and owner-only edit and delete controls. New published entries appear in the same archive visitors can browse and search. I chose to enforce ownership in PostgreSQL Row Level Security, not only by hiding buttons. Insert policy requires `owner_id = auth.uid()`. Update uses both `USING` and `WITH CHECK`, and delete uses `USING`, so another signed-in account cannot change or remove an entry through browser console requests. I also restricted photo uploads to a folder named with signed-in user's ID and limited file type and size in Storage.

### Where did AI get security wrong, and how did you catch it?

AI first focused on interface ownership checks, but interface checks are not security because someone can call Supabase directly from browser console. I caught this by reading generated SQL and comparing it with attack described in rubric. Final design puts authorization in database RLS and checks failed mutations return no row. I also found database needed explicit length constraints because client-side validation can be bypassed. I kept same rules in database so junk console input is refused.

> Replace first sentence if this does not match your real AI conversation. Instructor rewards honest specifics.

### What worries you about your archive that you did not fix, and what would fixing it take?

Photo cleanup still worries me. Form uploads photo before database row is saved, so failed insert can leave unused file. Replacing or deleting entry also does not remove old photo. This wastes storage but does not weaken entry ownership. Fix needs storing object path, then a trusted server action or database-backed cleanup process that deletes old object only after ownership is verified and entry change succeeds. It also needs tests for failed inserts, replacement, and deletion so cleanup never removes another contributor's photo.

## Ownership rules: answers for review

1. **What does policy do?** Public can select published entries. Signed-in users can insert rows only with own user ID, and update/delete only rows whose `owner_id` matches `auth.uid()`.
2. **Why is it here?** Browser code and hidden controls can be bypassed. RLS applies at database for UI and direct API/console requests.
3. **What breaks without it?** Any person holding public publishable key could forge owner ID, edit another person's story, or delete archive records.

## Final manual checks

- [ ] Run latest `supabase/lab7_entries.sql` in Supabase SQL Editor.
- [ ] Supabase project shows Active, not Paused.
- [ ] Vercel environment has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- [ ] Deploy latest `main`; open live URL in private window.
- [ ] Logged out: browse and search work; six real records show; Khmer search works.
- [ ] New account: signup/login works; add Khmer text plus JPEG/PNG/WebP under 5 MB; credit and photo show.
- [ ] Account A creates entry. Account B sees no edit/delete controls.
- [ ] Account B direct Supabase update/delete for A row returns no changed row.
- [ ] Account A can edit/delete own row.
- [ ] Run SQL Editor Security Advisor; resolve unexpected warnings.
- [ ] Confirm instructor remains GitHub collaborator.
- [ ] Replace all bracketed Prompt Journal text with real history.
- [ ] Personalize reflection; do not submit claim that did not happen.