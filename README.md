# ORSA Recruitment Management System

A secure, full-stack international recruitment and employee management web application built for **Orsa** — an international recruitment agency that recruits and manages workers who apply for employment opportunities abroad.

---

## 🎨 Visual Design & Brand Identity
- **Primary Background**: `#09090B`
- **Secondary Background**: `#141416`
- **Card Background**: `#1D1D20`
- **Primary Accent**: `#E50914` (Orsa Red)
- **Secondary Accent**: `#B91C1C`
- **Primary Text**: `#FAFAFA`
- **Secondary Text**: `#A1A1AA`
- **Borders**: `#303036`

---

## 🚀 Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui design patterns
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Forms & Validation**: React Hook Form + Zod
- **Icons & Charts**: Lucide React + Recharts
- **PDF Generation**: `@react-pdf/renderer` (A4 corporate letters)

---

## 📂 Route Map

### Public Routes
- `/login` — Unified login portal supporting role-based redirects and personalized reference hints

### Protected Administrator Routes
- `/admin` — Executive dashboard featuring metrics cards, registration velocity line charts, and job offer donut charts
- `/admin/employees` — Searchable, filterable candidate database with masked passport numbers and CSV export
- `/admin/employees/new` — Secure registration flow with photo upload and temporary credential generation
- `/admin/employees/[id]` — 6-tab comprehensive candidate dossier (Overview, Personal, Passport, Offer Letter, Security, Audit History)
- `/admin/employees/[id]/edit` — Candidate record editor
- `/admin/sub-admins` — Super admin management portal for sub-administrators and candidate visibility assignment
- `/admin/letters` — Directory of all candidate employment application letters and version states
- `/admin/letters/templates` — Preset template management for job offers
- `/admin/letters/[id]` — Split-screen typeset editor with live A4 preview, dynamic variable insertion, version locking, and PDF generation
- `/admin/reports` — Executive recruitment funnel metrics and pipeline analytics
- `/admin/audit-logs` — Immutable administrative event log
- `/admin/settings` — System security, RLS enforcement, and credential entropy standards

### Candidate Portal Routes
- `/employee` — Candidate overview dashboard with status metrics and offer summary
- `/employee/profile` — Verified registration dossier and masked identification details
- `/employee/application-letter` — Verified offer letter reader and authenticated PDF download
- `/employee/security` — Credential rotation and first-login password update

---

## 🗄️ Database Migrations
Migrations are located in `supabase/migrations/`:
1. `001_initial_schema.sql` — Profiles, employees, job_offers, letter_templates, application_letters, letter_versions, sub_admin_assignments, audit_logs, notifications, and employee_login_refs
2. `002_rls_policies.sql` — Strict Row Level Security policies for super_admin, sub_admin, and employee roles
3. `003_seed_data.sql` — Initial job categories (Construction Worker, Industrial Factory Worker, Warehouse Worker) and default templates
4. `004_storage.sql` — Private storage buckets (`employee-photos` & `employee-documents`) with signed URL access

---

## ⚙️ Initial Super Admin Setup

1. Copy `.env.example` to `.env.local` and configure your Supabase keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. Run the database migrations in your Supabase SQL editor:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_seed_data.sql`
   - `004_storage.sql`

3. Create the initial Super Admin account via SQL:
   ```sql
   -- Create user in auth.users or use Supabase Auth Dashboard, then link to profiles:
   INSERT INTO profiles (id, full_name, email, role, account_status, must_change_password)
   VALUES (
     '<USER_AUTH_UUID>',
     'Executive Administrator',
     'admin@orsa.com',
     'super_admin',
     'active',
     false
   );
   ```

---

## 🛠️ Development & Production

```bash
# Run development server
npm run dev

# Run production build
npm run build

# Start production server
npm start
```
