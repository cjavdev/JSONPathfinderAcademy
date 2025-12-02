/**
 * Summit Pathfinder Academy - Game Engine Tests
 */

const { JSONPath } = require('jsonpath-plus');
const { LEVELS, CHAPTERS } = require('./levels.js');

// Create minimal HTML structure before requiring game.js
document.body.innerHTML = `
    <input type="text" id="query-input" />
    <div id="document-view"></div>
    <div id="output-view"></div>
    <div id="expected-view"></div>
    <div id="error-message" class="hidden"></div>
    <div id="match-count"></div>
    <div id="chapter-name"></div>
    <div id="level-number"></div>
    <div id="level-title"></div>
    <div id="level-description"></div>
    <div id="mission-text"></div>
    <div id="current-level-display"></div>
    <button id="run-btn"></button>
    <button id="hint-btn"></button>
    <button id="solution-btn"></button>
    <button id="explain-btn" class="hidden"></button>
    <button id="prev-btn"></button>
    <button id="next-btn"></button>
    <button id="json-toggle"></button>
    <button id="yaml-toggle"></button>
    <button id="level-select-btn"></button>
    <button id="sandbox-btn"></button>
    <div id="level-modal" class="hidden"></div>
    <div id="level-grid"></div>
    <button id="close-modal-btn"></button>
    <div id="hint-display" class="hidden"></div>
    <div id="hint-text"></div>
    <div id="hint-count"></div>
    <div id="success-message" class="hidden"></div>
    <div id="expected-container"></div>
`;

// Make LEVELS and CHAPTERS available globally (as they would be in browser)
global.LEVELS = LEVELS;
global.CHAPTERS = CHAPTERS;

// Make JSONPath available globally
global.JSONPath = { JSONPath };

// Import game after DOM and globals setup
const { SummitPathfinderGame } = require('./game.js');

