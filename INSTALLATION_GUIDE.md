# Guide d'Installation Détaillé - ESP32-CAM Reconnaissance Faciale

## Étape 1: Préparation du Matériel

### Matériel Nécessaire
1. **ESP32-CAM AI-Thinker** - Module avec caméra intégrée
2. **Programmateur FTDI USB vers Serial** (ou ESP32-CAM-MB)
3. **Module Relais** - 1 canal, 3.3V ou 5V
4. **Câbles Dupont** - Pour connexions
5. **Alimentation 5V/2A** - Adaptateur secteur recommandé
6. **Breadboard** (optionnel) - Pour prototypage

### Coût Approximatif
- ESP32-CAM: 5-10 €
- Module Relais: 2-5 €
- Programmateur FTDI: 3-7 €
- Total: ~10-22 €

## Étape 2: Connexions Matérielles

### A. Programmation de l'ESP32-CAM

```
FTDI (USB-TTL)    ESP32-CAM
--------------    ---------
    GND    <-->     GND
    5V     <-->     5V
    TX     <-->     RX (U0R)
    RX     <-->     TX (U0T)
    GND    <-->     GPIO0 (pour mode programmation)
```

**⚠️ Important**:
- Connecter GPIO0 à GND **SEULEMENT** pendant le téléversement
- Déconnecter GPIO0 après téléversement pour fonctionnement normal
- Utiliser câbles courts et de bonne qualité

### B. Connexion du Relais

```
ESP32-CAM         Module Relais
---------         -------------
  GPIO12   --->      IN
   GND     --->      GND
   5V      --->      VCC
```

### C. Schéma Complet

```
                    ┌─────────────┐
                    │   ESP32-CAM │
                    │             │
                    │        GPIO12├──────> Relais IN
                    │         GND ├──────> Relais GND
                    │          5V ├──────> Relais VCC
                    │             │
    ┌──────────┐    │        U0T ├──────> FTDI RX
    │ FTDI USB │    │        U0R ├──────> FTDI TX
    │  Prog.   │    │         GND├──────> FTDI GND
    └─────┬────┘    │          5V├──────> FTDI 5V
          │         │             │
          │         │       GPIO0 ├──┐
          │         └─────────────┘  │
          │                          │
          └──────────────────────────┘
                (Déconnecter après prog.)
```

## Étape 3: Installation Logicielle

### A. Installer Arduino IDE

1. **Télécharger Arduino IDE**
   - Aller sur: https://www.arduino.cc/en/software
   - Télécharger version pour votre OS (Windows/Mac/Linux)
   - Installer en suivant l'assistant

2. **Lancer Arduino IDE**
   - Ouvrir l'application
   - Accepter les permissions si demandé

### B. Configurer Support ESP32

1. **Ajouter URL du gestionnaire de cartes**
   ```
   Fichier → Préférences → URL de gestionnaire de cartes supplémentaires
   ```
   Ajouter:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```

2. **Installer ESP32**
   ```
   Outils → Type de carte → Gestionnaire de cartes
   ```
   - Rechercher: "esp32"
   - Installer: "esp32 by Espressif Systems" (version 2.0.x ou supérieure)
   - Attendre fin de l'installation (peut prendre plusieurs minutes)

### C. Installer Bibliothèques ESP-WHO

**Méthode 1: Via GitHub (Recommandée)**

1. Télécharger ESP-WHO:
   ```bash
   git clone https://github.com/espressif/esp-who.git
   ```
   Ou télécharger le ZIP depuis: https://github.com/espressif/esp-who/archive/refs/heads/master.zip

2. Dans Arduino IDE:
   ```
   Croquis → Inclure une bibliothèque → Ajouter la bibliothèque .ZIP
   ```
   Sélectionner le fichier téléchargé

**Méthode 2: Installation Manuelle**

Les fonctions de reconnaissance faciale sont incluses dans le core ESP32 récent. Si vous utilisez ESP32 v2.0+, les bibliothèques sont déjà disponibles.

## Étape 4: Configuration Arduino IDE

### Paramètres de la Carte

```
Outils →
  ├─ Type de carte: "AI Thinker ESP32-CAM"
  ├─ Upload Speed: "115200"
  ├─ CPU Frequency: "240MHz (WiFi/BT)"
  ├─ Flash Frequency: "80MHz"
  ├─ Flash Mode: "QIO"
  ├─ Partition Scheme: "Huge APP (3MB No OTA/1MB SPIFFS)"
  ├─ Core Debug Level: "Aucun"
  └─ Port: [Sélectionner votre port COM]
