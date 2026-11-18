# Thabza Phenomenal — Website 2026
A premium mobile-friendly service catalogue and content management dashboard.

## Live repository
https://github.com/cmstudiop-ops/thabzaphenomenal

## Hosting
This is a static GitHub Pages site. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**. Publish first on the temporary github.io address. Do not point the existing domain at the new site until it is tested.

## Supabase
Uses the existing Photography project (project ref: tjlanldknskbahzxwecw), but all new Thabza tables have the `tp_` prefix. The initial migration created categories, products, tier prices, portfolio, admin roles and an image storage bucket. No Photography data was edited.

## First admin account
1. In the **Photography** Supabase dashboard, go to **Authentication → Users**. Create/invite the intended Thabza administrator or use an existing authorized account.
2. Copy their **User UID** (not their email).
3. In **SQL Editor**, run:
```sql
insert into public.tp_admins(user_id) values ('PASTE-USER-UUID-HERE')
on conflict (user_id) do nothing;
```
4. Visit the website `#admin` and sign in using that account.
Only an owner-authorized account should be added.

## Content management
Admins can add/edit/delete categories, products, bulk quantity tiers and portfolio images. Photos can be uploaded to the dedicated `tp-public` bucket. Customer enquiries open WhatsApp with prefilled details; this is *not* payment checkout.

## Before launch
- Upload the exact official company logo as `logo.png` and update the header's brand markup.
- Enter real verified product prices and add photos to the admin portal.
- Add actual social links and verify all public business details.
- Test mobile / desktop, accessibility and security.
- Configure a verified South African payment provider and server-verified pricing before enabling online checkout.
- Configure DNS for thabzaphenomenal.co.za and permanent redirects from thabzaphenomenal.site only after the new site is ready.
- Review Supabase project's existing security advisories (some relate to older, unrelated applications).
