/**
 * Summit Pathfinder Academy - Level Definitions
 * 20 levels teaching JSONPath+ through mountain navigation
 */

const LEVELS = [
    // ============================================
    // BASE CAMP (Levels 1-5): Basic Selects
    // ============================================
    {
        id: 1,
        chapter: "Base Camp",
        title: "Reading the Map",
        description: "Your first task as a trainee: learn to read the mountain data.",
        mission: "Select the entire mountain object to see all available data.",
        doc: {
            mountain: {
                name: "Larkspur Peak",
                elevation: 3120,
                region: "Northern Alps"
            }
        },
        expected: [{
            name: "Larkspur Peak",
            elevation: 3120,
            region: "Northern Alps"
        }],
        hints: [
            "Start with the root symbol: $",
            "Access object properties with dot notation: $.propertyName",
            "You want to select the 'mountain' property"
        ],
        solution: "$.mountain",
        explanation: "The $ symbol represents the root of the document. Using dot notation ($.mountain) accesses the 'mountain' property directly."
    },
    {
        id: 2,
        chapter: "Base Camp",
        title: "Peak Identification",
        description: "Your instructor points to a distant summit.",
        mission: "Get the name of the mountain.",
        doc: {
            mountain: {
                name: "Larkspur Peak",
                elevation: 3120,
                region: "Northern Alps"
            }
        },
        expected: ["Larkspur Peak"],
        hints: [
            "You need to go deeper into the object",
            "Chain property access: $.object.property",
            "The name is inside the mountain object"
        ],
        solution: "$.mountain.name",
        explanation: "Chaining dot notation allows you to navigate nested objects. $.mountain.name first accesses 'mountain', then its 'name' property."
    },
    {
        id: 3,
        chapter: "Base Camp",
        title: "Survey All Peaks",
        description: "Time to catalog all peaks in the range.",
        mission: "Select all peaks in the peaks array.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", elevation: 3120 },
                    { name: "Helios", elevation: 4210 },
                    { name: "Storm Crown", elevation: 3890 }
                ]
            }
        },
        expected: [
            { name: "Larkspur", elevation: 3120 },
            { name: "Helios", elevation: 4210 },
            { name: "Storm Crown", elevation: 3890 }
        ],
        hints: [
            "Arrays can be accessed with bracket notation",
            "Use [*] to select ALL elements in an array",
            "Navigate to peaks first, then select all"
        ],
        solution: "$.mountain.peaks[*]",
        explanation: "The [*] wildcard selects all elements in an array. It's like saying 'give me everything in this list'."
    },
    {
        id: 4,
        chapter: "Base Camp",
        title: "First Peak",
        description: "Start with the nearest summit.",
        mission: "Select only the first peak in the array.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", elevation: 3120 },
                    { name: "Helios", elevation: 4210 },
                    { name: "Storm Crown", elevation: 3890 }
                ]
            }
        },
        expected: [{ name: "Larkspur", elevation: 3120 }],
        hints: [
            "Arrays are zero-indexed (first element is 0)",
            "Use [0] to get the first element",
            "Think: $.path.to.array[index]"
        ],
        solution: "$.mountain.peaks[0]",
        explanation: "Array indices start at 0. [0] gets the first element, [1] the second, and so on."
    },
    {
        id: 5,
        chapter: "Base Camp",
        title: "Peak Names Only",
        description: "Your guide needs a list of peak names for the radio report.",
        mission: "Extract just the names of all peaks.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", elevation: 3120 },
                    { name: "Helios", elevation: 4210 },
                    { name: "Storm Crown", elevation: 3890 }
                ]
            }
        },
        expected: ["Larkspur", "Helios", "Storm Crown"],
        hints: [
            "First select all peaks with [*]",
            "Then access the name property of each",
            "You can chain: array[*].property"
        ],
        solution: "$.mountain.peaks[*].name",
        explanation: "When you use [*] followed by .property, JSONPath extracts that property from every element in the array."
    },

    // ============================================
    // ROUTE PLANNING (Levels 6-10): Filters
    // ============================================
    {
        id: 6,
        chapter: "Route Planning",
        title: "High Altitude Targets",
        description: "Only peaks above 4000m are worth the climb.",
        mission: "Find peaks with elevation greater than 4000 meters.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", elevation: 3120 },
                    { name: "Helios", elevation: 4210 },
                    { name: "Storm Crown", elevation: 3890 },
                    { name: "Titan", elevation: 4580 }
                ]
            }
        },
        expected: [
            { name: "Helios", elevation: 4210 },
            { name: "Titan", elevation: 4580 }
        ],
        hints: [
            "Use filter expressions: [?(@.property > value)]",
            "@ refers to the current element being evaluated",
            "Compare elevation with the > operator"
        ],
        solution: "$.mountain.peaks[?(@.elevation > 4000)]",
        explanation: "Filter expressions [?()] let you select elements that match a condition. @ represents 'the current item' in the array."
    },
    {
        id: 7,
        chapter: "Route Planning",
        title: "Safe Camps",
        description: "Your guide says: 'We only stop at camps with water.'",
        mission: "Find all camps that have water available.",
        doc: {
            expedition: {
                camps: [
                    { id: "BC", elevation: 1800, water: true },
                    { id: "C1", elevation: 2600, water: false },
                    { id: "C2", elevation: 3200, water: true },
                    { id: "C3", elevation: 3800, water: false }
                ]
            }
        },
        expected: [
            { id: "BC", elevation: 1800, water: true },
            { id: "C2", elevation: 3200, water: true }
        ],
        hints: [
            "Filter for boolean values: [?(@.property == true)]",
            "Or simply: [?(@.property)] if checking for truthy",
            "Select camps where water is true"
        ],
        solution: "$.expedition.camps[?(@.water == true)]",
        explanation: "Boolean comparisons work just like numbers. You can check for true/false values in filters."
    },
    {
        id: 8,
        chapter: "Route Planning",
        title: "Specific Summit",
        description: "Intel says Helios has the best views.",
        mission: "Find the peak named 'Helios'.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", elevation: 3120 },
                    { name: "Helios", elevation: 4210 },
                    { name: "Storm Crown", elevation: 3890 }
                ]
            }
        },
        expected: [{ name: "Helios", elevation: 4210 }],
        hints: [
            "String comparison: [?(@.property == 'value')]",
            "Use quotes around string values",
            "Filter peaks where name equals 'Helios'"
        ],
        solution: "$.mountain.peaks[?(@.name == 'Helios')]",
        explanation: "String equality works with quotes. Single or double quotes both work in JSONPath+."
    },
    {
        id: 9,
        chapter: "Route Planning",
        title: "Mid-Range Camps",
        description: "Training exercise: find camps in the middle elevation zone.",
        mission: "Select camps between 2500m and 3500m elevation.",
        doc: {
            expedition: {
                camps: [
                    { id: "BC", elevation: 1800 },
                    { id: "C1", elevation: 2600 },
                    { id: "C2", elevation: 3200 },
                    { id: "C3", elevation: 3800 },
                    { id: "C4", elevation: 4200 }
                ]
            }
        },
        expected: [
            { id: "C1", elevation: 2600 },
            { id: "C2", elevation: 3200 }
        ],
        hints: [
            "Combine conditions with && (AND)",
            "You need: elevation > 2500 AND elevation < 3500",
            "Format: [?(@.prop > x && @.prop < y)]"
        ],
        solution: "$.expedition.camps[?(@.elevation > 2500 && @.elevation < 3500)]",
        explanation: "The && operator combines conditions. Both must be true for an element to be selected."
    },
    {
        id: 10,
        chapter: "Route Planning",
        title: "Hazard Alert",
        description: "Weather service warns: avoid avalanche OR crevasse zones.",
        mission: "Find peaks with avalanche OR crevasse hazards.",
        doc: {
            mountain: {
                peaks: [
                    { name: "Larkspur", hazard: "rockfall" },
                    { name: "Helios", hazard: "avalanche" },
                    { name: "Storm Crown", hazard: "crevasse" },
                    { name: "Titan", hazard: "exposure" }
                ]
            }
        },
        expected: [
            { name: "Helios", hazard: "avalanche" },
            { name: "Storm Crown", hazard: "crevasse" }
        ],
        hints: [
            "Use || for OR conditions",
            "Check if hazard equals 'avalanche' OR 'crevasse'",
            "Format: [?(@.prop == 'a' || @.prop == 'b')]"
        ],
        solution: "$.mountain.peaks[?(@.hazard == 'avalanche' || @.hazard == 'crevasse')]",
        explanation: "The || operator means 'or'. If either condition is true, the element is selected."
    },

    // ============================================
    // EXPEDITION (Levels 11-15): Advanced Navigation
    // ============================================
    {
        id: 11,
        chapter: "Expedition",
        title: "Last Two Camps",
        description: "High altitude acclimatization: visit the final camps.",
        mission: "Select the last two camps in the array.",
        doc: {
            expedition: {
                camps: [
                    { id: "BC", elevation: 1800 },
                    { id: "C1", elevation: 2600 },
                    { id: "C2", elevation: 3200 },
                    { id: "C3", elevation: 3800 },
                    { id: "C4", elevation: 4200 }
                ]
            }
        },
        expected: [
            { id: "C3", elevation: 3800 },
            { id: "C4", elevation: 4200 }
        ],
        hints: [
            "Negative indices count from the end: [-1] is last",
            "Use array slicing: [start:end]",
            "[-2:] means 'from second-to-last to end'"
        ],
        solution: "$.expedition.camps[-2:]",
        explanation: "Array slicing with negative indices: [-2:] means 'start from 2 positions before the end, go to the end'."
    },
    {
        id: 12,
        chapter: "Expedition",
        title: "Skip Base Camp",
        description: "Experienced climbers start from Camp 1.",
        mission: "Select all camps except the first one (Base Camp).",
        doc: {
            expedition: {
                camps: [
                    { id: "BC", elevation: 1800 },
                    { id: "C1", elevation: 2600 },
                    { id: "C2", elevation: 3200 },
                    { id: "C3", elevation: 3800 }
                ]
            }
        },
        expected: [
            { id: "C1", elevation: 2600 },
            { id: "C2", elevation: 3200 },
            { id: "C3", elevation: 3800 }
        ],
        hints: [
            "Slice from index 1 onwards: [1:]",
            "This skips index 0 (the first element)",
            "No end index means 'to the end'"
        ],
        solution: "$.expedition.camps[1:]",
        explanation: "Slice notation [1:] means 'from index 1 to the end', effectively skipping the first element."
    },
    {
        id: 13,
        chapter: "Expedition",
        title: "Deep Hazard Scan",
        description: "Search all terrain data for any hazards mentioned.",
        mission: "Find ALL hazard arrays anywhere in the document using recursive descent.",
        doc: {
            region: {
                name: "Northern Alps",
                zones: [
                    {
                        name: "West Ridge",
                        hazards: ["rockfall", "exposure"]
                    },
                    {
                        name: "East Face",
                        hazards: ["avalanche", "crevasse"]
                    }
                ],
                peaks: {
                    primary: {
                        name: "Summit",
                        hazards: ["altitude", "weather"]
                    }
                }
            }
        },
        expected: [
            ["rockfall", "exposure"],
            ["avalanche", "crevasse"],
            ["altitude", "weather"]
        ],
        hints: [
            "Use .. for recursive descent (deep scan)",
            "..propertyName finds that property at ANY depth",
            "Think: 'search everywhere for hazards'"
        ],
        solution: "$..hazards",
        explanation: "The .. operator (recursive descent) searches the entire document tree for matching property names, regardless of depth."
    },
    {
        id: 14,
        chapter: "Expedition",
        title: "All Zone Names",
        description: "Compile a complete list of all named locations.",
        mission: "Extract all 'name' values from anywhere in the document.",
        doc: {
            expedition: {
                name: "Alpine Challenge 2024",
                teams: [
                    { name: "Alpha", leader: "Chen" },
                    { name: "Bravo", leader: "Singh" }
                ],
                route: {
                    name: "Northern Approach",
                    waypoints: [
                        { name: "Start Gate", elevation: 2000 },
                        { name: "Ridge Pass", elevation: 3500 }
                    ]
                }
            }
        },
        expected: [
            "Alpine Challenge 2024",
            "Alpha",
            "Bravo",
            "Northern Approach",
            "Start Gate",
            "Ridge Pass"
        ],
        hints: [
            "Recursive descent finds properties at any level",
            "..name will find ALL 'name' properties",
            "Great for extracting specific fields from complex docs"
        ],
        solution: "$..name",
        explanation: "Using $..name recursively finds every 'name' property in the entire document, regardless of nesting level."
    },
    {
        id: 15,
        chapter: "Expedition",
        title: "Multiple Selections",
        description: "Need both camp IDs and their water status for the supply manifest.",
        mission: "Select camps that have EITHER id 'C1' OR id 'C3'.",
        doc: {
            expedition: {
                camps: [
                    { id: "BC", water: true },
                    { id: "C1", water: false },
                    { id: "C2", water: true },
                    { id: "C3", water: false },
                    { id: "C4", water: true }
                ]
            }
        },
        expected: [
            { id: "C1", water: false },
            { id: "C3", water: false }
        ],
        hints: [
            "You can use OR (||) in filter expressions",
            "Check if id equals 'C1' OR id equals 'C3'",
            "Alternative: use union syntax [1,3] for specific indices"
        ],
        solution: "$.expedition.camps[?(@.id == 'C1' || @.id == 'C3')]",
        explanation: "Complex filters can combine multiple conditions. Here we use || to match either 'C1' or 'C3'."
    },

    // ============================================
    // SUMMIT PUSH (Levels 16-20): Real-world Challenges
    // ============================================
    {
        id: 16,
        chapter: "Summit Push",
        title: "Critical Supplies",
        description: "Emergency: find all camps running low on oxygen.",
        mission: "Find teams with oxygen level below 30%.",
        doc: {
            dispatch: {
                teams: [
                    { callsign: "Alpha", oxygen: 85, altitude: 4200 },
                    { callsign: "Bravo", oxygen: 25, altitude: 7200 },
                    { callsign: "Charlie", oxygen: 45, altitude: 5800 },
                    { callsign: "Delta", oxygen: 18, altitude: 7800 },
                    { callsign: "Echo", oxygen: 62, altitude: 6100 }
                ]
            }
        },
        expected: [
            { callsign: "Bravo", oxygen: 25, altitude: 7200 },
            { callsign: "Delta", oxygen: 18, altitude: 7800 }
        ],
        hints: [
            "Filter by numeric comparison",
            "Find where oxygen < 30",
            "Standard filter: [?(@.oxygen < 30)]"
        ],
        solution: "$.dispatch.teams[?(@.oxygen < 30)]",
        explanation: "Numeric filters with < are essential for range queries. Here we find all teams with critically low oxygen."
    },
    {
        id: 17,
        chapter: "Summit Push",
        title: "High & Dry",
        description: "Identify teams at extreme altitude with low oxygen—priority rescue.",
        mission: "Find teams above 7000m altitude AND oxygen below 30%.",
        doc: {
            dispatch: {
                teams: [
                    { callsign: "Alpha", oxygen: 85, altitude: 4200 },
                    { callsign: "Bravo", oxygen: 25, altitude: 7200 },
                    { callsign: "Charlie", oxygen: 45, altitude: 5800 },
                    { callsign: "Delta", oxygen: 18, altitude: 7800 },
                    { callsign: "Echo", oxygen: 22, altitude: 6800 }
                ]
            }
        },
        expected: [
            { callsign: "Bravo", oxygen: 25, altitude: 7200 },
            { callsign: "Delta", oxygen: 18, altitude: 7800 }
        ],
        hints: [
            "Combine conditions with &&",
            "altitude > 7000 AND oxygen < 30",
            "Both conditions must be true"
        ],
        solution: "$.dispatch.teams[?(@.altitude > 7000 && @.oxygen < 30)]",
        explanation: "Combining && conditions lets you find elements matching multiple criteria—critical for precise queries."
    },
    {
        id: 18,
        chapter: "Summit Push",
        title: "Nested Hazard Check",
        description: "Deep scan the expedition manifest for avalanche warnings.",
        mission: "Find any zones where the hazard type is 'avalanche'.",
        doc: {
            expedition: {
                routes: [
                    {
                        name: "North Face",
                        zones: [
                            { name: "Approach", hazard: "rockfall" },
                            { name: "Ice Field", hazard: "avalanche" }
                        ]
                    },
                    {
                        name: "South Ridge",
                        zones: [
                            { name: "Base", hazard: "wildlife" },
                            { name: "Summit Push", hazard: "avalanche" }
                        ]
                    }
                ]
            }
        },
        expected: [
            { name: "Ice Field", hazard: "avalanche" },
            { name: "Summit Push", hazard: "avalanche" }
        ],
        hints: [
            "Navigate through routes, then zones",
            "Use [*] to get all elements at each level",
            "Filter zones where hazard equals 'avalanche'"
        ],
        solution: "$.expedition.routes[*].zones[?(@.hazard == 'avalanche')]",
        explanation: "Navigating through arrays with [*] and applying filters lets you search multiple nested arrays efficiently."
    },
    {
        id: 19,
        chapter: "Summit Push",
        title: "Team Roster",
        description: "Generate the radio callsign list for morning check-in.",
        mission: "Get only the callsigns of teams at altitude above 5000m.",
        doc: {
            dispatch: {
                teams: [
                    { callsign: "Alpha", oxygen: 85, altitude: 4200 },
                    { callsign: "Bravo", oxygen: 45, altitude: 7200 },
                    { callsign: "Charlie", oxygen: 55, altitude: 5800 },
                    { callsign: "Delta", oxygen: 38, altitude: 7800 },
                    { callsign: "Echo", oxygen: 72, altitude: 3100 }
                ]
            }
        },
        expected: ["Bravo", "Charlie", "Delta"],
        hints: [
            "First filter by altitude > 5000",
            "Then extract just the callsign property",
            "Chain: filter then property access"
        ],
        solution: "$.dispatch.teams[?(@.altitude > 5000)].callsign",
        explanation: "You can chain operations: filter first with [?()], then extract a specific property with .propertyName."
    },
    {
        id: 20,
        chapter: "Summit Push",
        title: "Final Mission",
        description: "Complete expedition status report: summarize all critical data.",
        mission: "Find all checkpoints on routes where difficulty is 'expert' and extract their names.",
        doc: {
            expedition: {
                routes: [
                    {
                        name: "Tourist Trail",
                        difficulty: "beginner",
                        checkpoints: [
                            { name: "Viewpoint A", elevation: 2000 },
                            { name: "Rest Stop", elevation: 2200 }
                        ]
                    },
                    {
                        name: "North Face",
                        difficulty: "expert",
                        checkpoints: [
                            { name: "Ice Wall", elevation: 4500 },
                            { name: "Death Zone Entry", elevation: 7000 },
                            { name: "Summit", elevation: 8200 }
                        ]
                    },
                    {
                        name: "South Ridge",
                        difficulty: "expert",
                        checkpoints: [
                            { name: "Hillary Step", elevation: 7800 },
                            { name: "Final Push", elevation: 8100 }
                        ]
                    }
                ]
            }
        },
        expected: ["Ice Wall", "Death Zone Entry", "Summit", "Hillary Step", "Final Push"],
        hints: [
            "Filter routes by difficulty first",
            "Then access checkpoints array of matching routes",
            "Finally extract the name from each checkpoint"
        ],
        solution: "$.expedition.routes[?(@.difficulty == 'expert')].checkpoints[*].name",
        explanation: "This complex query chains: filter routes → get all checkpoints → extract names. This is the power of JSONPath+ for navigating complex data!"
    }
];

// Chapter metadata for UI
const CHAPTERS = [
    { id: "base-camp", name: "Base Camp", levels: [1, 2, 3, 4, 5], icon: "⛺" },
    { id: "route-planning", name: "Route Planning", levels: [6, 7, 8, 9, 10], icon: "🗺️" },
    { id: "expedition", name: "Expedition", levels: [11, 12, 13, 14, 15], icon: "🧗" },
    { id: "summit-push", name: "Summit Push", levels: [16, 17, 18, 19, 20], icon: "🏔️" }
];

// Export for use in game.js and tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVELS, CHAPTERS };
}
