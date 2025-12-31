// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Chiudi menu quando clicchi su un link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Chiudi menu quando clicchi fuori
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== ANALIZZATORE DI TESTO ==========

// Elementi DOM
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');

// NUOVO: Elementi filtro parole
const minWordLengthSlider = document.getElementById('minWordLength');
const lengthValue = document.getElementById('lengthValue');

// NUOVO: Aggiorna valore slider visualizzato
minWordLengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

// Testo di esempio
const exampleText = `L'intelligenza artificiale rappresenta una delle più significative rivoluzioni tecnologiche del ventunesimo secolo. I sistemi di machine learning, attraverso algoritmi sempre più sofisticati, sono in grado di apprendere da grandi quantità di dati e di migliorare autonomamente le proprie prestazioni. Questa capacità trova applicazione in numerosi settori, dalla medicina alla finanza, dall'automotive all'intrattenimento. Tuttavia, l'implementazione di tali tecnologie solleva importanti questioni etiche relative alla privacy, alla trasparenza degli algoritmi e alle potenziali implicazioni occupazionali.`;

// Event Listeners
analyzeBtn.addEventListener('click', analyzeText);
clearBtn.addEventListener('click', clearAll);
exampleBtn.addEventListener('click', loadExample);

// Permetti analisi con Enter (Ctrl+Enter nella textarea)
textInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        analyzeText();
    }
});

// Funzione principale di analisi
async function analyzeText() {
    const text = textInput.value.trim();

    if (!text) {
        alert('Inserisci del testo da analizzare');
        return;
    }

    // NUOVO: Leggi parametri filtro
    const filterShort = document.getElementById('filterShortWords').checked;
    const minLength = parseInt(document.getElementById('minWordLength').value);

    // Mostra loading, nascondi risultati
    loading.classList.remove('hidden');
    results.classList.add('hidden');
    analyzeBtn.disabled = true;

    try {
        // Chiamata API - MODIFICATO: aggiunti parametri filtro
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                filter_short_words: filterShort,
                min_word_length: minLength
            })
        });

        if (!response.ok) {
            throw new Error('Errore nella richiesta');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Mostra risultati
        displayResults(data);

    } catch (error) {
        alert('Errore durante l\'analisi: ' + error.message);
        console.error('Error:', error);
    } finally {
        // Nascondi loading, riabilita bottone
        loading.classList.add('hidden');
        analyzeBtn.disabled = false;
    }
}

// Visualizza i risultati
function displayResults(data) {
    // Complexity Score
    const scoreElement = document.getElementById('complexityScore');
    const categoryElement = document.getElementById('complexityCategory');
    const score = data.complexity_score.score;
    const category = data.complexity_score.category;
    const color = data.complexity_score.color;

    scoreElement.textContent = score.toFixed(1);
    categoryElement.textContent = category;
    scoreElement.style.color = color;

    // Statistics
    document.getElementById('totalWords').textContent = data.statistics.total_words;
    document.getElementById('totalSentences').textContent = data.statistics.total_sentences;
    document.getElementById('avgSentenceLength').textContent = data.statistics.avg_sentence_length.toFixed(1);
    document.getElementById('ttr').textContent = data.ttr.toFixed(3);

    // Gulpease
    const gulpease = data.gulpease;
    document.getElementById('gulpease').textContent = gulpease.toFixed(1);

    let gulpeaseDesc;
    if (gulpease >= 80) {
        gulpeaseDesc = 'Testo Facile ✅';
    } else if (gulpease >= 60) {
        gulpeaseDesc = 'Media Difficoltà ⚠️';
    } else {
        gulpeaseDesc = 'Testo Difficile ❌';
    }
    document.getElementById('gulpeaseDesc').textContent = gulpeaseDesc;

    // Progress bar (normalizza Gulpease 0-100 per la barra)
    const gulpeaseProgress = Math.max(0, Math.min(100, gulpease));
    document.getElementById('gulpeaseProgress').style.width = gulpeaseProgress + '%';

    // Sentence Complexity
    const sentComplexity = data.sentence_complexity;
    const totalSentences = sentComplexity.short + sentComplexity.medium + sentComplexity.long;

    document.getElementById('shortCount').textContent = sentComplexity.short;
    document.getElementById('mediumCount').textContent = sentComplexity.medium;
    document.getElementById('longCount').textContent = sentComplexity.long;

    // Calcola percentuali per le barre
    const shortPercent = totalSentences > 0 ? (sentComplexity.short / totalSentences * 100) : 0;
    const mediumPercent = totalSentences > 0 ? (sentComplexity.medium / totalSentences * 100) : 0;
    const longPercent = totalSentences > 0 ? (sentComplexity.long / totalSentences * 100) : 0;

    document.getElementById('shortBar').style.width = shortPercent + '%';
    document.getElementById('mediumBar').style.width = mediumPercent + '%';
    document.getElementById('longBar').style.width = longPercent + '%';

    // Most Common Words
    const commonWordsContainer = document.getElementById('commonWords');
    commonWordsContainer.innerHTML = '';

    data.most_common_words.forEach(([word, count]) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.innerHTML = `
            <span class="word-text">${word}</span>
            <span class="word-count">${count}</span>
        `;
        commonWordsContainer.appendChild(wordItem);
    });

    // Mostra sezione risultati con animazione
    results.classList.remove('hidden');

    // Scroll verso i risultati
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Pulisci tutto
function clearAll() {
    textInput.value = '';
    results.classList.add('hidden');
    textInput.focus();
}

// Carica esempio
function loadExample() {
    textInput.value = exampleText;
    textInput.focus();
}
// Info al caricamento
console.log('Analizzatore di Complessità Testuale - Ready!');
console.log('Tip: Usa Ctrl+Enter nella textarea per analizzare velocemente');