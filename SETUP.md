# 🚀 Setup Integrazione Gemini AI

## 📋 Checklist Implementazione

- [x] File `.env` creato con `GEMINI_API_KEY`
- [x] `.gitignore` aggiornato (protegge `.env`)
- [x] `requirements.txt` con `google-generativeai`
- [x] Backend Flask con endpoint Gemini
- [x] Pagina Gemini (`/gemini`)
- [x] Pagina Confronto (`/compare`)
- [x] CSS responsive per confronto side-by-side
- [x] Menu di navigazione funzionante

## 🔑 Step 1: Configura API Key (LOCALE)

1. Apri il file `.env` nella root del progetto
2. Sostituisci `your_api_key_here` con la tua API key Gemini:

```env
GEMINI_API_KEY=AIzaSyC_TUA_CHIAVE_QUI
```

3. Salva il file

⚠️ **IMPORTANTE**: Il file `.env` NON verrà committato su GitHub (protetto da `.gitignore`)

## 🌐 Step 2: Configura API Key su Render

Quando fai il deploy su Render:

1. Vai su [dashboard.render.com](https://dashboard.render.com)
2. Apri il tuo servizio `text-analyzer`
3. Vai su **Environment** nel menu laterale
4. Click su **"Add Environment Variable"**
5. Aggiungi:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyC_TUA_CHIAVE_QUI`
6. Click **"Save Changes"**

Render farà un re-deploy automatico con la nuova variabile.

## 🧪 Step 3: Testa in Locale

```bash
# Installa nuove dipendenze
pip install -r requirements.txt

# Avvia Flask
python app.py
```

Apri nel browser:
- `http://localhost:5000` - Analisi NLTK
- `http://localhost:5000/gemini` - Analisi Gemini
- `http://localhost:5000/compare` - Confronto

## 📤 Step 4: Deploy su Render

```bash
# Aggiungi tutti i nuovi file
git add .

# Commit
git commit -m "Add: Gemini AI integration con confronto"

# Push
git push origin main
```

Render farà il deploy automatico in 2-3 minuti.

⚠️ **NON dimenticare** di configurare la variabile d'ambiente `GEMINI_API_KEY` su Render!

## 🎯 Nuove Funzionalità

### Pagina Gemini (`/gemini`)
- ✅ Stesse metriche di NLTK (Gulpease, TTR)
- ✅ Analisi semantica (difficoltà concettuale, livello scolastico)
- ✅ Identificazione termini tecnici
- ✅ Suggerimenti di semplificazione
- ✅ Punti critici del testo

### Pagina Confronto (`/compare`)
- ✅ Analisi parallela NLTK vs Gemini
- ✅ Confronto metriche affiancato
- ✅ Sintesi differenze
- ✅ Layout responsive (side-by-side su desktop, stack su mobile)

## 🐛 Troubleshooting

### Errore: "API Key Gemini non configurata"
**Soluzione**: Verifica che `.env` contenga `GEMINI_API_KEY=...` (locale) o che la variabile d'ambiente sia configurata su Render.

### Errore: "Module 'google.generativeai' not found"
**Soluzione**: 
```bash
pip install google-generativeai==0.3.2
```

### Gemini risponde con errore JSON
**Soluzione**: Il modello a volte aggiunge testo extra. Il codice gestisce già questo caso rimuovendo markdown, ma se persiste, verifica il prompt in `app.py`.

### Confronto mostra solo una colonna su desktop
**Soluzione**: Verifica che la finestra sia > 1024px. Il CSS usa `grid-template-columns: 1fr 1fr` per desktop e `1fr` per mobile/tablet.

## 💰 Limiti API Gemini Free

- 15 richieste/minuto
- 1.500 richieste/giorno
- 1 milione token/mese

Per il tuo progetto universitario è **più che sufficiente**!

## 📊 Confronto Approcci

| Caratteristica | NLTK | Gemini AI |
|----------------|------|-----------|
| Velocità | ⚡ Istantaneo | 🐢 2-3 secondi |
| Costo | 💚 Gratis | 💚 Gratis (con limiti) |
| Precisione Gulpease | ✅ Matematica | ⚖️ Approssimata |
| Analisi Semantica | ❌ No | ✅ Sì |
| Comprensione Contesto | ❌ No | ✅ Sì |
| Suggerimenti | ❌ No | ✅ Sì |
| Deterministico | ✅ Sempre uguale | ❌ Può variare |

## 🎓 Per la Presentazione

Punti da enfatizzare:

1. **Approccio Doppio**: Algoritmico (NLTK) + Semantico (AI)
2. **Confronto Diretto**: Mostra quando concordano e quando no
3. **Complementarietà**: NLTK per metriche precise, AI per comprensione
4. **Applicazione Pratica**: Insegnanti possono usare entrambi gli approcci

## ✅ Prossimi Passi Opzionali

- [ ] Cache risultati Gemini (Flask-Caching)
- [ ] Export PDF dei confronti
- [ ] Grafici comparativi (Chart.js)
- [ ] Storia analisi (localStorage)
- [ ] API rate limiting user-friendly

---

**Tutto pronto! 🎉**

Ora hai un'applicazione completa con:
- Analisi algoritmica (NLTK)
- Analisi semantica (Gemini AI)
- Confronto diretto
- UI responsive e professionale
