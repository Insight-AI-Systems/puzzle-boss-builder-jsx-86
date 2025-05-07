
CREATE OR REPLACE FUNCTION public.create_column_check_view(table_name text, column_name text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  EXECUTE FORMAT('
    CREATE OR REPLACE VIEW _column_check_view AS
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = ''public''
        AND table_name = %L
        AND column_name = %L
    ) as exists', table_name, column_name);
END;
$$;
