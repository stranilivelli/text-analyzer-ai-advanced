// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== AI PARAMETERS CONTROLS ==========

// Preset configurations
// NOTE: max_output_tokens removed from UI - hardcoded in backend to 8192
const AI_PRESETS = {
    deterministic: {
        temperature: 0.0,
        top_p: 0.95,
        top_k: 1,
        description: 'Risultati riproducibili e consistenti'
    },
    balanced: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
        description: 'Bilanciamento tra creatività e coerenza'
    },
    creative: {
        temperature: 1.0,
        top_p: 1.0,
        top_k: 64,
        description: 'Massima varietà nelle risposte'
    }
};

// Get DOM elements for AI controls
const advancedToggle = document.getElementById('advancedToggle');
const advancedControls = document.getElementById('advancedControls');
const temperatureSlider = document.getElementById('temperatureSlider');
const topPSlider = document.getElementById('topPSlider');
const topKSlider = document.getElementById('topKSlider');
const resetDefaultsBtn = document.getElementById('resetDefaults');
const modeRadios = document.querySelectorAll('input[name="aiMode"]');

// Value display elements
const temperatureValue = document.getElementById('temperatureValue');
const topPValue = document.getElementById('topPValue');
const topKValue = document.getElementById('topKValue');

// Toggle advanced controls
advancedToggle.addEventListener('click', () => {
    advancedToggle.classList.toggle('active');
    advancedControls.classList.toggle('hidden');
});

// Update slider value displays
temperatureSlider.addEventListener('input', (e) => {
    temperatureValue.textContent = parseFloat(e.target.value).toFixed(1);
});

topPSlider.addEventListener('input', (e) => {
    topPValue.textContent = parseFloat(e.target.value).toFixed(2);
});

topKSlider.addEventListener('input', (e) => {
    topKValue.textContent = e.target.value;
});

// Apply preset when mode changes
modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const preset = AI_PRESETS[e.target.value];
        applyPreset(preset);
    });
});

// Apply preset values
function applyPreset(preset) {
    temperatureSlider.value = preset.temperature;
    topPSlider.value = preset.top_p;
    topKSlider.value = preset.top_k;

    // Update displays
    temperatureValue.textContent = preset.temperature.toFixed(1);
    topPValue.textContent = preset.top_p.toFixed(2);
    topKValue.textContent = preset.top_k;
}

// Reset to balanced defaults
resetDefaultsBtn.addEventListener('click', () => {
    document.querySelector('input[value="balanced"]').checked = true;
    applyPreset(AI_PRESETS.balanced);
});

// Get current AI parameters
// NOTE: max_output_tokens not sent - backend uses default 8192
function getAIParameters() {
    return {
        temperature: parseFloat(temperatureSlider.value),
        top_p: parseFloat(topPSlider.value),
        top_k: parseInt(topKSlider.value),
        candidate_count: 1
    };
}

// ========== GEMINI ANALYZER ==========

const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');

const exampleText = `L'intelligenza artificiale rappresenta una delle più significative rivoluzioni tecnologiche del ventunesimo secolo. I sistemi di machine learning, attraverso algoritmi sempre più sofisticati, sono in grado di apprendere da grandi quantità di dati e di migliorare autonomamente le proprie prestazioni. Questa capacità trova applicazione in numerosi settori, dalla medicina alla finanza, dall'automotive all'intrattenimento. Tuttavia, l'implementazione di tali tecnologie solleva importanti questioni etiche relative alla privacy, alla trasparenza degli algoritmi e alle potenziali implicazioni occupazionali.`;

analyzeBtn.addEventListener('click', analyzeText);
clearBtn.addEventListener('click', clearAll);
exampleBtn.addEventListener('click', loadExample);

textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        analyzeText();
    }
});

async function analyzeText() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Inserisci del testo da analizzare');
        return;
    }

    loading.classList.remove('hidden');
    results.classList.add('hidden');

    try {
        // Get AI parameters
        const aiParams = getAIParameters();

        const response = await fetch('/api/analyze-gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                ai_config: aiParams
            })
        });

        const data = await response.json();

        if (data.error) {
            alert('Errore: ' + data.error);
            loading.classList.add('hidden');
            return;
        }

        displayResults(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Errore durante l\'analisi');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayResults(data) {
    // Complexity Score
    document.getElementById('complexityScore').textContent = data.complexity_score.score;
    document.getElementById('complexityCategory').textContent = data.complexity_score.category;
    document.getElementById('complexityScore').style.color = data.complexity_score.color;

    // Gulpease
    document.getElementById('gulpease').textContent = data.gulpease;
    const gulpeaseProgress = document.getElementById('gulpeaseProgress');
    gulpeaseProgress.style.width = `${data.gulpease}%`;
    gulpeaseProgress.style.background = data.gulpease > 80 ? '#22c55e' : data.gulpease > 60 ? '#84cc16' : data.gulpease > 40 ? '#eab308' : '#ef4444';

    // TTR
    document.getElementById('ttr').textContent = data.ttr;

    // Statistics
    document.getElementById('totalWords').textContent = data.statistics.total_words;
    document.getElementById('totalSentences').textContent = data.statistics.total_sentences;
    document.getElementById('avgSentenceLength').textContent = data.statistics.avg_sentence_length.toFixed(1);

    // Semantic Analysis
    if (data.semantic_analysis) {
        document.getElementById('conceptualDifficulty').textContent = data.semantic_analysis.conceptual_difficulty || '-';
        document.getElementById('schoolLevel').textContent = data.semantic_analysis.school_level || '-';
        document.getElementById('register').textContent = data.semantic_analysis.register || '-';
        document.getElementById('reasoningComplexity').textContent = data.semantic_analysis.reasoning_complexity || '-';

        // Technical Terms
        const technicalTerms = document.getElementById('technicalTerms');
        if (data.semantic_analysis.technical_terms && data.semantic_analysis.technical_terms.length > 0) {
            technicalTerms.innerHTML = data.semantic_analysis.technical_terms.map(term =>
                `<span class="term-badge">${term}</span>`
            ).join('');
        } else {
            technicalTerms.innerHTML = '<span class="no-terms">Nessun termine tecnico rilevato</span>';
        }
    }

    // Suggestions
    const suggestionsList = document.getElementById('suggestions');
    if (data.suggestions && data.suggestions.length > 0) {
        suggestionsList.innerHTML = data.suggestions.map(s => `<li>${s}</li>`).join('');
    } else {
        suggestionsList.innerHTML = '<li>Nessun suggerimento disponibile</li>';
    }

    // Critical Points
    const criticalPoints = document.getElementById('criticalPoints');
    if (data.critical_points && data.critical_points.length > 0) {
        criticalPoints.innerHTML = data.critical_points.map(p => `<li>${p}</li>`).join('');
    } else {
        criticalPoints.innerHTML = '<li>Nessun punto critico rilevato</li>';
    }

    // Show results
    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAll() {
    textInput.value = '';
    results.classList.add('hidden');
    textInput.focus();
}

function loadExample() {
    textInput.value = exampleText;
    textInput.focus();
}

console.log('AI Controls initialized');
console.log('Default parameters:', getAIParameters());