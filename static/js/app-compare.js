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
const AI_PRESETS = {
    deterministic: {
        temperature: 0.0,
        top_p: 0.95,
        top_k: 1,
        max_output_tokens: 8192,  // ← AUMENTATO
        description: 'Risultati riproducibili e consistenti'
    },
    balanced: {
        temperature: 0.7,
        top_p: 0.95,
        top_k: 40,
        max_output_tokens: 8192,  // ← AUMENTATO
        description: 'Bilanciamento tra creatività e coerenza'
    },
    creative: {
        temperature: 1.0,
        top_p: 1.0,
        top_k: 64,
        max_output_tokens: 8192,  // ← AUMENTATO
        description: 'Massima varietà nelle risposte'
    }
};

// Get DOM elements for AI controls
const advancedToggle = document.getElementById('advancedToggle');
const advancedControls = document.getElementById('advancedControls');
const temperatureSlider = document.getElementById('temperatureSlider');
const topPSlider = document.getElementById('topPSlider');
const topKSlider = document.getElementById('topKSlider');
const maxTokensSlider = document.getElementById('maxTokensSlider');
const resetDefaultsBtn = document.getElementById('resetDefaults');
const modeRadios = document.querySelectorAll('input[name="aiMode"]');

// Value display elements
const temperatureValue = document.getElementById('temperatureValue');
const topPValue = document.getElementById('topPValue');
const topKValue = document.getElementById('topKValue');
const maxTokensValue = document.getElementById('maxTokensValue');

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

maxTokensSlider.addEventListener('input', (e) => {
    maxTokensValue.textContent = e.target.value;
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
    maxTokensSlider.value = preset.max_output_tokens;

    // Update displays
    temperatureValue.textContent = preset.temperature.toFixed(1);
    topPValue.textContent = preset.top_p.toFixed(2);
    topKValue.textContent = preset.top_k;
    maxTokensValue.textContent = preset.max_output_tokens;
}

// Reset to balanced defaults
resetDefaultsBtn.addEventListener('click', () => {
    document.querySelector('input[value="balanced"]').checked = true;
    applyPreset(AI_PRESETS.balanced);
});

// Get current AI parameters
function getAIParameters() {
    return {
        temperature: parseFloat(temperatureSlider.value),
        top_p: parseFloat(topPSlider.value),
        top_k: parseInt(topKSlider.value),
        max_output_tokens: parseInt(maxTokensSlider.value),
        candidate_count: 1
    };
}

// ========== CONFRONTO NLTK vs GEMINI ==========

const textInput = document.getElementById('textInput');
const compareBtn = document.getElementById('compareBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const comparisonSummary = document.getElementById('comparisonSummary');

const minWordLengthSlider = document.getElementById('minWordLength');
const lengthValue = document.getElementById('lengthValue');

minWordLengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

const exampleText = `L'intelligenza artificiale rappresenta una delle più significative rivoluzioni tecnologiche del ventunesimo secolo. I sistemi di machine learning, attraverso algoritmi sempre più sofisticati, sono in grado di apprendere da grandi quantità di dati e di migliorare autonomamente le proprie prestazioni. Questa capacità trova applicazione in numerosi settori, dalla medicina alla finanza, dall'automotive all'intrattenimento. Tuttavia, l'implementazione di tali tecnologie solleva importanti questioni etiche relative alla privacy, alla trasparenza degli algoritmi e alle potenziali implicazioni occupazionali.`;

compareBtn.addEventListener('click', compareAnalysis);
clearBtn.addEventListener('click', clearAll);
exampleBtn.addEventListener('click', loadExample);

textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        compareAnalysis();
    }
});

async function compareAnalysis() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Inserisci del testo da analizzare');
        return;
    }

    const filterShort = document.getElementById('filterShortWords').checked;
    const minLength = parseInt(document.getElementById('minWordLength').value);
    const aiParams = getAIParameters();

    loading.classList.remove('hidden');
    results.classList.add('hidden');
    comparisonSummary.classList.add('hidden');
    compareBtn.disabled = true;

    try {
        const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                filter_short_words: filterShort,
                min_word_length: minLength,
                ai_config: aiParams
            })
        });

        const data = await response.json();

        if (data.error) {
            alert('Errore: ' + data.error);
            loading.classList.add('hidden');
            compareBtn.disabled = false;
            return;
        }

        displayComparison(data);

    } catch (error) {
        console.error('Error:', error);
        alert('Errore durante l\'analisi');
    } finally {
        loading.classList.add('hidden');
        compareBtn.disabled = false;
    }
}

