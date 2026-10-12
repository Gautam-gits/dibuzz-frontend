import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'D';

// Published team members for the About page
export function useTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
        .order('id');
      if (active) {
        setMembers(error ? [] : data || []);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { members, loading };
}
