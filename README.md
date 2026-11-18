# Thabza Phenomenal — Website and Admin Control Centre

## Project links
- GitHub repository: https://github.com/cmstudiop-ops/thabzaphenomenal
- Storefront: `index.html`
- Company page: `about.html`
- Portfolio: `portfolio.html`
- Administrator portal: **`admin.html`**
- Public site settings handler: `site-settings.js`

The website is hosted as static files through GitHub Pages when publishing is enabled. In GitHub **Settings → Pages**, deploy branch `main` from `/(root)`. Do not move the .co.za domain until the new site has been fully tested.

## Database
Uses the existing Photography Supabase project `tjlanldknskbahzxwecw`, with all Thabza data held in tables beginning with `tp_`. Portfolio, categories, products, bulk pricing, order records, administrator roles and public website settings are stored separately from Photography tables. All exposed Thabza tables use RLS and restricted SQL grants.

## Administrator account
The **verified** Supabase Auth user `admin@thabzaphenomenal.co.za` has been assigned a Thabza administrator role in `tp_admins`. No password was created, disclosed or changed through the website build.

Open `admin.html` on the published site and sign in using that account's existing password. If the password is unknown, use the **Forgot password** flow; Supabase Auth URL configuration must permit the deployed `admin.html` redirect. Ensure email/password authentication is enabled in the Supabase Authentication provider settings. Never store passwords or API secrets in this repository.

## Admin functions
- Overview: genuine counts for the Thabza database (no invented analytics)
- Orders: view and manually update recorded order status and notes
- Products: create, edit, hide, sort and upload product photos
- Categories: create, edit, sort, hide and upload category images
- Bulk pricing: set per-product quantity tiers and validate overlapping ranges
- Portfolio: upload images, set category and order, publish or unpublish
- Website settings: company details, contact info, WhatsApp number, hero content, public artwork, accent colour, SEO, social links, portfolio headline and section visibility
- Security: account details, password change, sign out

### Notes about live operations
Website settings are **public display data only**. Never paste payment credentials, passwords or private API keys into settings fields. Logo/hero changes uploaded from admin are served from the `tp-public` Supabase Storage bucket and override GitHub defaults. Category images and product images are independently uploadable.

The current customer enquiry process opens WhatsApp; these conversations **do not become order records automatically**. Likewise, there is no verified online payment checkout yet. To accept paid online orders later, implement server-side price calculation, secure payment gateway webhooks and transaction verification before enabling checkout.

## Ready for launch checklist
1. Open and check `admin.html` with the authorised email/password.
2. Verify each tab can save and that public site changes appear after refresh.
3. Upload authentic product, category and portfolio photos, and confirm published content.
4. Verify telephone, WhatsApp, email, address, website notices and company details.
5. Confirm Pages publishing and password-reset redirect allowlist in Supabase Auth.
6. Test responsive desktop/mobile display and avoid publishing unverified pricing.
7. Configure the .co.za domain and redirects only after approval.
8. Review Supabase security advisors on the shared Photography project; some findings predate this website.
