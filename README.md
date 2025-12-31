# 📊 Text Analyzer - Progetto Linguistica Computazionale

## 🎯 Descrizione Progetto

Applicazione web per l'analisi della complessità testuale in italiano, con approccio **dual-analysis**:
- **Analisi Algoritmica** (NLTK) - approccio classico NLP
- **Analisi Semantica** (Gemini AI) - approccio AI moderno
- **Confronto Diretto** - analisi comparativa dei due metodi

**Autore**: Salvatore Paone  
**Corso**: Linguistica Computazionale  
**Relatore**: Prof. M. Mancini

## 🌐 Demo Online

L'applicazione è disponibile online su Render:
https://text-analyzer-yh2t.onrender.com

⚠️ Nota: L'app potrebbe richiedere 30 secondi al primo caricamento (il piano gratuito entra in sleep dopo inattività).

## ✨ Funzionalità

### 📊 Pagina 1: Analisi NLTK (`/`)
**Approccio algoritmico classico**
- Indice Gulpease (specifico per l'italiano)
- Type-Token Ratio (diversità lessicale)
- Distribuzione lunghezza frasi (corte/medie/lunghe)
- Frequenza parole (con filtro configurabile)
- Punteggio complessità globale
- Statistiche testuali dettagliate

### 🤖 Pagina 2: Analisi Gemini AI (`/gemini`)
**Approccio semantico avanzato**

**Metriche classiche (calcolate da AI):**
- Gulpease, TTR, statistiche base

**Analisi semantica avanzata:**
- Difficoltà concettuale del contenuto
- Livello scolastico consigliato
- Registro linguistico (formale/informale/tecnico)
- Identificazione termini tecnici
- Complessità argomentativa
- Suggerimenti di semplificazione
- Punti critici del testo

### 🔍 Pagina 3: Confronto (`/compare`)
**Analisi comparativa NLTK vs Gemini**
- Esecuzione parallela di entrambe le analisi
- Layout side-by-side responsive
- Sintesi delle differenze
- Accordo tra approcci (Alta/Media/Bassa)
- Evidenziazione divergenze significative

## 🏗️ Architettura

### Backend
- **Framework**: Flask (Python 3)
- **NLP Classico**: NLTK 3.8.1
- **AI Integration**: Google Gemini AI (generativeai)
- **Server**: Gunicorn (production)

### Frontend
- **HTML5** con template Jinja2
- **CSS3** moderno con variabili CSS
- **JavaScript** vanilla (no framework)
- **Design**: Responsive, mobile-first
- **Fonts**: Montserrat + Atkinson Hyperlegible (accessibilità)

### Deploy
- **Hosting**: Render (Free tier)
- **CI/CD**: Deploy automatico da GitHub
- **Environment**: Variabili d'ambiente sicure

## 📦 Installazione Locale

### Prerequisiti
- Python 3.8+
- pip
- API Key Google Gemini (gratuita)

### Setup

```bash
# 1. Clona o scarica il progetto
cd text-analyzer-complete

# 2. Crea virtual environment (consigliato)
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# 3. Installa dipendenze
pip install -r requirements.txt

# 4. Configura API Key
# Crea file .env e aggiungi:
echo "GEMINI_API_KEY=tua_api_key_qui" > .env

# 5. Avvia applicazione
python app.py
```

### Accesso
- **NLTK**: http://localhost:5000
- **Gemini**: http://localhost:5000/gemini
- **Confronto**: http://localhost:5000/compare

## 🔑 Ottenere API Key Gemini

1. Vai su https://aistudio.google.com
2. Accedi con account Google
3. Click su "Get API Key"
4. Copia la chiave generata

**Limiti Free Tier:**
- 15 richieste/minuto
- 1.500 richieste/giorno
- 1 milione token/mese

Perfetto per uso accademico!

## 🚀 Deploy su Render

### Step 1: Prepara Repository GitHub

```bash
# Inizializza Git (se non già fatto)
git init
git add .
git commit -m "Initial commit: Text Analyzer con Gemini"

# Collega a GitHub
git remote add origin https://github.com/TUO_USERNAME/text-analyzer.git
git push -u origin main
```

### Step 2: Configura Render

1. Vai su https://dashboard.render.com
2. New → Web Service
3. Collega repository GitHub
4. Configurazione:
   - **Name**: text-analyzer
   - **Region**: Frankfurt (o più vicina)
   - **Branch**: main
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free

5. **Environment Variables** (IMPORTANTE!):
   - Key: `GEMINI_API_KEY`
   - Value: `la_tua_api_key`

6. Click "Create Web Service"
7. Attendi 2-3 minuti per il deploy

### Step 3: Verifica

Apri l'URL fornito da Render (es: `https://text-analyzer-xxxx.onrender.com`)

## 📁 Struttura Progetto

```
text-analyzer-complete/
├── app.py                      # Flask backend principale
├── requirements.txt            # Dipendenze Python
├── .env                        # API keys (NON committare!)
├── .gitignore                  # File da ignorare
├── README.md                   # Questo file
├── SETUP.md                    # Guida setup dettagliata
│
├── templates/                  # Template HTML (Jinja2)
│   ├── index.html             # Pagina NLTK
│   ├── gemini.html            # Pagina Gemini AI
│   └── compare.html           # Pagina confronto
│
└── static/                     # Risorse statiche
    ├── css/
    │   └── style.css          # Stili globali + responsive
    ├── js/
    │   ├── app.js             # Logic analisi NLTK
    │   ├── app-gemini.js      # Logic analisi Gemini
    │   └── app-compare.js     # Logic confronto
    ├── images/
    │   └── logo.svg           # Logo progetto
    └── [favicon files]         # Icon varie dimensioni
```

## 🎓 Aspetti Tecnici Interessanti

### 1. Indice Gulpease
Formula specifica per l'italiano:
```
Gulpease = 89 + (300 * frasi - 10 * lettere) / parole
```
- 0-40: Difficile
- 40-60: Media difficoltà  
- 60-80: Facile
- 80-100: Molto facile

### 2. Type-Token Ratio (TTR)
```
TTR = parole_uniche / parole_totali
```
Misura la diversità lessicale. Valori alti = vocabolario ricco.

### 3. Prompt Engineering per Gemini
Prompt strutturato per ottenere JSON consistente con analisi semantica dettagliata.

### 4. Responsive Design
- Desktop (>1024px): Layout side-by-side
- Tablet (768-1024px): Layout colonne
- Mobile (<768px): Stack verticale

## 📊 Confronto NLTK vs Gemini

| Aspetto | NLTK | Gemini AI |
|---------|------|-----------|
| **Velocità** | ⚡ Istantaneo | 🐢 2-3 secondi |
| **Costo** | 💚 Gratis | 💚 Gratis (con limiti) |
| **Determinismo** | ✅ Sempre uguale | ❌ Può variare |
| **Precisione Matematica** | ✅ Esatta | ⚖️ Approssimata |
| **Comprensione Semantica** | ❌ No | ✅ Sì |
| **Identificazione Concetti** | ❌ No | ✅ Sì |
| **Suggerimenti Pratici** | ❌ No | ✅ Sì |
| **Offline** | ✅ Sì | ❌ No (richiede API) |

**Conclusione**: Gli approcci sono **complementari**. NLTK per metriche precise e veloci, Gemini per comprensione profonda del contenuto.

## 🛠️ Tecnologie Utilizzate

- **Python 3.11**
- **Flask 3.0.0** - Web framework
- **NLTK 3.8.1** - Natural Language Processing
- **Google Generative AI 0.3.2** - Gemini integration
- **Gunicorn 21.2.0** - WSGI server production
- **Flask-CORS 4.0.0** - Cross-Origin Resource Sharing

## 🔒 Sicurezza

- ✅ API keys in variabili d'ambiente (`.env`)
- ✅ `.env` escluso da Git (`.gitignore`)
- ✅ CORS configurato
- ✅ Validazione input lato server
- ✅ Error handling robusto

## 📝 License

Progetto accademico - Linguistica Computazionale  
© 2024 Salvatore Paone

## 🙏 Ringraziamenti

- Prof. M. Mancini per la guida
- NLTK community per le librerie NLP
- Google per Gemini API
- Render per l'hosting gratuito

---

**Made with ❤️ for educational purposes**
