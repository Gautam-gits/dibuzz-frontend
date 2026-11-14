-- Phase B: enforce server-side access control for browser-accessible data.
-- Review and run in the Supabase SQL Editor after backing up production.
-- This intentionally removes the legacy plaintext profiles.password column.

begin;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles drop column if exists password;

-- Remove legacy permissive policies before installing the explicit policies below.
do $$
declare policy_row record;
begin
  for policy_row in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'internship_applications', 'resource_progress', 'certificates', 'internship_modules', 'internship_resources', 'internships', 'courses', 'faqs', 'team_members', 'transactions')
  loop
    execute format('drop policy if exists %I on %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  end loop;
end;
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles: self or admin can read" on public.profiles;
drop policy if exists "profiles: self or admin can update" on public.profiles;
create policy "profiles: self or admin can read"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy "profiles: self or admin can update"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

alter table public.internship_applications enable row level security;
drop policy if exists "applications: students read own, admins read all" on public.internship_applications;
drop policy if exists "applications: students create own" on public.internship_applications;
drop policy if exists "applications: admins manage" on public.internship_applications;
create policy "applications: students read own, admins read all"
  on public.internship_applications for select to authenticated
  using (student_id = auth.uid() or public.is_admin());
create policy "applications: students create own"
  on public.internship_applications for insert to authenticated
  with check (student_id = auth.uid());
create policy "applications: admins manage"
  on public.internship_applications for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

alter table public.resource_progress enable row level security;
drop policy if exists "progress: students manage own, admins read" on public.resource_progress;
create policy "progress: students manage own, admins read"
  on public.resource_progress for all to authenticated
  using (student_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or public.is_admin());

alter table public.certificates enable row level security;
drop policy if exists "certificates: students read own, admins manage" on public.certificates;
create policy "certificates: students read own, admins manage"
  on public.certificates for all to authenticated
  using (student_id = auth.uid() or public.is_admin())
  with check (public.is_admin());

alter table public.internship_modules enable row level security;
alter table public.internship_resources enable row level security;
drop policy if exists "modules: enrolled students or admins read" on public.internship_modules;
drop policy if exists "modules: admins manage" on public.internship_modules;
drop policy if exists "resources: enrolled students or previews read" on public.internship_resources;
drop policy if exists "resources: admins manage" on public.internship_resources;
create policy "modules: enrolled students or admins read"
  on public.internship_modules for select to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.internship_applications a
      where a.internship_id = internship_modules.internship_id
        and a.student_id = auth.uid()
        and a.status in ('accepted', 'enrolled', 'completed')
    )
  );
create policy "modules: admins manage"
  on public.internship_modules for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "resources: enrolled students or previews read"
  on public.internship_resources for select to authenticated
  using (
    is_preview or public.is_admin() or exists (
      select 1
      from public.internship_modules m
      join public.internship_applications a on a.internship_id = m.internship_id
      where m.id = internship_resources.module_id
        and a.student_id = auth.uid()
        and a.status in ('accepted', 'enrolled', 'completed')
    )
  );
create policy "resources: admins manage"
  on public.internship_resources for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

alter table storage.objects enable row level security;
drop policy if exists "certificates: owner download or admin manage" on storage.objects;
drop policy if exists "certificates: admins upload" on storage.objects;
create policy "certificates: owner download or admin manage"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'certificates' and (
      public.is_admin() or exists (
        select 1 from public.certificates c
        where c.file_path = storage.objects.name and c.student_id = auth.uid()
      )
    )
  );
create policy "certificates: admins upload"
  on storage.objects for all to authenticated
  using (bucket_id = 'certificates' and public.is_admin())
  with check (bucket_id = 'certificates' and public.is_admin());

-- Public catalogue data is readable; changes are always server-authorized.
alter table public.internships enable row level security;
alter table public.courses enable row level security;
alter table public.faqs enable row level security;
alter table public.team_members enable row level security;
alter table public.transactions enable row level security;
create policy "internships: public read, admins manage"
  on public.internships for select to anon, authenticated using (true);
create policy "internships: admins manage"
  on public.internships for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "courses: public read, admins manage"
  on public.courses for select to anon, authenticated using (true);
create policy "courses: admins manage"
  on public.courses for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "faqs: public read, admins manage"
  on public.faqs for select to anon, authenticated using (true);
create policy "faqs: admins manage"
  on public.faqs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "team: public read, admins manage"
  on public.team_members for select to anon, authenticated using (true);
create policy "team: admins manage"
  on public.team_members for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "transactions: admins manage"
  on public.transactions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

commit;
