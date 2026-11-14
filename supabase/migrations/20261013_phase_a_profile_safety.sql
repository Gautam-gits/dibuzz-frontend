-- DIBUZZ Phase A: protect system-managed profile fields.
--
-- Run this in the Supabase SQL Editor only after taking a database backup.
-- This migration does not delete data or alter program/application records.

begin;

-- A student may update their personal details, but never their identity, role,
-- enrolments, or certificates.  Admin updates remain allowed for future admin work.
create or replace function public.prevent_student_profile_system_field_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  if new.id is distinct from old.id
     or new.email is distinct from old.email
     or new.role is distinct from old.role
     or new.enrolled_courses is distinct from old.enrolled_courses
     or new.certificates is distinct from old.certificates then
    raise exception 'You cannot change system-managed profile fields.';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_student_profile_system_field_changes on public.profiles;

create trigger prevent_student_profile_system_field_changes
before update on public.profiles
for each row
execute function public.prevent_student_profile_system_field_changes();

commit;
