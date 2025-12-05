import type { NotionProxyData } from './types';
import { createAdminClient } from './server';

// Helper functions for common queries that avoid TypeScript complexity
export async function getProxyData(proxyId: string) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('notion_proxy_data')
    .select('data')
    .eq('proxy_id', proxyId);
    
  return { data, error };
}

export async function getAllProxyData() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('notion_proxy_data')
    .select('proxy_id');
    
  return { data, error };
}

export async function getAllProxies() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from('notion_proxies')
    .select('id, notion_database_name, last_synced, items_count')
    .order('created_at', { ascending: false });
    
  return { data, error };
}