# Khmer School Memory Archive

**Live site:** https://tokata-achive.vercel.app

## 1. What this archive is

Khmer School Memory Archive is an image-first oral-history collection preserving personal Cambodian school memories across generations. Its records are contributed by Cambodian students, families, teachers, and community members. Visitors can browse and search published memories by keyword, province, school level, and decade; registered contributors can submit their own photographs and stories for review before they become public.

## 2. Who it is for

This archive is for Cambodian students, families, teachers, community members, and people interested in Cambodia's educational history. Khmer and English are available across the public archive, contributor pages, and review dashboard, so Khmer is treated as a first-class archive language rather than a translation afterthought. The responsive layout supports phone-sized screens, and archive-list images load lazily to reduce the initial load.

Records name the contributor unless that contributor chooses to appear anonymously. Every contributor supplies a first-person memory and confirms that they own, or have permission to share, the photograph they submit. The form repeats this permission requirement before upload.

## 3. How it works

The site uses Next.js 15 and React 19, deployed on Vercel. Supabase provides authentication, Postgres data, and photo storage.

### Database structure

- `entries` stores entry ownership, photograph URL, title, image description, story, province, school level, memory year, display name, and status.
- `entry_review_feedback` stores the latest private feedback for a returned entry.
- `notifications` stores submission and review-result notifications.
- `profiles` provides a limited account directory for administrators.
- `user_roles` assigns `admin` and `reviewer` roles.
- `entry_review_history` records publish and return decisions.

Entries have three statuses:

1. `pending` — waiting for review.
2. `published` — visible in the public archive.
3. `returned` — sent back to the contributor with feedback.

Row Level Security policies set these access rules:

- Logged-out visitors can read only published entries.
- Contributors can create, read, edit, and delete only their own entries.
- New or edited contributor entries are pending review.
- Reviewers can read pending entries and review history, but cannot review their own submissions.
- Administrators can manage roles and archive entries.
- Notification rows are visible only to their recipient.
- Return feedback is visible only to the entry owner and reviewers.

The public archive explicitly queries published records. The separate **My entries** page lets contributors search and filter their own pending, published, and returned entries.

## 4. Security decisions

The `review_entry` Postgres function is the publication gate. It is the only operation that can publish or return an entry. It verifies that the caller is a reviewer or administrator, that the entry is still pending, that the reviewer does not own the entry, and that a return decision includes 5–1,000 characters of feedback. It also creates review-history records and updates feedback where appropriate.

This function lives in the database because a hidden Publish button is not security: someone could still use the browser console or call the API directly. The database function and Row Level Security policies protect the status change regardless of which client makes the request.

Other decisions:

- **Returned entries include an explanation.** Contributors receive private feedback so they know what to change before resubmitting.
- **Reviewers cannot remove published entries through the review gate.** The gate decides only pending entries. An administrator can edit an entry, which returns it to pending review, or delete it when necessary.
- **Contributors can see their own non-public work.** Public browsing shows published entries only, while My entries shows the contributor's pending, published, and returned records.
- **Reviewers cannot approve themselves.** The queue and `review_entry` function exclude entries owned by the current reviewer.
- **Roles live in database-controlled tables.** Authorization uses `user_roles`, not editable contributor profile metadata.

## 5. AI use

I used AI as a planning and coding assistant throughout the project. I reviewed AI output before keeping it and made the final decisions about the archive's content, design, security rules, and deployed behavior.

| Model and mode | Tasks | Review and verdict |
| --- | --- | --- |
| GPT-5.6 Sol — Plan mode | Read the repository, analyzed architecture and security, planned changes, and drafted documentation. | I checked technical claims against the JavaScript, SQL policies, and live site, then rewrote unsupported or unclear details. |
| GPT-5.5 — Act mode | Helped implement and revise archive features, interface components, validation, and Supabase integration. | I reviewed diffs, ran the application, and kept changes that matched the archive requirements. |
| GPT-5.6 Terra — Act mode | Helped implement and revise contributor, reviewer, administrator, notification, and dashboard features. | I reviewed generated code and tested affected workflows instead of treating generated output as proof that the feature was secure. |

