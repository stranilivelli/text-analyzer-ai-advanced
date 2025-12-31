# 🚀 QUICK START - Text Analyzer Completo

## ⚡ Setup in 3 Minuti

### 1️⃣ Configura API Key Gemini

Apri il file `.env` e sostituisci:

```env
GEMINI_API_KEY=la_tua_api_key_gemini_qui
```

💡 **Come ottenere la chiave**: https://aistudio.google.com → "Get API Key"

### 2️⃣ Installa Dipendenze

```bash
pip install -r requirements.txt
```

### 3️⃣ Avvia l'App

```bash
python app.py
```

### 4️⃣ Apri nel Browser

- 📊 **NLTK**: http://localhost:5000
- 🤖 **Gemini AI**: http://localhost:5000/gemini
- 🔍 **Confronto**: http://localhost:5000/compare

---

## 📂 Cosa C'è nel Progetto

```
text-analyzer-complete/
├── app.py                  ← Backend Flask con NLTK + Gemini
├── requirements.txt        ← Tutte le dipendenze
├── .env                    ← API key (COMPILA QUESTO!)
├── .gitignore             ← Protegge .env da Git
│
├── templates/             ← 3 pagine HTML
│   ├── index.html        → Analisi NLTK
│   ├── gemini.html       → Analisi Gemini AI
│   └── compare.html      → Confronto side-by-side
│
└── static/               ← CSS, JS, immagini
    ├── css/style.css     → Stili responsive
    └── js/
        ├── app.js        → Logic NLTK
        ├── app-gemini.js → Logic Gemini
        └── app-compare.js→ Logic Confronto
```

---

## 🌐 Deploy su Render (Opzionale)

### Setup GitHub

```bash
# Inizializza Git
git init
git add .
git commit -m "Initial commit: Text Analyzer completo"

# Collega a GitHub (crea prima il repo su github.com)
git remote add origin https://github.com/TUO_USERNAME/text-analyzer.git
git push -u origin main
```

### Setup Render

1. Vai su https://dashboard.render.com
2. **New** → **Web Service**
3. Collega il tuo repository GitHub
4. Configurazione:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
   - Instance Type: **Free**

5. ⚠️ **IMPORTANTE**: Aggiungi Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `la_tua_chiave_api`

6. Click **"Create Web Service"**
7. Attendi 2-3 minuti → App online! 🎉

---

## ✅ Checklist Funzionamento

Verifica che tutto funzioni:

- [ ] `.env` contiene la tua API key
- [ ] `pip install -r requirements.txt` completato
- [ ] `python app.py` avvia senza errori
- [ ] http://localhost:5000 mostra pagina NLTK
- [ ] http://localhost:5000/gemini mostra pagina Gemini
- [ ] http://localhost:5000/compare mostra pagina Confronto
- [ ] Menu di navigazione funziona
- [ ] Analisi NLTK completa in <1 secondo
- [ ] Analisi Gemini completa in 2-3 secondi
- [ ] Layout responsive (prova a ridimensionare finestra)

---

## 🆘 Problemi Comuni

### ❌ "ModuleNotFoundError: No module named 'flask'"
```bash
pip install -r requirements.txt
```

### ❌ "API Key Gemini non configurata"
Verifica che `.env` contenga:
```
GEMINI_API_KEY=AIzaSyC...
```

### ❌ Gemini risponde con errore
- Verifica che la API key sia corretta
- Controlla di non aver superato i limiti (15 req/min)
- Prova a rieseguire l'analisi

### ❌ Layout confronto non side-by-side
- Su mobile è normale (stack verticale)
- Su desktop serve finestra >1024px

---

## 💡 Tips Utili

- **Ctrl+Enter** nella textarea per analizzare velocemente
- **Filtro parole brevi** (NLTK) per avere frequenze più significative
- **Testo di esempio** incluso in ogni pagina per testare
- **Responsive**: prova a ridimensionare la finestra per vedere le animazioni

---

## 📊 Cosa Aspettarsi

### Analisi NLTK
- ⚡ **Veloce**: Istantanea
- 🎯 **Precisa**: Calcoli matematici esatti
- 📐 **Algoritmica**: Basata su formule (Gulpease, TTR)

### Analisi Gemini
- 🐢 **Lenta**: 2-3 secondi (è AI!)
- 🧠 **Profonda**: Comprende il significato
- 💡 **Intelligente**: Suggerimenti e analisi semantica

### Confronto
- 🔍 **Completo**: Entrambe le analisi insieme
- 📊 **Comparativo**: Differenze evidenziate
- 🎨 **Responsive**: Side-by-side su desktop, stack su mobile

---

## 🎓 Per la Presentazione

Evidenzia questi punti:

1. **Approccio Dual**: NLP classico + AI moderna
2. **Complementarietà**: NLTK per precisione, Gemini per semantica
3. **Applicazione Pratica**: Tool utile per insegnanti
4. **Full-Stack**: Backend Python, Frontend moderno, Deploy cloud
5. **Analisi Comparativa**: Quando usare quale approccio

---

## 📚 Documentazione Completa

- `README.md` - Documentazione completa del progetto
- `SETUP.md` - Guida dettagliata setup e troubleshooting

---

**Pronto!** 🚀 Hai tutto per un progetto universitario eccellente!

Se hai problemi, controlla `SETUP.md` per la guida completa.
