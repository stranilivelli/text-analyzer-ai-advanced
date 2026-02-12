"""
Flask App con Frontend Integrato
Backend API + Pagine HTML servite da Flask
Integrazione NLTK + Gemini AI
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sys
import os
import json
import re
from dotenv import load_dotenv

# Importa NLTK
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize

# Importa Gemini
import google.generativeai as genai

# Carica variabili d'ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configura Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Scarica risorse NLTK (solo la prima volta)
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    pass

# ========== FUNZIONI ANALISI ==========

def extract_json_from_text(text):
    """
    Estrae JSON da testo che potrebbe contenere markdown o altri caratteri
    """
    # Rimuovi markdown backticks
    text = text.strip()
    
    # Rimuovi ```json o ``` all'inizio
    if text.startswith('```json'):
        text = text[7:]
    elif text.startswith('```'):
        text = text[3:]
    
    # Rimuovi ``` alla fine
    if text.endswith('```'):
        text = text[:-3]
    
    text = text.strip()
    
    # Prova a trovare JSON tra { e }
    start = text.find('{')
    end = text.rfind('}')
    
    if start != -1 and end != -1:
        text = text[start:end+1]
    
    # Prova a parsare
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        # Debug: stampa il testo che ha causato l'errore
        print(f"❌ JSON ERROR at position {e.pos}:")
        print(f"Text around error: ...{text[max(0,e.pos-50):e.pos+50]}...")
        
        # Prova a riparare JSON comuni
        # 1. Rimuovi virgole finali prima di } o ]
        text = re.sub(r',(\s*[}\]])', r'\1', text)
        
        # Riprova parsing
        try:
            return json.loads(text)
        except:
            # Se ancora non funziona, rilancia l'errore originale
            raise e

def analyze_text(text, filter_short_words=True, min_word_length=4):
    """
    Analizza il testo e restituisce metriche
    
    Args:
        text (str): Il testo da analizzare
        filter_short_words (bool): Se filtrare parole brevi nelle frequenze
        min_word_length (int): Lunghezza minima parole da considerare
    """
    
    if not text or text.strip() == "":
        return {"error": "Testo vuoto"}
    
    # Tokenizzazione
    sentences = sent_tokenize(text, language='italian')
    words = word_tokenize(text, language='italian')
    words_clean = [w.lower() for w in words if w.isalpha()]
    
    # Statistiche base
    total_words = len(words_clean)
    total_sentences = len(sentences)
    total_chars = len(text)
    
    if total_words == 0 or total_sentences == 0:
        return {"error": "Testo non valido"}
    
    avg_word_length = sum(len(w) for w in words_clean) / total_words
    avg_sentence_length = total_words / total_sentences
    
    # Gulpease
    lettere = sum(len(w) for w in words_clean)
    gulpease = 89 + (300 * total_sentences - 10 * lettere) / total_words
    
    # Type-Token Ratio
    unique_words = len(set(words_clean))
    ttr = unique_words / total_words
    
    # Sentence length classification
    sentence_lengths = [len(word_tokenize(s, language='italian')) for s in sentences]
    short = medium = long_sent = 0
    for l in sentence_lengths:
        if l < 10:
            short += 1
        elif l <= 20:
            medium += 1
        else:
            long_sent += 1
    
    # Complexity score
    complexity = 100 - gulpease
    if ttr > 0.7:
        complexity += 10
    if avg_sentence_length > 25:
        complexity += 15
    elif avg_sentence_length > 20:
        complexity += 10
    
    complexity = min(100, max(0, complexity))
    
    if complexity < 30:
        category = "Molto Semplice"
        color = "#22c55e"
    elif complexity < 50:
        category = "Semplice"
        color = "#84cc16"
    elif complexity < 70:
        category = "Medio"
        color = "#eab308"
    elif complexity < 85:
        category = "Complesso"
        color = "#f97316"
    else:
        category = "Molto Complesso"
        color = "#ef4444"
    
    # Most frequent words - WITH FILTER
    from collections import Counter
    
    if filter_short_words:
        # Filtra parole brevi per avere parole più significative
        words_filtered = [w for w in words_clean if len(w) >= min_word_length]
        word_freq = Counter(words_filtered)
    else:
        # Usa tutte le parole
        word_freq = Counter(words_clean)
    
    most_common = word_freq.most_common(10)
    
    return {
        "success": True,
        "statistics": {
            "total_words": total_words,
            "total_sentences": total_sentences,
            "total_chars": total_chars,
            "avg_word_length": round(avg_word_length, 2),
            "avg_sentence_length": round(avg_sentence_length, 2),
            "unique_words": unique_words
        },
        "gulpease": round(gulpease, 2),
        "ttr": round(ttr, 3),
        "sentence_complexity": {
            "short": short,
            "medium": medium,
            "long": long_sent
        },
        "complexity_score": {
            "score": round(complexity, 2),
            "category": category,
            "color": color
        },
        "most_common_words": most_common[:5],
        "filter_applied": {
            "enabled": filter_short_words,
            "min_length": min_word_length if filter_short_words else None
        }
    }


def analyze_with_gemini(text, ai_config=None):
    """
    Analizza il testo usando Gemini AI
    Replica le metriche NLTK + aggiunge analisi semantica
    
    Args:
        text (str): Il testo da analizzare
        ai_config (dict): Configurazione parametri AI (opzionale)
            - temperature: float (0-1)
            - top_p: float (0-1) 
            - top_k: int (1-100)
            - max_output_tokens: int
            - candidate_count: int
    """
    
    if not GEMINI_API_KEY:
        return {"error": "API Key Gemini non configurata"}
    
    if not text or text.strip() == "":
        return {"error": "Testo vuoto"}
    
    try:
        # Parametri di default
        default_config = {
            'temperature': 0.7,
            'top_p': 0.95,
            'top_k': 40,
            'max_output_tokens': 8192,  # ← AUMENTATO a 8192 per evitare troncamenti
            'candidate_count': 1
        }
        
        # Usa configurazione personalizzata se fornita
        if ai_config:
            generation_config = {**default_config, **ai_config}
        else:
            generation_config = default_config
        
        # Configura il modello CON parametri
        model = genai.GenerativeModel(
            'gemini-2.5-flash',
            generation_config=generation_config
        )
        
        # Prompt strutturato per ottenere analisi completa
        prompt = f"""Analizza questo testo italiano e fornisci SOLO una risposta JSON strutturata.

