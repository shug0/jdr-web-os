-- Seed file for jdr-coffee database schema
-- This file only ensures the database schema is properly set up
-- No sample data is created - users will create their own proxies

-- Verify that the required tables exist
DO $$ 
BEGIN
    -- Check if notion_proxies table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notion_proxies') THEN
        RAISE EXCEPTION 'Table notion_proxies does not exist. Please run migrations first.';
    END IF;
    
    -- Check if notion_proxy_data table exists  
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notion_proxy_data') THEN
        RAISE EXCEPTION 'Table notion_proxy_data does not exist. Please run migrations first.';
    END IF;
    
    RAISE NOTICE 'Database schema verified successfully. Tables notion_proxies and notion_proxy_data are ready.';
    RAISE NOTICE 'No sample data created - users will create their own proxies through the application.';
END $$;