describe('SummitPathfinderGame', () => {
    let game;

    beforeEach(() => {
        // Reset localStorage mock
        window.localStorage.clear();
        jest.clearAllMocks();

        // Recreate game instance
        game = new SummitPathfinderGame();
    });

    describe('Initialization', () => {
        test('should initialize with level 1', () => {
            expect(game.currentLevel).toBe(1);
        });

        test('should start with JSON view mode', () => {
            expect(game.viewMode).toBe('json');
        });

        test('should have empty completed levels initially', () => {
            expect(game.completedLevels.size).toBe(0);
        });

        test('should not be in sandbox mode initially', () => {
            expect(game.sandboxMode).toBe(false);
        });

        test('should have max hints set to 3', () => {
            expect(game.maxHints).toBe(3);
        });
    });

    describe('Level Loading', () => {
        test('should load level data correctly', () => {
            game.loadLevel(1);
            expect(game.currentLevelData.id).toBe(1);
            expect(game.currentLevelData.chapter).toBe('Base Camp');
        });

        test('should reset hints when loading a new level', () => {
            game.hintsUsed = 2;
            game.loadLevel(2);
            expect(game.hintsUsed).toBe(0);
        });

        test('should update DOM elements when loading level', () => {
            game.loadLevel(5);
            expect(document.getElementById('level-number').textContent).toBe('5');
        });

        test('should load level 10 correctly', () => {
            game.loadLevel(10);
            expect(game.currentLevelData.id).toBe(10);
            expect(game.currentLevelData.chapter).toBe('Route Planning');
        });

        test('should load level 20 correctly', () => {
            game.loadLevel(20);
            expect(game.currentLevelData.id).toBe(20);
            expect(game.currentLevelData.chapter).toBe('Summit Push');
        });
    });

    describe('Progress Saving', () => {
        test('should save progress to localStorage', () => {
            game.completedLevels.add(1);
            game.saveProgress();

            const savedData = JSON.parse(window.localStorage.getItem('summitPathfinderProgress'));
            expect(savedData.completedLevels).toContain(1);
        });

        test('should save current level to localStorage', () => {
            game.currentLevel = 5;
            game.saveProgress();

            const savedData = JSON.parse(window.localStorage.getItem('summitPathfinderProgress'));
            expect(savedData.currentLevel).toBe(5);
        });
    });

    describe('Hint System', () => {
        test('should increment hints used when showing hint', () => {
            game.loadLevel(1);
            game.showHint();
            expect(game.hintsUsed).toBe(1);
        });

        test('should display hint text', () => {
            game.loadLevel(1);
            game.showHint();
            const hintText = document.getElementById('hint-text').textContent;
            expect(hintText).toBeTruthy();
        });

        test('should limit hints to maxHints', () => {
            game.loadLevel(1);
            for (let i = 0; i < 5; i++) {
                game.showHint();
            }
            expect(game.hintsUsed).toBe(game.maxHints);
        });

        test('should disable hint button after max hints used', () => {
            game.loadLevel(1);
            for (let i = 0; i < game.maxHints; i++) {
                game.showHint();
            }
            expect(game.hintBtn.disabled).toBe(true);
        });
    });

    describe('Solution Display', () => {
        test('should fill input with solution when requested', () => {
            game.loadLevel(1);
            game.showSolution();
            expect(game.queryInput.value).toBe(LEVELS[0].solution);
        });

        test('should use all hints when showing solution', () => {
            game.loadLevel(1);
            game.showSolution();
            expect(game.hintsUsed).toBe(game.maxHints);
        });
    });

    describe('View Mode Toggle', () => {
        test('should switch to YAML mode', () => {
            game.setViewMode('yaml');
            expect(game.viewMode).toBe('yaml');
        });

        test('should switch back to JSON mode', () => {
            game.setViewMode('yaml');
            game.setViewMode('json');
            expect(game.viewMode).toBe('json');
        });
    });

    describe('Navigation', () => {
        test('should go to next level', () => {
            game.loadLevel(1);
            game.nextLevel();
            expect(game.currentLevel).toBe(2);
        });

        test('should go to previous level', () => {
            game.loadLevel(5);
            game.prevLevel();
            expect(game.currentLevel).toBe(4);
        });

        test('should not go below level 1', () => {
            game.loadLevel(1);
            game.prevLevel();
            expect(game.currentLevel).toBe(1);
        });

        test('should handle navigation to level 20', () => {
            game.loadLevel(19);
            game.nextLevel();
            expect(game.currentLevel).toBe(20);
        });
    });

    describe('Answer Checking', () => {
        test('should correctly compare simple arrays', () => {
            game.currentLevelData = {
                expected: ['a', 'b', 'c']
            };
            expect(game.checkAnswer(['a', 'b', 'c'])).toBe(true);
        });

        test('should correctly compare object arrays', () => {
            game.currentLevelData = {
                expected: [{ name: 'Larkspur', elevation: 3120 }]
            };
            expect(game.checkAnswer([{ name: 'Larkspur', elevation: 3120 }])).toBe(true);
        });

        test('should return false for mismatched arrays', () => {
            game.currentLevelData = {
                expected: ['a', 'b']
            };
            expect(game.checkAnswer(['a', 'c'])).toBe(false);
        });

        test('should handle empty arrays', () => {
            game.currentLevelData = {
                expected: []
            };
            expect(game.checkAnswer([])).toBe(true);
        });
    });

    describe('Sandbox Mode', () => {
        test('should toggle sandbox mode on', () => {
            game.toggleSandbox();
            expect(game.sandboxMode).toBe(true);
        });

        test('should toggle sandbox mode off', () => {
            game.toggleSandbox();
            game.toggleSandbox();
            expect(game.sandboxMode).toBe(false);
        });

        test('should update chapter name in sandbox mode', () => {
            game.toggleSandbox();
            expect(document.getElementById('chapter-name').textContent).toBe('Sandbox');
        });
    });

    describe('Error Handling', () => {
        test('should show error message', () => {
            game.showError('Test error');
            const errorEl = document.getElementById('error-message');
            expect(errorEl.classList.contains('hidden')).toBe(false);
            expect(errorEl.textContent).toContain('Test error');
        });

        test('should hide error message', () => {
            game.showError('Test error');
            game.hideError();
            const errorEl = document.getElementById('error-message');
            expect(errorEl.classList.contains('hidden')).toBe(true);
        });
    });

    describe('HTML Escaping', () => {
        test('should escape HTML entities', () => {
            const escaped = game.escapeHtml('<script>alert("xss")</script>');
            expect(escaped).not.toContain('<script>');
            expect(escaped).toContain('&lt;');
        });

        test('should escape ampersands', () => {
            const escaped = game.escapeHtml('foo & bar');
            expect(escaped).toContain('&amp;');
        });
    });

    describe('Level Modal', () => {
        test('should open level modal', () => {
            game.openLevelModal();
            expect(document.getElementById('level-modal').classList.contains('hidden')).toBe(false);
        });

        test('should close level modal', () => {
            game.openLevelModal();
            game.closeLevelModal();
            expect(document.getElementById('level-modal').classList.contains('hidden')).toBe(true);
        });
    });
});