IMPORTANTE: 
- Restituisci SOLO il JSON, senza testo prima o dopo
- NON usare markdown (niente ```json o ```)
- JSON valido (virgole corrette, stringhe escapate)
- Risposte BREVI e CONCISE (max 50 caratteri per suggestion)

TESTO DA ANALIZZARE:
{text}

Formato JSON ESATTO:
{{
  "statistics": {{
    "total_words": <numero>,
    "total_sentences": <numero>,
    "avg_sentence_length": <numero>,
    "unique_words": <numero>
  }},
  "gulpease": <numero>,
  "ttr": <numero>,
  "complexity_score": {{
    "score": <numero>,
    "category": "<categoria>"
  }},
  "semantic_analysis": {{
    "conceptual_difficulty": "<Bassa|Media|Alta>",
    "school_level": "<Elementare|Media|Superiore|Università>",
    "register": "<Informale|Formale|Tecnico|Divulgativo>",
    "technical_terms": ["<max 3 termini>"],
    "reasoning_complexity": "<max 30 caratteri>"
  }},
  "suggestions": ["<max 40 car>", "<max 40 car>"],
  "critical_points": ["<max 40 car>", "<max 40 car>"]
}}

REGOLE:
- Gulpease: formula (89 + (300*frasi - 10*lettere)/parole)
- TTR: unique/totali
- Max 3 termini tecnici
- Max 2 suggestions BREVI
- Max 2 critical_points BREVI
- Evita apostrofi (usa solo virgolette doppie)
"""
        
        # Genera risposta
        response = model.generate_content(prompt)
        
        # Estrai JSON dalla risposta con parsing migliorato
        response_text = response.text.strip()
        
        # DEBUG: Stampa JSON completo per vedere cosa torna Gemini
        print("\n" + "="*80)
        print("🔍 DEBUG: JSON DA GEMINI (primi 500 caratteri):")
        print(response_text[:500])
        print("="*80 + "\n")
        
        # Parse JSON con gestione errori migliorata
        try:
            result = extract_json_from_text(response_text)
        except json.JSONDecodeError as e:
            # Fornisci errore più dettagliato per debug
            print("\n🚨 ERRORE JSON COMPLETO:")
            print(f"Posizione: {e.pos}")
            print(f"Errore: {str(e)}")
            print(f"\nJSON COMPLETO (ultimi 200 caratteri):")
            print(response_text[-200:])
            print("\n")
            return {
                "error": f"Errore parsing JSON da Gemini",
                "details": f"Posizione errore: carattere {e.pos} - {str(e)}",
                "raw_response_preview": response_text[:300] + "..."
            }
        
        # Aggiungi colore basato su complessità
        score = result['complexity_score']['score']
        if score < 30:
            result['complexity_score']['color'] = "#22c55e"
        elif score < 50:
            result['complexity_score']['color'] = "#84cc16"
        elif score < 70:
            result['complexity_score']['color'] = "#eab308"
        elif score < 85:
            result['complexity_score']['color'] = "#f97316"
        else:
            result['complexity_score']['color'] = "#ef4444"
        
        result['success'] = True
        result['source'] = 'gemini'
        
        # Aggiungi info sui parametri usati
        result['ai_config_used'] = generation_config
        
        return result
        
    except Exception as e:
        return {
            "error": f"Errore nell'analisi Gemini: {str(e)}",
            "details": str(e)
        }


# ========== ROUTES ==========

@app.route('/')
def home():
    """Pagina principale - serve index.html da templates/"""
    return render_template('index.html')

@app.route('/gemini')
def gemini_page():
    """Pagina analisi con Gemini AI"""
    return render_template('gemini.html')

@app.route('/compare')
def compare_page():
    """Pagina confronto NLTK vs Gemini"""
    return render_template('compare.html')

@app.route('/api/analyze', methods=['POST'])
def api_analyze():
    """API endpoint per analizzare il testo"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        # Ricevi parametri filtro (con valori default)
        filter_short = data.get('filter_short_words', True)
        min_length = data.get('min_word_length', 4)
        
        # Validazione parametri
        if not isinstance(filter_short, bool):
            filter_short = True
        
        try:
            min_length = int(min_length)
            # Limita tra 2 e 10 caratteri
            min_length = max(2, min(10, min_length))
        except (ValueError, TypeError):
            min_length = 4
        
        # Analizza con parametri
        results = analyze_text(text, filter_short, min_length)
        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/api/analyze-gemini', methods=['POST'])
