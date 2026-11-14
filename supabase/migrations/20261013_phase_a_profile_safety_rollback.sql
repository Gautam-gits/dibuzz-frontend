-- DIBUZZ Phase A rollback: remove the profile system-field protection.
-- Run only if the Phase A migration must be rolled back.

begin;

drop trigger if exists prevent_student_profile_system_field_changes on public.profiles;
drop function if exists public.prevent_student_profile_system_field_changes();

commit;
