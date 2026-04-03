-- Enable uuid-ossp extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables reservation table
CREATE TABLE public.tables (
    table_number INTEGER PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'paid')),
    buyer_name TEXT,
    buyer_phone TEXT,
    price NUMERIC(10, 2),
    seller_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins/authenticated users can read all tables
CREATE POLICY "Enable read access for authenticated users" 
ON public.tables FOR SELECT 
TO authenticated 
USING (true);

-- Authenticated users can update tables
CREATE POLICY "Enable update access for authenticated users"
ON public.tables FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can insert tables
CREATE POLICY "Enable insert access for authenticated users"
ON public.tables FOR INSERT
TO authenticated
WITH CHECK (true);

-- Initial insertion of the 37 tables based on the map
INSERT INTO public.tables (table_number)
SELECT generate_series(1, 37);

-- Create a trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tables_modtime
    BEFORE UPDATE ON public.tables
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