def api_analyze_gemini():
    """API endpoint per analizzare il testo con Gemini"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        ai_config = data.get('ai_config', None)  # ← NUOVO
        
        if not text or text.strip() == "":
            return jsonify({"error": "Testo vuoto"}), 400
        
        # Analizza con Gemini (passa ai_config)
        results = analyze_with_gemini(text, ai_config)
        
        if 'error' in results:
            return jsonify(results), 400
            
        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/compare', methods=['POST'])
def api_compare():
    """API endpoint per confrontare NLTK vs Gemini"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        filter_short = data.get('filter_short_words', True)
        min_length = data.get('min_word_length', 4)
        ai_config = data.get('ai_config', None)  # ← NUOVO
        
        if not text or text.strip() == "":
            return jsonify({"error": "Testo vuoto"}), 400
        
        # Analisi NLTK
        nltk_results = analyze_text(text, filter_short, min_length)
        
        # Analisi Gemini (passa ai_config)
        gemini_results = analyze_with_gemini(text, ai_config)
        
        # Confronto
        comparison = {
            "nltk": nltk_results,
            "gemini": gemini_results,
            "success": True
        }
        
        # Calcola differenze se entrambe hanno successo
        if nltk_results.get('success') and gemini_results.get('success'):
            comparison["differences"] = {
                "gulpease_diff": abs(nltk_results['gulpease'] - gemini_results['gulpease']),
                "complexity_diff": abs(nltk_results['complexity_score']['score'] - gemini_results['complexity_score']['score']),
                "agreement": "Alta" if abs(nltk_results['complexity_score']['score'] - gemini_results['complexity_score']['score']) < 15 else "Media" if abs(nltk_results['complexity_score']['score'] - gemini_results['complexity_score']['score']) < 30 else "Bassa"
            }
        
        return jsonify(comparison)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ========== RUN ==========

if __name__ == '__main__':
    # Porta dinamica per Render
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)