import { supabase } from '../lib/supabase';

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function fetchCustomer(id) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createCustomer(customerData) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomer(id, customerData) {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomer(id) {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}