function displayComparison(data) {
    const nltkData = data.nltk;
    const geminiData = data.gemini;

    // Summary
    if (data.differences) {
        document.getElementById('gulpeaseDiff').textContent = data.differences.gulpease_diff.toFixed(1);
        document.getElementById('complexityDiff').textContent = data.differences.complexity_diff.toFixed(1);
        document.getElementById('agreement').textContent = data.differences.agreement;

        const agreementBadge = document.getElementById('agreement');
        agreementBadge.className = 'agreement-badge';
        if (data.differences.agreement === 'Alta') {
            agreementBadge.classList.add('high');
        } else if (data.differences.agreement === 'Media') {
            agreementBadge.classList.add('medium');
        } else {
            agreementBadge.classList.add('low');
        }

        comparisonSummary.classList.remove('hidden');
    }

    // NLTK Results
    document.getElementById('nltkComplexityScore').textContent = nltkData.complexity_score.score;
    document.getElementById('nltkComplexityCategory').textContent = nltkData.complexity_score.category;
    document.getElementById('nltkComplexityScore').style.color = nltkData.complexity_score.color;

    document.getElementById('nltkGulpease').textContent = nltkData.gulpease;
    const nltkProgress = document.getElementById('nltkGulpeaseProgress');
    nltkProgress.style.width = `${nltkData.gulpease}%`;
    nltkProgress.style.background = nltkData.gulpease > 80 ? '#22c55e' : nltkData.gulpease > 60 ? '#84cc16' : nltkData.gulpease > 40 ? '#eab308' : '#ef4444';

    document.getElementById('nltkWords').textContent = nltkData.statistics.total_words;
    document.getElementById('nltkSentences').textContent = nltkData.statistics.total_sentences;
    document.getElementById('nltkAvgLength').textContent = nltkData.statistics.avg_sentence_length.toFixed(1);
    document.getElementById('nltkTTR').textContent = nltkData.ttr.toFixed(3);

    // Gemini Results
    document.getElementById('geminiComplexityScore').textContent = geminiData.complexity_score.score;
    document.getElementById('geminiComplexityCategory').textContent = geminiData.complexity_score.category;
    document.getElementById('geminiComplexityScore').style.color = geminiData.complexity_score.color;

    document.getElementById('geminiGulpease').textContent = geminiData.gulpease;
    const geminiProgress = document.getElementById('geminiGulpeaseProgress');
    geminiProgress.style.width = `${geminiData.gulpease}%`;
    geminiProgress.style.background = geminiData.gulpease > 80 ? '#22c55e' : geminiData.gulpease > 60 ? '#84cc16' : geminiData.gulpease > 40 ? '#eab308' : '#ef4444';

    if (geminiData.semantic_analysis) {
        document.getElementById('geminiConceptual').textContent = geminiData.semantic_analysis.conceptual_difficulty || '-';
        document.getElementById('geminiSchoolLevel').textContent = geminiData.semantic_analysis.school_level || '-';
        document.getElementById('geminiRegister').textContent = geminiData.semantic_analysis.register || '-';
        document.getElementById('geminiTTR').textContent = geminiData.ttr.toFixed(3);
    }

    const geminiSuggestions = document.getElementById('geminiSuggestions');
    if (geminiData.suggestions && geminiData.suggestions.length > 0) {
        geminiSuggestions.innerHTML = geminiData.suggestions.map(s => `<li>${s}</li>`).join('');
    } else {
        geminiSuggestions.innerHTML = '<li>Nessun suggerimento disponibile</li>';
    }

    results.classList.remove('hidden');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAll() {
    textInput.value = '';
    results.classList.add('hidden');
    comparisonSummary.classList.add('hidden');
    textInput.focus();
}

function loadExample() {
    textInput.value = exampleText;
    textInput.focus();
}

console.log('AI Controls initialized');
console.log('Default parameters:', getAIParameters());
