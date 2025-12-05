// Test script pour vérifier l'authentification locale
const { createClient } = require('@supabase/supabase-js');

// Configuration locale depuis variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:55321';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ SUPABASE_ANON_KEY non définie');
  console.log('💡 Récupérez la clé avec: supabase status');
  console.log('💡 Puis exécutez: SUPABASE_ANON_KEY=<votre_clé> node scripts/test-auth.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🧪 Test de l\'authentification locale...');
  
  try {
    // Test 1: Connexion avec l'utilisateur de test
    console.log('\n1️⃣  Tentative de connexion...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@jdr.coffee',
      password: 'admin123'
    });
    
    if (signInError) {
      console.error('❌ Erreur de connexion:', signInError.message);
      return;
    }
    
    console.log('✅ Connexion réussie!', {
      userId: signInData.user?.id,
      email: signInData.user?.email
    });
    
    // Test 2: Vérification des tables notion_proxies
    console.log('\n2️⃣  Test d\'accès aux données...');
    const { data: proxies, error: proxiesError } = await supabase
      .from('notion_proxies')
      .select('*');
    
    if (proxiesError) {
      console.error('❌ Erreur lecture proxies:', proxiesError.message);
      return;
    }
    
    console.log('✅ Données proxies récupérées:', proxies.length, 'proxies trouvés');
    proxies.forEach(proxy => {
      console.log(`   - ${proxy.notion_database_name} (${proxy.items_count} items)`);
    });
    
    // Test 3: Vérification des données proxy
    console.log('\n3️⃣  Test des données détaillées...');
    const { data: proxyData, error: proxyDataError } = await supabase
      .from('notion_proxy_data')
      .select('*')
      .limit(3);
      
    if (proxyDataError) {
      console.error('❌ Erreur lecture proxy data:', proxyDataError.message);
      return;
    }
    
    console.log('✅ Données détaillées récupérées:', proxyData.length, 'entrées trouvées');
    proxyData.forEach(data => {
      const parsedData = JSON.parse(data.data);
      console.log(`   - ${parsedData.title || parsedData.name}`);
    });
    
    // Test 4: Déconnexion
    console.log('\n4️⃣  Déconnexion...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('❌ Erreur de déconnexion:', signOutError.message);
      return;
    }
    
    console.log('✅ Déconnexion réussie!');
    console.log('\n🎉 Tous les tests sont passés! La configuration locale fonctionne parfaitement.');
    
  } catch (error) {
    console.error('💥 Erreur inattendue:', error);
  }
}

testAuth();