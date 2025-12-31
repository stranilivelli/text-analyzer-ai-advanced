# 🎯 Text Analyzer con Controlli AI - Versione Completa

## 🆕 NUOVA FEATURE: Controlli Parametri AI

Questa versione include **controlli completi per i parametri di Gemini AI**, permettendo di:

✅ Scegliere tra 3 modalità preset (Deterministico, Bilanciato, Creativo)  
✅ Modificare manualmente parametri avanzati (temperature, top_p, top_k, max_tokens)  
✅ Vedere spiegazioni chiare di ogni parametro  
✅ Ripristinare facilmente i valori predefiniti  
✅ Sperimentare con la riproducibilità dell'AI

---

## 📦 Contenuto del Progetto

```
text-analyzer-ai-controls/
├── app.py                          # Backend Flask (MODIFICATO)
├── requirements.txt
├── templates/
│   ├── index.html                  # Analisi NLTK
│   ├── gemini.html                 # Analisi Gemini (MODIFICATO - controlli AI)
│   └── compare.html                # Confronto (MODIFICATO - controlli AI)
├── static/
│   ├── css/
│   │   └── style.css               # CSS completo (MODIFICATO - stili controlli)
│   └── js/
│       ├── app.js                  # JavaScript NLTK
│       ├── app-gemini.js           # JavaScript Gemini (MODIFICATO)
│       └── app-compare.js          # JavaScript Confronto (MODIFICATO)
├── .env                            # Configurazione (GEMINI_API_KEY)
└── README_AI_CONTROLS.md           # Questa guida
```

---

## 🎓 Valore Accademico della Feature

### Perché è Importante per la Tesi:

1. **Riproducibilità Scientifica**: Permette di testare come i parametri AI influenzano i risultati
2. **Comparazione Approcci**: Confronta determinismo algoritmico (NLTK) vs stocasticità AI (Gemini)
3. **Esperimenti Documentabili**: Genera dati per analisi statistiche sulla variabilità
4. **Comprensione Profonda**: Dimostra padronanza dei modelli generativi oltre il semplice utilizzo

### Esperimento Suggerito per la Tesi:

**"Effetto della Temperature sulla Riproducibilità dell'Indice Gulpease"**

```
Metodologia:
1. Stesso testo di prova
2. 10 analisi per ogni valore di temperature (0.0, 0.5, 1.0)
3. Calcolo varianza e deviazione standard del Gulpease

Risultato Atteso:
- Temperature 0.0: varianza ~0-1% (alta riproducibilità)
- Temperature 0.5: varianza ~2-5% (media riproducibilità)
- Temperature 1.0: varianza ~5-15% (bassa riproducibilità)

Conclusione:
"La modalità deterministica garantisce risultati scientificamente riproducibili,
mentre temperature elevate introducono variabilità interpretativa"
```

---

## 🎨 Come Funziona la UI

### **Modalità Semplice** (Per utenti normali)

Tre preset chiari e immediati:

```
○ 🔒 Deterministico  - Risultati riproducibili (temperature=0.0)
● ⚖️ Bilanciato      - Consigliato (temperature=0.7)  ← DEFAULT
○ 🎨 Creativo        - Più variabile (temperature=1.0)
```

**Basta un click** per cambiare modalità!

### **Modalità Avanzata** (Per esperti/ricercatori)

Toggle "⚙️ Impostazioni Avanzate" che mostra:

- **Temperature** (0-1): Creatività del modello
  - 💡 `0 = deterministico, 1 = molto creativo`
  
- **Top P** (0-1): Nucleus Sampling
  - 🎲 `Varietà nelle risposte: più alto = più opzioni considerate`
  
- **Top K** (1-100): Numero token candidati
  - 🔢 `Numero di token considerati: più basso = più focalizzato`
  
- **Max Output Tokens** (512-8192): Lunghezza risposta
  - 📝 `Lunghezza massima della risposta (1 token ≈ 4 caratteri)`

Ogni parametro ha:
- ✅ Slider visuale
- ✅ Valore corrente mostrato
- ✅ Descrizione semplice
- ✅ Emoji per riconoscimento rapido

---

## 🚀 Quick Start

### 1. **Installa Dipendenze**

```bash
pip install -r requirements.txt
```

### 2. **Configura API Key**

Crea file `.env`:
```env
GEMINI_API_KEY=la_tua_chiave_api_qui
```

### 3. **Avvia Applicazione**

```bash
python app.py
```

Vai su: http://localhost:5000

---

## 🧪 Come Usare i Controlli AI

### **Test Riproducibilità (Modalità Deterministico)**

1. Vai su `/gemini` o `/compare`
2. Seleziona **🔒 Deterministico**
3. Inserisci un testo
4. Clicca "Analizza" **10 volte**
5. **Risultato**: Gulpease e altri indici identici ogni volta!

### **Test Creatività (Modalità Creativo)**

1. Seleziona **🎨 Creativo**
2. Stesso testo
3. Analizza 10 volte
4. **Risultato**: Valori variano leggermente

### **Personalizzazione Avanzata**

1. Click su "⚙️ Impostazioni Avanzate"
2. Modifica i parametri
3. Sperimenta!
4. Click "🔄 Ripristina" per tornare ai default

---

## 📊 Parametri AI Spiegati

### **Temperature (Più Importante)**

| Valore | Comportamento | Uso Consigliato |
|--------|---------------|------------------|
| 0.0 | Sempre la stessa risposta | Ricerca scientifica, testing |
| 0.3-0.5 | Leggera varietà | Analisi professionale |
| 0.7 | Bilanciato | Uso generale (**default**) |
| 0.9-1.0 | Alta creatività | Brainstorming, idee |

