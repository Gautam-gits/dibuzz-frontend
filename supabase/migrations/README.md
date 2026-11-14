# DIBUZZ database migrations

Each migration has a matching rollback file. Back up the Supabase database before running any migration.

`20261013_phase_a_profile_safety.sql` protects profile fields that students must not be able to edit: their ID, email, role, enrolments, and certificates. Students can still update their personal and application details. The rollback file removes only this protection.
