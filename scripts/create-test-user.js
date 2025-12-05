// Script pour créer un utilisateur de test via l'API Supabase
const fetch = require('node-fetch');

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:55321';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error('❌ SUPABASE_ANON_KEY non définie');
  console.log('💡 Récupérez la clé avec: supabase status');
  console.log('💡 Puis exécutez: SUPABASE_ANON_KEY=<votre_clé> node scripts/create-test-user.js');
  process.exit(1);
}

async function createTestUser() {
  console.log('👤 Création de l\'utilisateur de test...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'admin@jdr.coffee',
        password: 'admin123',
        data: {
          full_name: 'Admin JDR Coffee'
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erreur lors de la création:', data);
      return;
    }
    
    console.log('✅ Utilisateur créé avec succès!');
    console.log('📧 Email:', data.user?.email);
    console.log('🆔 ID:', data.user?.id);
    console.log('');
    console.log('🔑 Tu peux maintenant te connecter avec:');
    console.log('   Email: admin@jdr.coffee');
    console.log('   Password: admin123');
    console.log('');
    console.log('🌐 URL admin: http://localhost:3002');
    
  } catch (error) {
    console.error('💥 Erreur:', error.message);
  }
}

createTestUser();