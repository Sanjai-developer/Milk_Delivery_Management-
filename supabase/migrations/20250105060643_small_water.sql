/*
  # Initial Schema for Milk Delivery Management System

  1. New Tables
    - customers
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - phone (text)
      - address (text)
      - default_qty (numeric)
      - created_at (timestamp)
      
    - delivery_records
      - id (uuid, primary key)
      - customer_id (uuid, references customers)
      - delivery_date (date)
      - qty_delivered (numeric)
      - created_at (timestamp)
      
    - milk_rates
      - id (uuid, primary key)
      - rate_per_liter (numeric)
      - effective_from (timestamp)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  default_qty numeric NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own customers"
  ON customers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Delivery records table
CREATE TABLE delivery_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers ON DELETE CASCADE NOT NULL,
  delivery_date date NOT NULL,
  qty_delivered numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage delivery records for their customers"
  ON delivery_records
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = delivery_records.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Milk rates table
CREATE TABLE milk_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rate_per_liter numeric NOT NULL,
  effective_from timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE milk_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read milk rates"
  ON milk_rates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage milk rates"
  ON milk_rates
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_delivery_records_customer_id ON delivery_records(customer_id);
CREATE INDEX idx_delivery_records_delivery_date ON delivery_records(delivery_date);