describe('Utility Functions', () => {
    let game;

    beforeEach(() => {
        window.localStorage.clear();
        game = new SummitPathfinderGame();
    });

    describe('sortForComparison', () => {
        test('should sort object keys', () => {
            const input = [{ z: 1, a: 2 }];
            const result = game.sortForComparison(input);
            expect(Object.keys(result[0])).toEqual(['a', 'z']);
        });

        test('should handle non-array input', () => {
            expect(game.sortForComparison('string')).toBe('string');
            expect(game.sortForComparison(123)).toBe(123);
        });

        test('should handle arrays of primitives', () => {
            const input = [1, 2, 3];
            expect(game.sortForComparison(input)).toEqual([1, 2, 3]);
        });

        test('should handle null values', () => {
            const input = [null, { a: 1 }];
            const result = game.sortForComparison(input);
            expect(result[0]).toBe(null);
        });
    });

    describe('getPlaceholder', () => {
        test('should return basic placeholder for early levels', () => {
            const level = { id: 1 };
            expect(game.getPlaceholder(level)).toBe('$.');
        });

        test('should return filter placeholder for middle levels', () => {
            const level = { id: 7 };
            expect(game.getPlaceholder(level)).toBe('$.[?(@.)]');
        });

        test('should return recursive placeholder for late levels', () => {
            const level = { id: 15 };
            expect(game.getPlaceholder(level)).toBe('$..');
        });
    });
});

describe('JSON/YAML Syntax Highlighting', () => {
    let game;

    beforeEach(() => {
        window.localStorage.clear();
        game = new SummitPathfinderGame();
    });

    test('should highlight JSON strings', () => {
        const result = game.syntaxHighlightJSON({ name: "test" });
        expect(result).toContain('json-key');
        expect(result).toContain('json-string');
    });

    test('should highlight JSON numbers', () => {
        const result = game.syntaxHighlightJSON({ value: 42 });
        expect(result).toContain('json-number');
    });

    test('should highlight JSON booleans', () => {
        const result = game.syntaxHighlightJSON({ active: true });
        expect(result).toContain('json-boolean');
    });

    test('should highlight JSON null', () => {
        const result = game.syntaxHighlightJSON({ empty: null });
        expect(result).toContain('json-null');
    });

    test('should handle arrays', () => {
        const result = game.syntaxHighlightJSON([1, 2, 3]);
        expect(result).toContain('json-bracket');
    });

    test('should handle empty objects', () => {
        const result = game.syntaxHighlightJSON({});
        expect(result).toContain('{}');
    });

    test('should handle empty arrays', () => {
        const result = game.syntaxHighlightJSON([]);
        expect(result).toContain('[]');
    });
});
