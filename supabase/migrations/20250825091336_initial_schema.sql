

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."notion_proxies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "notion_database_id" "text" NOT NULL,
    "notion_database_name" "text" NOT NULL,
    "is_public" boolean DEFAULT true,
    "last_synced" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "items_count" integer DEFAULT 0
);


ALTER TABLE "public"."notion_proxies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notion_proxy_data" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "proxy_id" "uuid" NOT NULL,
    "notion_page_id" "text" NOT NULL,
    "data" "jsonb" NOT NULL,
    "last_edited" timestamp without time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notion_proxy_data" OWNER TO "postgres";


ALTER TABLE ONLY "public"."notion_proxies"
    ADD CONSTRAINT "notion_proxies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notion_proxies"
    ADD CONSTRAINT "notion_proxies_user_id_notion_database_id_key" UNIQUE ("user_id", "notion_database_id");



ALTER TABLE ONLY "public"."notion_proxy_data"
    ADD CONSTRAINT "notion_proxy_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notion_proxy_data"
    ADD CONSTRAINT "notion_proxy_data_proxy_id_notion_page_id_key" UNIQUE ("proxy_id", "notion_page_id");



ALTER TABLE ONLY "public"."notion_proxies"
    ADD CONSTRAINT "notion_proxies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."notion_proxy_data"
    ADD CONSTRAINT "notion_proxy_data_proxy_id_fkey" FOREIGN KEY ("proxy_id") REFERENCES "public"."notion_proxies"("id");



CREATE POLICY "Allow public read access for notion_proxies" ON "public"."notion_proxies" FOR SELECT USING (true);



CREATE POLICY "Allow public read access for notion_proxy_data" ON "public"."notion_proxy_data" FOR SELECT USING (true);



CREATE POLICY "Anyone can view public proxy data" ON "public"."notion_proxy_data" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."notion_proxies"
  WHERE (("notion_proxies"."id" = "notion_proxy_data"."proxy_id") AND ("notion_proxies"."is_public" = true)))));



CREATE POLICY "Users can insert data for their proxies" ON "public"."notion_proxy_data" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."notion_proxies"
  WHERE (("notion_proxies"."id" = "notion_proxy_data"."proxy_id") AND ("notion_proxies"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can insert their own proxies" ON "public"."notion_proxies" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update data for their proxies" ON "public"."notion_proxy_data" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."notion_proxies"
  WHERE (("notion_proxies"."id" = "notion_proxy_data"."proxy_id") AND ("notion_proxies"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can update their own proxies" ON "public"."notion_proxies" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view data from their proxies" ON "public"."notion_proxy_data" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."notion_proxies"
  WHERE (("notion_proxies"."id" = "notion_proxy_data"."proxy_id") AND ("notion_proxies"."user_id" = "auth"."uid"())))));



CREATE POLICY "Users can view their own proxies" ON "public"."notion_proxies" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."notion_proxies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notion_proxy_data" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



































































































































































































GRANT ALL ON TABLE "public"."notion_proxies" TO "anon";
GRANT ALL ON TABLE "public"."notion_proxies" TO "authenticated";
GRANT ALL ON TABLE "public"."notion_proxies" TO "service_role";



GRANT ALL ON TABLE "public"."notion_proxy_data" TO "anon";
GRANT ALL ON TABLE "public"."notion_proxy_data" TO "authenticated";
GRANT ALL ON TABLE "public"."notion_proxy_data" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