```

### Identifier le Port COM

**Windows:**
- Gestionnaire de périphériques → Ports (COM et LPT)
- Chercher "USB Serial Port (COMx)"

**Mac:**
- Terminal: `ls /dev/cu.*`
- Chercher `/dev/cu.usbserial-xxx`

**Linux:**
- Terminal: `ls /dev/ttyUSB*`
- Généralement `/dev/ttyUSB0`

## Étape 5: Téléversement du Code

### A. Préparer l'ESP32-CAM

1. **Connexions pour programmation:**
   - Connecter tous les câbles FTDI (GND, 5V, TX, RX)
   - **Connecter GPIO0 à GND** (mode programmation)
   - Brancher FTDI sur port USB de l'ordinateur

2. **Vérifier connexion:**
   - LED rouge doit s'allumer sur ESP32-CAM
   - Port COM doit apparaître dans Arduino IDE

### B. Téléverser

1. **Ouvrir le fichier:**
   ```
   Fichier → Ouvrir → esp32_face_recognition.ino
   ```

2. **Compiler:**
   - Cliquer sur ✓ (Vérifier)
   - Attendre compilation sans erreurs

3. **Téléverser:**
   - Appuyer sur bouton RESET de l'ESP32-CAM
   - Immédiatement cliquer sur → (Téléverser) dans Arduino IDE
   - Attendre message "Connecting...."
   - Si blocage sur "Connecting", maintenir RESET pendant 2 secondes puis relâcher

4. **Progression:**
   ```
   Connecting........___....
   Writing at 0x00001000... (10%)
   ...
   Hard resetting via RTS pin...
   ```

### C. Après Téléversement

1. **Déconnecter GPIO0 de GND** ← **TRÈS IMPORTANT**
2. Appuyer sur bouton RESET
3. ESP32-CAM démarre en mode normal

## Étape 6: Premier Test

### A. Ouvrir Moniteur Série

1. Dans Arduino IDE:
   ```
   Outils → Moniteur série
   ```

2. Configurer:
   - Vitesse: **115200 baud**
   - Line ending: "Both NL & CR"

3. Appuyer sur RESET de l'ESP32-CAM

### B. Vérifier Démarrage

Vous devriez voir:
```
ESP32-CAM Face Recognition System
Camera initialized successfully

Commands:
'e' - Enroll new face
'd' - Delete all faces
'l' - List enrolled faces

System ready for face recognition...
```

### C. Test du Relais

1. **Test manuel du relais:**
   - Envoyer 'e' dans le moniteur série
   - Montrer votre visage (30-50 cm de la caméra)
   - Suivre instructions d'enregistrement

2. **Vérifier activation:**
   - Après enregistrement, montrer à nouveau votre visage
   - Le relais devrait s'activer (clic audible)
   - LED intégrée s'allume
   - Relais se désactive après 3 secondes

## Étape 7: Utilisation Quotidienne

### Alimentation

**Option 1: USB (Test uniquement)**
- FTDI branché sur PC
- Pratique pour développement
- Limité en courant

**Option 2: Alimentation Dédiée (Recommandée)**
```
Adaptateur 5V/2A → ESP32-CAM (5V et GND)
```
- Plus stable
- Meilleur pour le relais
- Peut alimenter charge du relais

### Enregistrer des Visages

1. Envoyer `e` dans moniteur série
2. Positionner visage face à la caméra
3. Distance: 30-50 cm
4. Bon éclairage (lumière naturelle idéale)
5. Attendre 5 captures
6. Confirmation: "Face enrolled successfully! ID: 0"

**Astuces:**
- Enregistrer visage sous plusieurs angles
- Avec/sans lunettes si vous en portez
- Différentes expressions

### Tester la Reconnaissance

1. Se positionner devant la caméra
2. Observer le moniteur série:
   ```
   Faces detected: 1
   ✓ Face recognized! ID: 0
   ```
3. Relais s'active
4. LED s'allume
5. Désactivation après 3 secondes

## Dépannage

### Problème: "Camera init failed"

**Solution:**
- Vérifier alimentation (min 5V/2A)
- Vérifier connexions caméra (souvent mauvais contact)
- Essayer un autre câble USB/alimentation
- Appuyer sur RESET

### Problème: "Failed to connect to ESP32"

**Solution:**
- Vérifier GPIO0 connecté à GND pendant programmation
- Maintenir RESET pendant téléversement
- Essayer un autre port USB
- Vérifier driver FTDI installé

### Problème: Relais ne clique pas

**Solution:**
- Vérifier connexion GPIO12
- Vérifier alimentation relais (5V suffisant?)
- Tester avec LED intégrée (GPIO4) d'abord
- Vérifier module relais fonctionnel (niveau HIGH/LOW)

### Problème: Visage non reconnu

**Solution:**
- Améliorer éclairage
- Ajuster distance (30-50 cm optimal)
- Réenregistrer visage
- Vérifier que visage est bien enregistré (`l` dans moniteur)
- Baisser seuil reconnaissance (ligne 251 du code)

### Problème: ESP32 redémarre en boucle

**Solution:**
- Alimentation insuffisante → utiliser 5V/2A minimum
- Court-circuit → vérifier toutes connexions
- Caméra défectueuse → tester sans caméra connectée

## Conseils d'Optimisation

### Meilleure Reconnaissance

1. **Éclairage:**
   - Lumière naturelle de face
   - Éviter contre-jour
   - Éclairage constant

2. **Distance:**
   - Optimal: 40 cm
   - Min: 20 cm
   - Max: 80 cm

3. **Angle:**
   - Face à la caméra (±15°)
   - Éviter angles extrêmes

4. **Enregistrement:**
   - 2-3 enregistrements par personne
   - Différentes conditions d'éclairage
   - Avec accessoires habituels (lunettes)

### Performance

- Temps de reconnaissance: ~500-800 ms
- Faux positifs: <2% (bon éclairage)
- Faux négatifs: <5% (conditions optimales)
- Capacité: 7 visages max (ajustable)

## Prochaines Étapes

Maintenant que votre système fonctionne:

1. **Tester différents scénarios**
2. **Ajuster paramètres si nécessaire**
3. **Installer dans boîtier** (protection)
4. **Connecter charge au relais** (serrure, lumière, etc.)
5. **Documenter vos réglages**

## Support Additionnel

- **Vidéos YouTube**: "ESP32-CAM face recognition"
- **Forum ESP32**: https://www.esp32.com/
- **GitHub ESP-WHO**: https://github.com/espressif/esp-who

Bon projet! 🚀
