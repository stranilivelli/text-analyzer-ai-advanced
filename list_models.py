"""
Lista Modelli Gemini Disponibili
Esegui: python list_models.py
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

print("=" * 60)
print("MODELLI GEMINI DISPONIBILI CON LA TUA API KEY")
print("=" * 60)

# Carica .env
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

if not api_key:
    print("\n❌ ERRORE: API key non trovata nel file .env")
    exit(1)

print(f"\n✓ API Key: {api_key[:15]}...{api_key[-5:]}")

# Configura Gemini
genai.configure(api_key=api_key)

print("\n📋 Modelli che supportano 'generateContent':\n")

try:
    models_found = False
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            models_found = True
            print(f"✓ {model.name}")
            print(f"  Descrizione: {model.display_name}")
            print(f"  Input limit: {model.input_token_limit} tokens")
            print(f"  Output limit: {model.output_token_limit} tokens")
            print()
    
    if not models_found:
        print("❌ Nessun modello trovato")
        print("   Possibile problema con l'API key o la connessione")
    else:
        print("=" * 60)
        print("RACCOMANDAZIONE:")
        print("Usa uno dei modelli elencati sopra nel tuo app.py")
        print("=" * 60)

except Exception as e:
    print(f"\n❌ ERRORE nel recupero modelli:")
    print(f"   {e}")
    print("\nVerifica:")
    print("   1. API key valida")
    print("   2. Connessione internet")
    print("   3. Libreria aggiornata: pip install --upgrade google-generativeai")

print("\n" + "=" * 60)
