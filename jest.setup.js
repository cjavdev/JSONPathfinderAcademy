// Jest setup file - global mocks and setup

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem: jest.fn((key) => localStorageMock.store[key] || null),
    setItem: jest.fn((key, value) => {
        localStorageMock.store[key] = value;
    }),
    clear: jest.fn(() => {
        localStorageMock.store = {};
    }),
    removeItem: jest.fn((key) => {
        delete localStorageMock.store[key];
    })
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock jsyaml (used in browser via CDN)
global.jsyaml = {
    dump: (obj, options) => {
        // Simple YAML-like output for testing
        const stringify = (data, indent = 0) => {
            const prefix = '  '.repeat(indent);
            if (Array.isArray(data)) {
                return data.map(item => `${prefix}- ${typeof item === 'object' ? '\n' + stringify(item, indent + 1) : item}`).join('\n');
            }
            if (typeof data === 'object' && data !== null) {
                return Object.entries(data)
                    .map(([key, val]) => {
                        if (typeof val === 'object') {
                            return `${prefix}${key}:\n${stringify(val, indent + 1)}`;
                        }
                        return `${prefix}${key}: ${val}`;
                    })
                    .join('\n');
            }
            return String(data);
        };
        return stringify(obj);
    }
};

// Reset mocks before each test
beforeEach(() => {
    localStorageMock.store = {};
    jest.clearAllMocks();
});
