import { createClient } from "@workspace/data/server";
import { redirect } from "next/navigation";

export default async function TestDbPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // Test de lecture des tables
  const { data: proxies, error: proxiesError } = await supabase
    .from("notion_proxies")
    .select("*");

  const { data: proxyData, error: proxyDataError } = await supabase
    .from("notion_proxy_data")
    .select("*")
    .limit(5);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test Base de Données</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">👤 Utilisateur connecté</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🗂️ Notion Proxies</h2>
        {proxiesError ? (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            Erreur: {proxiesError.message}
          </div>
        ) : (
          <div className="bg-success/10 border border-success rounded-lg p-4">
            <p className="mb-3">✅ {proxies?.length || 0} proxies trouvés</p>
            {proxies?.map((proxy) => (
              <div key={proxy.id} className="bg-white p-3 rounded border mb-2">
                <p><strong>{proxy.notion_database_name}</strong></p>
                <p className="text-sm text-gray-600">ID: {proxy.notion_database_id}</p>
                <p className="text-sm">Public: {proxy.is_public ? "Oui" : "Non"} | Items: {proxy.items_count}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📄 Proxy Data (échantillon)</h2>
        {proxyDataError ? (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            Erreur: {proxyDataError.message}
          </div>
        ) : (
          <div className="bg-muted border border-muted rounded-lg p-4">
            <p className="mb-3">✅ {proxyData?.length || 0} entrées trouvées</p>
            {proxyData?.map((data) => {
              let parsedData: Record<string, unknown> = {};
              try {
                parsedData = typeof data.data === 'string' 
                  ? JSON.parse(data.data) as Record<string, unknown>
                  : (data.data as Record<string, unknown>) || {};
              } catch {
                parsedData = { error: "Cannot parse data" };
              }
              
              const getTitle = (obj: Record<string, unknown>): string => {
                if (typeof obj.title === 'string') return obj.title;
                if (typeof obj.name === 'string') return obj.name;
                return "Sans titre";
              };
              
              return (
                <div key={data.id} className="bg-white p-3 rounded border mb-2">
                  <p><strong>{getTitle(parsedData)}</strong></p>
                  <p className="text-sm text-gray-600">Page: {data.notion_page_id}</p>
                  <p className="text-xs bg-gray-100 p-2 mt-2 rounded">
                    {JSON.stringify(parsedData, null, 2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">🔧 Configuration Supabase</h3>
        <p className="text-sm text-gray-600">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
        <p className="text-sm text-gray-600">
          Environnement: {process.env.NODE_ENV}
        </p>
      </div>
    </div>
  );
}