### **Top P (Nucleus Sampling)**

Controlla la "massa di probabilità" considerata:
- **0.95** (default): considera il 95% delle possibilità più probabili
- **1.0**: considera tutto (massima varietà)
- **0.5**: solo le opzioni più probabili (più conservativo)

### **Top K**

Numero massimo di token candidati:
- **1**: solo il più probabile (molto deterministico)
- **40** (default): buon bilanciamento
- **100**: massima varietà

### **Max Output Tokens**

Lunghezza massima risposta:
- **512**: risposta breve
- **2048** (default): risposta media
- **8192**: risposta molto lunga

---

## 🔬 Modifiche Tecniche Implementate

### **Backend (app.py)**

```python
def analyze_with_gemini(text, ai_config=None):
    # Ora accetta parametri AI personalizzati
    default_config = {
        'temperature': 0.7,
        'top_p': 0.95,
        'top_k': 40,
        'max_output_tokens': 2048
    }
    
    if ai_config:
        generation_config = {**default_config, **ai_config}
    
    model = genai.GenerativeModel(
        'gemini-flash-latest',
        generation_config=generation_config
    )
```

### **Frontend (HTML)**

- Aggiunto section `ai-settings-section` con:
  - Radio buttons per preset
  - Toggle per controlli avanzati
  - Slider per ogni parametro
  - Descrizioni e tooltip

### **JavaScript**

- Funzione `getAIParameters()` raccoglie valori
- Funzione `applyPreset()` applica configurazioni predefinite
- Gestione eventi per slider e radio buttons
- Invio `ai_config` nelle chiamate API

### **CSS**

- Stili per radio buttons personalizzati
- Animazioni per toggle
- Slider personalizzati
- Layout responsive

---

## 📝 Per la Documentazione della Tesi

### Sezione Consigliata: "3.4 Configurabilità Parametri Generativi"

**Struttura:**

1. **Introduzione**
   - Differenza tra approccio algoritmico (NLTK) e probabilistico (Gemini)
   - Necessità di controllare la variabilità AI

2. **Parametri Implementati**
   - Descrizione tecnica di temperature, top_p, top_k
   - Motivazione di ciascun parametro
   - Range di valori e significato

3. **Modalità Preset**
   - Deterministico (ricerca scientifica)
   - Bilanciato (uso generale)
   - Creativo (esplorazione)

4. **Esperimenti e Risultati**
   - Test riproducibilità con temperature=0
   - Comparazione variabilità a temperature diverse
   - Grafici e tabelle

5. **Conclusioni**
   - Trade-off creatività/consistenza
   - Implicazioni per l'analisi testuale automatica
   - Raccomandazioni d'uso

---

## ✅ Checklist Testing

Prima del deploy, verifica:

- [ ] Preset funzionano correttamente
- [ ] Slider aggiornano valori
- [ ] Toggle avanzate si apre/chiude
- [ ] Analisi usa parametri configurati
- [ ] Reset ripristina defaults
- [ ] Responsive su mobile
- [ ] Descrizioni leggibili
- [ ] Console senza errori
- [ ] Pagine Gemini e Compare entrambe funzionanti

---

## 🎯 Deploy su Render

1. **Commit e Push**:
```bash
git add .
git commit -m "Add AI parameter controls"
git push origin main
```

2. **Render Auto-Deploy**: Aspetta 2-3 minuti

3. **Verifica Online**:
   - https://tuo-progetto.onrender.com/gemini
   - Testa i controlli AI
   - Verifica che tutto funzioni

---

## 💡 Tips & Tricks

### Per Ottenere Risultati Identici (Riproducibilità Massima):

```
Modalità: Deterministico
Temperature: 0.0
Top P: 0.95
Top K: 1
```

### Per Esplorare Variazioni Semantiche:

```
Modalità: Creativo
Temperature: 1.0
Top P: 1.0
Top K: 64
```

### Per Uso Quotidiano:

```
Modalità: Bilanciato (default)
```

---

## 🐛 Troubleshooting

### Problema: I controlli non appaiono

**Soluzione**: Controlla che il CSS sia caricato:
```html
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
```

### Problema: Slider non funzionano

**Soluzione**: Verifica JavaScript console per errori. Controlla che tutti gli ID corrispondano:
- `temperatureSlider`, `temperatureValue`
- `topPSlider`, `topPValue`
- etc.

### Problema: Parametri non vengono passati all'API

**Soluzione**: Verifica che la chiamata fetch includa `ai_config`:
```javascript
body: JSON.stringify({
    text: text,
    ai_config: getAIParameters()  // ← Deve essere presente!
})
```

---

## 📚 Risorse Aggiuntive

- **Documentazione Gemini**: https://ai.google.dev/docs
- **Generation Config**: https://ai.google.dev/api/generate-content#generationconfig
- **Best Practices**: https://ai.google.dev/docs/concepts#generation_configuration

---

## 🎓 Conclusione

Questa implementazione trasforma il tuo progetto da un semplice "uso di AI" a una **ricerca approfondita** sui modelli generativi. Dimostra:

✅ Comprensione tecnica dei parametri AI  
✅ Capacità di implementazione full-stack  
✅ Pensiero critico sulla riproducibilità scientifica  
✅ Design UX per utenti non tecnici  
✅ Documentazione accademica rigorosa  

**Perfetto per una tesi di livello universitario!** 🏆

---

## 📧 Supporto

Per domande o problemi, consulta la GUIDA_IMPLEMENTAZIONE.md originale o rivedi il codice sorgente commentato.

**Buona fortuna con il progetto! 🚀**