Authorization is checked against database policies and database functions, not only against the controls visible in the interface. On November 22, 2026, `node --test lib/*.test.js` passed all 23 repository unit tests. The final live-account test matrix is listed in the submission checklist below.

## 6. Sources and credits

The archive was created and curated by **Panhaseth SUY**. Every record is a first-person memory submitted by its contributor. Contributors choose whether to display their name or appear anonymously, and they confirm that they own or have permission to share the submitted image.

| Entry | Memory source | Place | Photo credit |
| --- | --- | --- | --- |
| The exercise that got me fall in love with my middle school crush | First-person account submitted by Master Oori | Prey Veng | Photo by Master Oori, used with permission |
| Kim heng memory | First-person account submitted by Kim Heng | Phnom Penh | Photo by Kim Heng, used with permission |
| Memories of Studying Together | First-person account submitted by Archive Contributor | Siem Reap | Photo by Archive Contributor, used with permission |
| Another day to make my parents proud | First-person account from a contributor who chose to remain anonymous | Siem Reap | Photo by anonymous contributor, used with permission |
| An Unforgettable Cambodian Island | First-person account from a contributor who chose to remain anonymous | Koh Kong | Photo by anonymous contributor, used with permission |
| Siem Reap trip with Environment class | First-person account from a contributor who chose to remain anonymous | Siem Reap | Photo by anonymous contributor, used with permission |
| Last Ever High School Group Photo Before BacII | First-person account submitted by Sros Pheaktra | Kratie | Photo by Sros Pheaktra, used with permission |
| API Class | First-person account submitted by Nita | Phnom Penh | Photo by Nita, used with permission |
| My first solve | First-person account from a contributor who chose to remain anonymous | Siem Reap | Photo by anonymous contributor, used with permission |
| Exchange Program AT BUPT | First-person account submitted by Panhaseth SUY | Phnom Penh / Beijing University of Posts and Telecommunications | Photo by Panhaseth SUY, used with permission |

## 7. Running it locally

```bash
git clone https://github.com/tokata453/Khmer-School-Memory-Archive.git
cd Khmer-School-Memory-Archive
npm install
npm run dev
```

Open http://localhost:3000.

Create `.env.local` with these variable names only:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Never commit `.env.local`, a secret key, or a Supabase `service_role` key. The Supabase publishable key is intentionally available to the browser; Row Level Security and database privileges protect the data.

Useful commands:

```bash
npm run build
npm start
node --test lib/*.test.js
```

## 8. Submission checklist

- [x] Live URL loads logged out and shows published entries only: https://tokata-achive.vercel.app
- [x] Logged out, the live Supabase API returned zero pending or returned entries on November 22, 2026.
- [x] Logged out, a direct `review_entry` API request was refused with PostgreSQL error `42501` on November 22, 2026.
- [x] `git grep` history scan found no committed `.env` file, JWT, Supabase secret key, or `service_role` assignment on November 22, 2026.
- [x] At least eight real entries each have a credited source: 10 published entries are listed above.
- [x] The live project responded on November 22, 2026.
- [ ] Apply `supabase/lab14_ownership_and_province_patch.sql`, `supabase/lab15_review_entry_parameter_patch.sql`, and `supabase/lab16_review_feedback_delete_patch.sql` in the Supabase SQL Editor; record the verification-query results.
- [ ] Use separate contributor, reviewer, administrator, and stranger accounts to test contribution, review, ownership, and console attacks; record the date and results.
- [ ] Test Khmer on public, contributor, reviewer, and administrator pages.
- [ ] Test the live site at a phone width, check primary pages for console errors, and record the device or browser width.
- [ ] Confirm that `jesseorndorff` is an accepted collaborator on this repository.
- [ ] Confirm the demo-video link opens in a private window, paste the reflection into Canvas, post in Show Your Archive, and book the Q&A slot.
