-- Allow anon role to read and update tables
-- (used while login is hardcoded, not Supabase Auth)

CREATE POLICY "Enable read access for anon"
ON public.tables FOR SELECT
TO anon
USING (true);

CREATE POLICY "Enable update access for anon"
ON public.tables FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);
