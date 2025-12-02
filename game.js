/**
 * Summit Pathfinder Academy - Game Engine
 * Interactive JSONPath+ learning game
 */

class SummitPathfinderGame {
    constructor() {
        this.currentLevel = 1;
        this.hintsUsed = 0;
        this.maxHints = 3;
        this.completedLevels = new Set();
        this.viewMode = 'json'; // 'json' or 'yaml'
        this.sandboxMode = false;

        // Load progress from localStorage
        this.loadProgress();

        // Initialize DOM references
        this.initDOMReferences();

        // Bind event listeners
        this.bindEvents();

        // Load initial level
        this.loadLevel(this.currentLevel);
    }

    initDOMReferences() {
        // Main elements
        this.queryInput = document.getElementById('query-input');
        this.documentView = document.getElementById('document-view');
        this.outputView = document.getElementById('output-view');
        this.expectedView = document.getElementById('expected-view');
        this.errorMessage = document.getElementById('error-message');
        this.matchCount = document.getElementById('match-count');

        // Level info
        this.chapterName = document.getElementById('chapter-name');
        this.levelNumber = document.getElementById('level-number');
        this.levelTitle = document.getElementById('level-title');
        this.levelDescription = document.getElementById('level-description');
        this.missionText = document.getElementById('mission-text');
        this.currentLevelDisplay = document.getElementById('current-level-display');

        // Buttons
        this.runBtn = document.getElementById('run-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.solutionBtn = document.getElementById('solution-btn');
        this.explainBtn = document.getElementById('explain-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.jsonToggle = document.getElementById('json-toggle');
        this.yamlToggle = document.getElementById('yaml-toggle');
        this.levelSelectBtn = document.getElementById('level-select-btn');
        this.sandboxBtn = document.getElementById('sandbox-btn');

        // Modal
        this.levelModal = document.getElementById('level-modal');
        this.levelGrid = document.getElementById('level-grid');
        this.closeModalBtn = document.getElementById('close-modal-btn');

        // Hints
        this.hintDisplay = document.getElementById('hint-display');
        this.hintText = document.getElementById('hint-text');
        this.hintCount = document.getElementById('hint-count');

        // Success message
        this.successMessage = document.getElementById('success-message');
        this.expectedContainer = document.getElementById('expected-container');
    }

    bindEvents() {
        // Run query
        this.runBtn.addEventListener('click', () => this.runQuery());
        this.queryInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.runQuery();
        });

        // Live query as you type (debounced)
        let debounceTimer;
        this.queryInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => this.runQuery(true), 300);
        });

        // Navigation
        this.prevBtn.addEventListener('click', () => this.prevLevel());
        this.nextBtn.addEventListener('click', () => this.nextLevel());

        // View toggle
        this.jsonToggle.addEventListener('click', () => this.setViewMode('json'));
        this.yamlToggle.addEventListener('click', () => this.setViewMode('yaml'));

        // Hints
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.solutionBtn.addEventListener('click', () => this.showSolution());
        this.explainBtn.addEventListener('click', () => this.showExplanation());

        // Level select modal
        this.levelSelectBtn.addEventListener('click', () => this.openLevelModal());
        this.closeModalBtn.addEventListener('click', () => this.closeLevelModal());
        this.levelModal.addEventListener('click', (e) => {
            if (e.target === this.levelModal) this.closeLevelModal();
        });

        // Sandbox mode
        this.sandboxBtn.addEventListener('click', () => this.toggleSandbox());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLevelModal();
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowRight') { e.preventDefault(); this.nextLevel(); }
                if (e.key === 'ArrowLeft') { e.preventDefault(); this.prevLevel(); }
            }
        });
    }

    loadLevel(levelId) {
        const level = LEVELS.find(l => l.id === levelId);
        if (!level) return;

        this.currentLevel = levelId;
        this.hintsUsed = 0;
        this.currentLevelData = level;

        // Update UI
        this.chapterName.textContent = level.chapter;
        this.levelNumber.textContent = level.id;
        this.levelTitle.textContent = level.title;
        this.levelDescription.textContent = `"${level.description}"`;
        this.missionText.textContent = level.mission;
        this.currentLevelDisplay.textContent = level.id;

        // Reset query input
        this.queryInput.value = '';
        this.queryInput.placeholder = this.getPlaceholder(level);

        // Render document
        this.renderDocument(level.doc);

        // Render expected output
        this.renderExpected(level.expected);

        // Reset output
        this.outputView.textContent = 'Run a query to see results...';
        this.outputView.className = 'text-slate-400';
        this.matchCount.textContent = '';

        // Reset hints
        this.hintDisplay.classList.add('hidden');
        this.hintCount.textContent = this.maxHints;
        this.hintBtn.disabled = false;

        // Reset success state
        this.successMessage.classList.add('hidden');
        this.explainBtn.classList.add('hidden');

        // Update navigation buttons
        this.prevBtn.disabled = levelId === 1;
        this.nextBtn.disabled = levelId === LEVELS.length && !this.completedLevels.has(levelId);

        // Hide error
        this.hideError();

        // Focus query input
        this.queryInput.focus();

        // Save current level
        this.saveProgress();
    }

    getPlaceholder(level) {
        // Give a gentle starting hint based on level
        if (level.id <= 5) return '$.';
        if (level.id <= 10) return '$.[?(@.)]';
        return '$..';
    }

    renderDocument(doc) {
        if (this.viewMode === 'json') {
            this.documentView.innerHTML = this.syntaxHighlightJSON(doc);
        } else {
            this.documentView.innerHTML = this.syntaxHighlightYAML(doc);
        }
    }

    syntaxHighlightJSON(obj, indent = 0) {
        const spaces = '  '.repeat(indent);

        if (obj === null) {
            return `<span class="json-null">null</span>`;
        }

        if (typeof obj === 'boolean') {
            return `<span class="json-boolean">${obj}</span>`;
        }

        if (typeof obj === 'number') {
            return `<span class="json-number">${obj}</span>`;
        }

        if (typeof obj === 'string') {
            return `<span class="json-string">"${this.escapeHtml(obj)}"</span>`;
        }

        if (Array.isArray(obj)) {
            if (obj.length === 0) return '<span class="json-bracket">[]</span>';

            const items = obj.map((item, i) => {
                const comma = i < obj.length - 1 ? ',' : '';
                return `${spaces}  ${this.syntaxHighlightJSON(item, indent + 1)}${comma}`;
            }).join('\n');

            return `<span class="json-bracket">[</span>\n${items}\n${spaces}<span class="json-bracket">]</span>`;
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return '<span class="json-bracket">{}</span>';

            const items = keys.map((key, i) => {
                const comma = i < keys.length - 1 ? ',' : '';
                return `${spaces}  <span class="json-key">"${this.escapeHtml(key)}"</span>: ${this.syntaxHighlightJSON(obj[key], indent + 1)}${comma}`;
            }).join('\n');

            return `<span class="json-bracket">{</span>\n${items}\n${spaces}<span class="json-bracket">}</span>`;
        }

        return String(obj);
    }

    syntaxHighlightYAML(obj, indent = 0) {
        const yaml = jsyaml.dump(obj, { indent: 2, lineWidth: -1 });

        // Simple syntax highlighting for YAML
        return yaml
            .split('\n')
            .map(line => {
                // Keys (before colon)
                line = line.replace(/^(\s*)([^:\s-][^:]*?)(:)/,
                    '$1<span class="yaml-key">$2</span>$3');

                // Array markers
                line = line.replace(/^(\s*)(-)(\s)/,
                    '$1<span class="yaml-array-marker">$2</span>$3');

                // Strings (quoted)
                line = line.replace(/"([^"]*)"/,
                    '<span class="yaml-string">"$1"</span>');
                line = line.replace(/'([^']*)'/,
                    '<span class="yaml-string">\'$1\'</span>');

                // Booleans
                line = line.replace(/:\s*(true|false)\s*$/,
                    ': <span class="yaml-boolean">$1</span>');

                // Numbers
                line = line.replace(/:\s*(-?\d+\.?\d*)\s*$/,
                    ': <span class="yaml-number">$1</span>');

                // Null
                line = line.replace(/:\s*(null|~)\s*$/,
                    ': <span class="yaml-null">$1</span>');

                return line;
            })
            .join('\n');
    }

    renderExpected(expected) {
        this.expectedView.innerHTML = this.syntaxHighlightJSON(expected);
    }

    runQuery(silent = false) {
        const query = this.queryInput.value.trim();

        if (!query) {
            this.outputView.textContent = 'Run a query to see results...';
            this.outputView.className = 'text-slate-400';
            this.matchCount.textContent = '';
            this.hideError();
            return;
        }

        try {
            // Use jsonpath-plus library
            const result = JSONPath.JSONPath({
                path: query,
                json: this.currentLevelData.doc,
                resultType: 'value'
            });

            this.hideError();

            // Display result
            if (result.length === 0) {
                this.outputView.textContent = 'No matches found';
                this.outputView.className = 'text-amber-400';
                this.matchCount.textContent = '0 matches';
            } else {
                this.outputView.innerHTML = this.syntaxHighlightJSON(result);
                this.outputView.className = '';
                this.matchCount.textContent = `${result.length} match${result.length !== 1 ? 'es' : ''}`;
            }

            // Check if correct
            if (this.checkAnswer(result)) {
                this.onSuccess();
            } else {
                this.successMessage.classList.add('hidden');
            }

        } catch (e) {
            this.showError(e.message);
            this.outputView.textContent = 'Error in query';
            this.outputView.className = 'text-red-400';
            this.matchCount.textContent = '';
        }
    }

    checkAnswer(result) {
        const expected = this.currentLevelData.expected;

        // Deep comparison
        return JSON.stringify(this.sortForComparison(result)) ===
               JSON.stringify(this.sortForComparison(expected));
    }

    sortForComparison(arr) {
        // Create a stable sorted version for comparison
        if (!Array.isArray(arr)) return arr;

        return arr.map(item => {
            if (typeof item === 'object' && item !== null) {
                // Sort object keys for consistent comparison
                const sorted = {};
                Object.keys(item).sort().forEach(key => {
                    sorted[key] = item[key];
                });
                return sorted;
            }
            return item;
        });
    }

    onSuccess() {
        this.successMessage.classList.remove('hidden');
        this.explainBtn.classList.remove('hidden');

        // Mark level as completed
        this.completedLevels.add(this.currentLevel);
        this.saveProgress();

        // Enable next button
        if (this.currentLevel < LEVELS.length) {
            this.nextBtn.disabled = false;
        }

        // Celebration animation
        this.successMessage.classList.add('celebrate');
        setTimeout(() => {
            this.successMessage.classList.remove('celebrate');
        }, 500);

        // Show toast
        this.showToast('Summit reached! 🏔️', 'success');
    }

    showHint() {
        if (this.hintsUsed >= this.maxHints) return;

        const hints = this.currentLevelData.hints;
        const hint = hints[Math.min(this.hintsUsed, hints.length - 1)];

        this.hintsUsed++;
        this.hintCount.textContent = Math.max(0, this.maxHints - this.hintsUsed);

        this.hintText.textContent = hint;
        this.hintDisplay.classList.remove('hidden');

        if (this.hintsUsed >= this.maxHints) {
            this.hintBtn.disabled = true;
        }
    }

    showSolution() {
        this.queryInput.value = this.currentLevelData.solution;
        this.runQuery();

        // Show all hints
        this.hintText.textContent = `Solution: ${this.currentLevelData.solution}`;
        this.hintDisplay.classList.remove('hidden');

        this.hintsUsed = this.maxHints;
        this.hintCount.textContent = '0';
        this.hintBtn.disabled = true;
    }

    showExplanation() {
        this.hintText.innerHTML = `<strong>📖 Why it works:</strong> ${this.currentLevelData.explanation}`;
        this.hintDisplay.classList.remove('hidden');
    }

    showError(message) {
        this.errorMessage.textContent = `⚠️ ${message}`;
        this.errorMessage.classList.remove('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    setViewMode(mode) {
        this.viewMode = mode;

        // Update toggle buttons
        if (mode === 'json') {
            this.jsonToggle.classList.add('bg-blue-600', 'text-white');
            this.jsonToggle.classList.remove('text-slate-400');
            this.yamlToggle.classList.remove('bg-blue-600', 'text-white');
            this.yamlToggle.classList.add('text-slate-400');
        } else {
            this.yamlToggle.classList.add('bg-blue-600', 'text-white');
            this.yamlToggle.classList.remove('text-slate-400');
            this.jsonToggle.classList.remove('bg-blue-600', 'text-white');
            this.jsonToggle.classList.add('text-slate-400');
        }

        // Re-render document
        this.renderDocument(this.currentLevelData.doc);
    }

    prevLevel() {
        if (this.currentLevel > 1) {
            this.loadLevel(this.currentLevel - 1);
        }
    }

    nextLevel() {
        if (this.currentLevel < LEVELS.length) {
            this.loadLevel(this.currentLevel + 1);
        }
    }

    openLevelModal() {
        this.renderLevelGrid();
        this.levelModal.classList.remove('hidden');
    }

    closeLevelModal() {
        this.levelModal.classList.add('hidden');
    }

    renderLevelGrid() {
        this.levelGrid.innerHTML = '';

        CHAPTERS.forEach(chapter => {
            // Chapter header
            const header = document.createElement('div');
            header.className = 'col-span-5 mt-4 first:mt-0';
            header.innerHTML = `
                <h3 class="text-lg font-semibold text-slate-300 flex items-center gap-2 mb-2">
                    <span>${chapter.icon}</span> ${chapter.name}
                </h3>
            `;
            this.levelGrid.appendChild(header);

            // Level buttons
            chapter.levels.forEach(levelId => {
                const level = LEVELS.find(l => l.id === levelId);
                const btn = document.createElement('button');

                const isCompleted = this.completedLevels.has(levelId);
                const isCurrent = levelId === this.currentLevel;
                const isUnlocked = levelId === 1 || this.completedLevels.has(levelId - 1) || this.completedLevels.has(levelId);

                let classes = 'level-btn p-3 rounded-lg border-2 text-center transition-all ';
                if (isCurrent) {
                    classes += 'current border-blue-500 bg-blue-900';
                } else if (isCompleted) {
                    classes += 'completed border-emerald-500 bg-emerald-900';
                } else if (isUnlocked) {
                    classes += 'border-slate-600 bg-slate-700 hover:bg-slate-600';
                } else {
                    classes += 'locked border-slate-700 bg-slate-800';
                }

                btn.className = classes;
                btn.innerHTML = `
                    <div class="text-lg font-bold">${levelId}</div>
                    <div class="text-xs text-slate-400 truncate">${level.title}</div>
                    ${isCompleted ? '<div class="text-emerald-400 text-xs mt-1">✓</div>' : ''}
                `;

                if (isUnlocked) {
                    btn.addEventListener('click', () => {
                        this.loadLevel(levelId);
                        this.closeLevelModal();
                    });
                }

                this.levelGrid.appendChild(btn);
            });
        });
    }

    toggleSandbox() {
        this.sandboxMode = !this.sandboxMode;

        if (this.sandboxMode) {
            this.sandboxBtn.classList.add('bg-amber-500');
            this.sandboxBtn.textContent = '🧪 Exit Sandbox';

            // Load sandbox mode
            this.currentLevelData = {
                id: 0,
                chapter: 'Sandbox',
                title: 'Free Exploration',
                description: 'Experiment freely with any JSON document.',
                mission: 'Try any JSONPath query on the sample data below, or paste your own JSON.',
                doc: {
                    expedition: {
                        name: "K2 Summit Attempt",
                        year: 2024,
                        teams: [
                            { name: "Alpha", members: ["Chen", "Silva", "Park"], status: "active" },
                            { name: "Bravo", members: ["Smith", "Jones"], status: "standby" },
                            { name: "Charlie", members: ["Wilson", "Brown", "Lee", "Kim"], status: "active" }
                        ],
                        camps: [
                            { id: "BC", elevation: 5000, supplies: { food: 100, oxygen: 50 } },
                            { id: "C1", elevation: 6000, supplies: { food: 80, oxygen: 40 } },
                            { id: "C2", elevation: 7000, supplies: { food: 50, oxygen: 30 } },
                            { id: "C3", elevation: 7800, supplies: { food: 30, oxygen: 20 } },
                            { id: "C4", elevation: 8200, supplies: { food: 15, oxygen: 10 } }
                        ],
                        weather: {
                            current: { temp: -20, wind: 45, visibility: "poor" },
                            forecast: [
                                { day: 1, temp: -18, wind: 30 },
                                { day: 2, temp: -25, wind: 60 },
                                { day: 3, temp: -15, wind: 20 }
                            ]
                        }
                    }
                },
                expected: [],
                hints: [
                    "Try $.expedition.teams[*].name",
                    "Try $.expedition.camps[?(@.elevation > 7000)]",
                    "Try $..supplies.oxygen"
                ],
                solution: "",
                explanation: "Sandbox mode - explore freely!"
            };

            this.chapterName.textContent = 'Sandbox';
            this.levelNumber.textContent = '∞';
            this.levelTitle.textContent = 'Free Exploration';
            this.levelDescription.textContent = '"Experiment freely with any JSON document."';
            this.missionText.textContent = 'Try any JSONPath query on the sample data.';

            this.renderDocument(this.currentLevelData.doc);
            this.expectedContainer.classList.add('hidden');
            this.queryInput.value = '';
            this.queryInput.placeholder = '$.expedition.teams[*].name';
            this.outputView.textContent = 'Run a query to see results...';

        } else {
            this.sandboxBtn.classList.remove('bg-amber-500');
            this.sandboxBtn.textContent = '🧪 Sandbox';
            this.expectedContainer.classList.remove('hidden');
            this.loadLevel(this.currentLevel);
        }
    }

    showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    saveProgress() {
        const progress = {
            currentLevel: this.currentLevel,
            completedLevels: Array.from(this.completedLevels)
        };
        localStorage.setItem('summitPathfinderProgress', JSON.stringify(progress));
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('summitPathfinderProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.currentLevel = progress.currentLevel || 1;
                this.completedLevels = new Set(progress.completedLevels || []);
            }
        } catch (e) {
            console.warn('Could not load progress:', e);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SummitPathfinderGame();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SummitPathfinderGame };
}
