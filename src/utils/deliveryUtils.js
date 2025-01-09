import { supabase } from '../lib/supabase';

export async function fetchDeliveryHistory(customerId = null, startDate = null, endDate = null) {
  let query = supabase
    .from('delivery_records')
    .select(`
      *,
      customers (
        name,
        default_qty
      )
    `)
    .order('delivery_date', { ascending: false });

  if (customerId) {
    query = query.eq('customer_id', customerId);
  }
  
  if (startDate) {
    query = query.gte('delivery_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('delivery_date', endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function recordDeliveries(deliveries) {
  const { data, error } = await supabase
    .from('delivery_records')
    .insert(deliveries)
    .select();
  if (error) throw error;
  return data;
}

export async function getMilkRate() {
  const { data, error } = await supabase
    .from('milk_rates')
    .select('*')
    .order('effective_from', { ascending: false })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

export async function updateMilkRate(rate) {
  const { data, error } = await supabase
    .from('milk_rates')
    .insert([{ rate_per_liter: rate }])
    .select()
    .single();
  if (error) throw error;
  return data;
}