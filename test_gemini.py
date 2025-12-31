"""
Test Gemini API - Diagnosi Errore
Esegui con: python test_gemini.py
"""

import os
from dotenv import load_dotenv

print("=" * 50)
print("TEST GEMINI API")
print("=" * 50)

# 1. Carica .env
load_dotenv()
print("\n✓ File .env caricato")

# 2. Leggi API key
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("\n❌ ERRORE: API key non trovata nel file .env")
    print("   Verifica che .env contenga:")
    print("   GEMINI_API_KEY=la_tua_chiave_qui")
    exit(1)

print(f"\n✓ API Key trovata: {api_key[:15]}...{api_key[-5:]}")

# 3. Importa Gemini
try:
    import google.generativeai as genai
    print("✓ Libreria google-generativeai importata")
except ImportError:
    print("\n❌ ERRORE: Libreria non installata")
    print("   Esegui: pip install google-generativeai")
    exit(1)

# 4. Configura Gemini
try:
    genai.configure(api_key=api_key)
    print("✓ Gemini configurato")
except Exception as e:
    print(f"\n❌ ERRORE nella configurazione: {e}")
    exit(1)

# 5. Test chiamata API
try:
    print("\n⏳ Testando chiamata API...")
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content("Rispondi solo con 'OK'")
    print(f"✓ Risposta ricevuta: {response.text}")
    print("\n✅ TUTTO FUNZIONA! Gemini è configurato correttamente.")
except Exception as e:
    print(f"\n❌ ERRORE nella chiamata API:")
    print(f"   {e}")
    print("\nPossibili cause:")
    print("   1. API key non valida")
    print("   2. API key senza permessi")
    print("   3. Limiti rate superati (15 req/min)")
    print("   4. Connessione internet assente")
    exit(1)

print("\n" + "=" * 50)
print("La tua configurazione è corretta!")
print("L'app dovrebbe funzionare.")
print("=" * 50)
