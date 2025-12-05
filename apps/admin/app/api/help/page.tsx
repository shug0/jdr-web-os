import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  TypographyH3,
  TypographyP,
} from "@workspace/ui/components/custom/typography";
import { useToast } from "@workspace/ui/hooks/use-toast";

export default function ApiHelpPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <TypographyH3>Notion Proxy API</TypographyH3>
            <TypographyP>
              Cette API permet d'accéder aux données de vos bases Notion via un
              proxy public.
            </TypographyP>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">Endpoints</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium">GET /api/notion-proxy/:proxyId</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Récupère les données d'un proxy Notion spécifique.
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Exemple de requête:</p>
                  <pre className="bg-black text-white p-2 rounded text-sm mt-1 overflow-x-auto">
                    {`fetch('https://votre-domaine.com/api/notion-proxy/abc123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})`}
                  </pre>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium">GET /api/proxy-check/:proxyId</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Vérifie si un proxy existe sans récupérer ses données.
                </p>
                <div className="mt-2">
                  <p className="text-sm font-medium">Exemple de requête:</p>
                  <pre className="bg-black text-white p-2 rounded text-sm mt-1 overflow-x-auto">
                    {`fetch('https://votre-domaine.com/api/proxy-check/abc123', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})`}
                  </pre>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">
              Résolution des problèmes courants
            </h3>
            <div className="space-y-2">
              <div>
                <h4 className="font-medium">Erreur "Proxy not found"</h4>
                <p className="text-sm text-gray-600">
                  Vérifiez que l'ID du proxy est correct et que le proxy existe.
                  Utilisez l'endpoint /api/proxy-check/:proxyId pour vérifier.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Problèmes CORS</h4>
                <p className="text-sm text-gray-600">
                  Si vous rencontrez des erreurs CORS, assurez-vous que votre
                  requête est correctement formatée. L'API accepte les requêtes
                  de toutes les origines.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Données vides</h4>
                <p className="text-sm text-gray-600">
                  Si vous recevez un tableau vide, cela peut signifier que le
                  proxy existe mais qu'aucune donnée n'a été synchronisée.
                  Utilisez le bouton "Sync" dans le dashboard.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-2">
              Exemple d'utilisation avec JavaScript
            </h3>
            <pre className="bg-black text-white p-4 rounded text-sm overflow-x-auto">
              {`// Exemple de code pour récupérer les données d'un proxy
async function fetchProxyData(proxyId) {
  try {
    const response = await fetch(\`https://votre-domaine.com/api/notion-proxy/\${proxyId}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || \`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching proxy data:', error);
    throw error;
  }
}`}
            </pre>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
