/**
 * Summit Pathfinder Academy - Level Tests
 * Validates that all level solutions produce expected results
 */

const { JSONPath } = require('jsonpath-plus');
const { LEVELS, CHAPTERS } = require('../dist/levels.js');

describe('Level Data Structure', () => {
    test('should have 20 levels', () => {
        expect(LEVELS.length).toBe(20);
    });

    test('all levels should have required properties', () => {
        LEVELS.forEach(level => {
            expect(level).toHaveProperty('id');
            expect(level).toHaveProperty('chapter');
            expect(level).toHaveProperty('title');
            expect(level).toHaveProperty('description');
            expect(level).toHaveProperty('mission');
            expect(level).toHaveProperty('doc');
            expect(level).toHaveProperty('expected');
            expect(level).toHaveProperty('hints');
            expect(level).toHaveProperty('solution');
            expect(level).toHaveProperty('explanation');
        });
    });

    test('level IDs should be sequential from 1 to 20', () => {
        LEVELS.forEach((level, index) => {
            expect(level.id).toBe(index + 1);
        });
    });

    test('all levels should have at least 2 hints', () => {
        LEVELS.forEach(level => {
            expect(level.hints.length).toBeGreaterThanOrEqual(2);
        });
    });

    test('all levels should have non-empty solutions', () => {
        LEVELS.forEach(level => {
            expect(level.solution).toBeTruthy();
            expect(level.solution.startsWith('$')).toBe(true);
        });
    });
});

describe('Chapter Structure', () => {
    test('should have 4 chapters', () => {
        expect(CHAPTERS.length).toBe(4);
    });

    test('chapters should cover all 20 levels', () => {
        const allLevels = CHAPTERS.flatMap(ch => ch.levels);
        expect(allLevels.length).toBe(20);
        expect(allLevels).toEqual(expect.arrayContaining([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]));
    });

    test('each chapter should have 5 levels', () => {
        CHAPTERS.forEach(chapter => {
            expect(chapter.levels.length).toBe(5);
        });
    });
});

describe('Level Solutions', () => {
    // Helper to compare results with expected
    const compareResults = (result, expected) => {
        const sortForComparison = (arr) => {
            if (!Array.isArray(arr)) return arr;
            return arr.map(item => {
                if (typeof item === 'object' && item !== null) {
                    const sorted = {};
                    Object.keys(item).sort().forEach(key => {
                        sorted[key] = item[key];
                    });
                    return sorted;
                }
                return item;
            });
        };

        return JSON.stringify(sortForComparison(result)) === JSON.stringify(sortForComparison(expected));
    };

    // Test each level's solution
    LEVELS.forEach(level => {
        test(`Level ${level.id}: "${level.title}" - solution produces expected result`, () => {
            const result = JSONPath({
                path: level.solution,
                json: level.doc,
                resultType: 'value'
            });

            const matches = compareResults(result, level.expected);
            if (!matches) {
                console.log(`Level ${level.id} mismatch:`);
                console.log('Solution:', level.solution);
                console.log('Result:', JSON.stringify(result, null, 2));
                console.log('Expected:', JSON.stringify(level.expected, null, 2));
            }
            expect(matches).toBe(true);
        });
    });
});

describe('JSONPath Operator Coverage', () => {
    test('basic dot notation is covered (levels 1-2)', () => {
        const level1 = LEVELS.find(l => l.id === 1);
        const level2 = LEVELS.find(l => l.id === 2);
        expect(level1.solution).toMatch(/^\$\.[a-z]/i);
        expect(level2.solution).toMatch(/^\$\.[a-z]+\.[a-z]+/i);
    });

    test('array wildcard [*] is covered', () => {
        const hasWildcard = LEVELS.some(l => l.solution.includes('[*]'));
        expect(hasWildcard).toBe(true);
    });

    test('array index [n] is covered', () => {
        const hasIndex = LEVELS.some(l => /\[\d+\]/.test(l.solution));
        expect(hasIndex).toBe(true);
    });

    test('filter expression [?()] is covered', () => {
        const hasFilter = LEVELS.some(l => l.solution.includes('[?('));
        expect(hasFilter).toBe(true);
    });

    test('comparison operators are covered', () => {
        const operators = ['>', '<', '=='];
        operators.forEach(op => {
            const hasOperator = LEVELS.some(l => l.solution.includes(op));
            expect(hasOperator).toBe(true);
        });
    });

    test('boolean operators are covered', () => {
        const hasAnd = LEVELS.some(l => l.solution.includes('&&'));
        const hasOr = LEVELS.some(l => l.solution.includes('||'));
        expect(hasAnd).toBe(true);
        expect(hasOr).toBe(true);
    });

    test('recursive descent (..) is covered', () => {
        const hasRecursive = LEVELS.some(l => l.solution.includes('..'));
        expect(hasRecursive).toBe(true);
    });

    test('array slicing is covered', () => {
        const hasSlice = LEVELS.some(l => /\[-?\d*:\]/.test(l.solution));
        expect(hasSlice).toBe(true);
    });
});

describe('Difficulty Progression', () => {
    test('early levels (1-5) use simpler queries', () => {
        const earlyLevels = LEVELS.filter(l => l.id <= 5);
        earlyLevels.forEach(level => {
            // Should not have filter comparisons
            expect(level.solution).not.toMatch(/\?\(@\.[a-z]+\s*[><=]/i);
            // Should not have boolean operators
            expect(level.solution).not.toMatch(/&&|\|\|/);
        });
    });

    test('middle levels (6-10) introduce filters', () => {
        const middleLevels = LEVELS.filter(l => l.id >= 6 && l.id <= 10);
        const hasFilters = middleLevels.some(l => l.solution.includes('[?('));
        expect(hasFilters).toBe(true);
    });

    test('later levels (16-20) have more complex queries', () => {
        const laterLevels = LEVELS.filter(l => l.id >= 16);
        const hasCompound = laterLevels.some(l => l.solution.includes('&&') || l.solution.includes('||'));
        expect(hasCompound).toBe(true);
    });
});

describe('Document Variety', () => {
    test('levels use different document structures', () => {
        const docStrings = LEVELS.map(l => JSON.stringify(l.doc));
        const uniqueDocs = new Set(docStrings);
        expect(uniqueDocs.size).toBeGreaterThan(10);
    });

    test('documents include arrays', () => {
        const hasArrays = LEVELS.some(level => {
            const docString = JSON.stringify(level.doc);
            return docString.includes('[');
        });
        expect(hasArrays).toBe(true);
    });

    test('documents include nested objects', () => {
        const hasNested = LEVELS.some(level => {
            const checkDepth = (obj, depth = 0) => {
                if (typeof obj !== 'object' || obj === null) return depth;
                return Math.max(...Object.values(obj).map(v => checkDepth(v, depth + 1)));
            };
            return checkDepth(level.doc) >= 3;
        });
        expect(hasNested).toBe(true);
    });
});
