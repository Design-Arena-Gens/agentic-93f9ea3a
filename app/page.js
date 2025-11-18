export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            🎥 ESP32-CAM Reconnaissance Faciale
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#555', marginTop: '1rem' }}>
            Système hors ligne avec activation de relais
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <Card
            title="✅ Fonctionnement Hors Ligne"
            description="Aucune connexion internet requise. Tout le traitement se fait sur l'ESP32."
          />
          <Card
            title="⚡ Activation Rapide"
            description="Reconnaissance en moins d'une seconde. Relais activé automatiquement."
          />
          <Card
            title="🔒 7 Visages Maximum"
            description="Enregistrez jusqu'à 7 visages différents dans la mémoire."
          />
          <Card
            title="💡 LED Intégrée"
            description="Indication visuelle lors de la reconnaissance faciale."
          />
        </div>

        <div style={{
          background: '#f8f9fa',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '2rem' }}>
            📋 Matériel Nécessaire
          </h2>
          <ul style={{ fontSize: '1.1rem', lineHeight: '2', color: '#555' }}>
            <li><strong>ESP32-CAM</strong> (AI-Thinker) - Module caméra</li>
            <li><strong>Module Relais</strong> - 1 canal, 3.3V ou 5V</li>
            <li><strong>Programmateur FTDI</strong> - USB vers Serial</li>
            <li><strong>Alimentation</strong> - 5V/2A minimum</li>
            <li><strong>Câbles Dupont</strong> - Pour connexions</li>
          </ul>
        </div>

        <div style={{
          background: '#e8f4fd',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '2px solid #4299e1'
        }}>
          <h2 style={{ color: '#2c5aa0', marginBottom: '1.5rem', fontSize: '2rem' }}>
            🔌 Connexions Rapides
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Programmation</h3>
              <pre style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}>
{`FTDI → ESP32-CAM
GND  → GND
5V   → 5V
TX   → RX (U0R)
RX   → TX (U0T)
GND  → GPIO0 (prog mode)`}
              </pre>
            </div>
            <div>
              <h3 style={{ color: '#2c5aa0', marginBottom: '1rem' }}>Relais</h3>
              <pre style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.9rem'
              }}>
{`ESP32-CAM → Relais
GPIO12   → IN
GND      → GND
5V       → VCC`}
              </pre>
            </div>
          </div>
        </div>

        <div style={{
          background: '#fff5e6',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '2px solid #ffa726'
        }}>
          <h2 style={{ color: '#e65100', marginBottom: '1.5rem', fontSize: '2rem' }}>
            🚀 Installation Rapide
          </h2>
          <ol style={{ fontSize: '1.1rem', lineHeight: '2.5', color: '#555' }}>
            <li>Installer <strong>Arduino IDE</strong> depuis arduino.cc</li>
            <li>Ajouter support <strong>ESP32</strong> via gestionnaire de cartes</li>
            <li>Configurer carte: <strong>AI Thinker ESP32-CAM</strong></li>
            <li>Ouvrir <code style={{ background: '#ffe0b2', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>esp32_face_recognition.ino</code></li>
            <li>Connecter ESP32-CAM avec <strong>GPIO0 → GND</strong></li>
            <li>Téléverser le code</li>
            <li>Déconnecter GPIO0 et appuyer sur RESET</li>
          </ol>
        </div>

        <div style={{
          background: '#e8f5e9',
          padding: '2rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          border: '2px solid #66bb6a'
        }}>
          <h2 style={{ color: '#2e7d32', marginBottom: '1.5rem', fontSize: '2rem' }}>
            🎯 Utilisation
          </h2>
          <div style={{ fontSize: '1.1rem', lineHeight: '2', color: '#555' }}>
            <p><strong>1. Ouvrir le Moniteur Série (115200 baud)</strong></p>
            <p><strong>2. Enregistrer un visage:</strong></p>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              <li>Envoyer <code style={{ background: '#c8e6c9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>e</code> dans le moniteur</li>
              <li>Positionner votre visage (30-50 cm)</li>
              <li>Attendre 5 captures</li>
            </ul>
            <p><strong>3. Test de reconnaissance:</strong></p>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
              <li>✅ Visage reconnu → Relais activé 3 secondes</li>
              <li>❌ Visage inconnu → Relais inactif</li>
            </ul>
          </div>
        </div>

        <div style={{
          background: '#fce4ec',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #ec407a'
        }}>
          <h2 style={{ color: '#c2185b', marginBottom: '1.5rem', fontSize: '2rem' }}>
            ⚙️ Commandes Série
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <CommandCard cmd="e" desc="Enregistrer nouveau visage" />
            <CommandCard cmd="d" desc="Supprimer tous les visages" />
            <CommandCard cmd="l" desc="Lister visages enregistrés" />
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: '#f5f5f5',
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '2rem' }}>
            📚 Documentation Complète
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1.5rem' }}>
            Téléchargez tous les fichiers du projet incluant:
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            fontSize: '1.1rem',
            color: '#555',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            <li>✓ Code Arduino complet (<code>esp32_face_recognition.ino</code>)</li>
            <li>✓ Guide d'installation détaillé</li>
            <li>✓ Schémas de connexion</li>
            <li>✓ Configuration PlatformIO</li>
            <li>✓ Guide de dépannage</li>
          </ul>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '10px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📥 Tous les fichiers sont dans le répertoire du projet
          </div>
        </div>

        <div style={{
          marginTop: '3rem',
          textAlign: 'center',
          color: '#999',
          fontSize: '0.9rem'
        }}>
          <p>Coût total du projet: ~10-22€ | Temps d'installation: ~30 minutes</p>
          <p>Système 100% autonome et hors ligne</p>
        </div>
      </div>
    </div>
  );
}

function Card({ title, description }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #667eea30',
      transition: 'transform 0.2s'
    }}>
      <h3 style={{ color: '#667eea', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
  );
}

function CommandCard({ cmd, desc }) {
  return (
    <div style={{
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #ec407a50'
    }}>
      <code style={{
        background: '#ec407a20',
        color: '#c2185b',
        padding: '0.3rem 0.8rem',
        borderRadius: '6px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        display: 'inline-block',
        marginBottom: '0.5rem'
      }}>
        {cmd}
      </code>
      <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.95rem' }}>
        {desc}
      </p>
    </div>
  );
}
