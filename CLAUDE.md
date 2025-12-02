# Summit Pathfinder Academy

An interactive game for learning JSONPath+


This is a web based game for learning JSONPath+. Use vanilla HTML, JavaScript, and CSS. 
Use TailwindCSS from a CDN where neccessary. 
This will be hosted on github pages to keep things simple. Write automated tests with jest. 
Include github actions to run the tests in CI before merging.

The goal is to build an interactive tutorial website that quickly teaches users how to craft a json path that works well for Stainless config management. 

Each example input document should be stored as yaml, but the UI should have a toggle for viewing the input documents as either json or yaml and be able to swap between them interchangably.




---

## 1) **Summit Pathfinder Academy**

**Story:** You’re a trainee in an elite mountain-navigation school. Each level is a new terrain map encoded as JSON/YAML. Instructors give you objectives like “locate all safe camps above treeline” or “find routes that avoid avalanche zones.”
**Path pun:** You’re literally learning “path finding.”
**Mechanics fit:**

* Selecting nodes = choosing waypoints
* Filters = safety constraints
* Deep scans = searching terrain layers
* Unions/slices = alternate routes

**Level arc:**

* **Base Camp (Levels 1–5):** basic selects (`$.mountain.peaks[*].name`)
* **Route Planning (6–10):** filters on difficulty/weather
* **Expedition (11–15):** nested hazards and multi-stage routes
* **Summit Push (16–20):** big realistic topo doc

**Flavor text example:**

> “Your guide says: ‘Only pick camps with water nearby and wind < 20kph.’”

---

## 2) **The Cartographer’s Guild: Trails of the Old World**

**Story:** You’re restoring an ancient atlas. Each scroll is a region’s trail network. Your queries “reveal” hidden trails, ruins, and supply caches.
**Path pun:** Queries uncover the “true paths” in the atlas.
**Mechanics fit:**

* Wildcards = “scan the whole valley”
* Descendants = “search all subregions”
* Functions = “count supplies for this route”

**Progression idea:** Each chapter is a biome (alpine, desert, jungle, glacier) and introduces one new operator.

**Mini twist:** Some maps are *corrupted* (missing fields), so players learn robustness: `?(@.water && @.elevation > 2500)`.

---

## 3) **Avalanche Ops Control Room**

**Story:** You’re in a rescue/navigation center monitoring expeditions. Docs are live telemetry and team rosters. You must query quickly to answer dispatch questions.
**Mechanics fit:** Super realistic “why JSONPath matters” vibe.
**Tension:** timed/boss levels.

**Example tasks:**

* “Find teams currently in Red hazard zones.”
* “List climbers whose oxygen < 30% AND altitude > 7000m.”
* “Select nearest safe LZs to Team Echo.”

**Endgame:** One big incident doc where you run 3–4 queries to coordinate rescue.

---

## 4) **Trailblazer Roguelike (Hex Grid Edition)**

**Story:** You’re a lone explorer moving through a procedural mountain hex map. Each level is a “map chunk” (JSON). The correct query reveals where you can move next.
**Mechanics fit:**

* Output nodes = valid moves
* If you overselect, you “get lost”
* If you underselect, you “miss the trail”

**Fun UI twist:** After you solve, your path draws on a mini-map with the nodes you selected.

---

## 5) **Orienteering Championship**

**Story:** Competitive navigation race. You’re given a messy event dataset with checkpoints, terrain penalties, and competitor stats. Your job is to query the optimal route or validate results.
**Mechanics fit:** Great for teaching sorting/filtering and array slicing.

**Example tasks:**

* “Select all checkpoints in order for Course B.”
* “Find runners who skipped any checkpoint.”
* “Get split times for competitors under 40 minutes.”

**Boss:** “Disqualify anyone missing a mandatory control.”

---

## 6) **Mythic Mountain: The Seven Passes**

**Story:** A fantasy expedition across seven passes to reach a legendary summit. Each pass introduces new data structures: villages, rivers, hazards, weather gods.
**Path pun:** “Seven Paths,” “choose the right path,” etc.
**Mechanics fit:** Narrative progression mirrors operator complexity.

**Chapters:**

1. The Foothills (basic selects)
2. Pine Maze (wildcards)
3. River Delta (arrays)
4. Scree Slopes (filters)
5. Glacier Labyrinth (descendants / deep scan)
6. Storm Ridge (boolean logic)
7. Summit Gate (composed queries)

---

## Concrete “path” wordplay you can bake into UI

* Call the input box **“Route Expression”** or **“Path Spell”**
* Show a little **breadcrumb trail** of the current highlighted nodes
* Hints as **compass bearings** (Nudge → Operator → Almost-there)
* Success animation = flag planted at summit
* Chapters named after nav skills: *Bearing, Backtrack, Traverse, Summit*

---

## Example early level set (mountaineering flavored)

**Doc snippet**

```yaml
mountain:
  peaks:
    - name: "Larkspur"
      elevation: 3120
      hazards: ["rockfall"]
    - name: "Helios"
      elevation: 4210
      hazards: ["avalanche","crevasse"]
  camps:
    - id: "BC"
      elevation: 1800
      water: true
    - id: "C1"
      elevation: 2600
      water: false
```

**Level prompts**

1. “Highlight all peaks.” → `$.mountain.peaks[*]`
2. “Get peak names only.” → `$.mountain.peaks[*].name`
3. “Find peaks above 4000m.” → `$.mountain.peaks[?(@.elevation>4000)]`
4. “Select camps with water.” → `$.mountain.camps[?(@.water==true)]`
5. “Find hazards anywhere in the mountain report.” → `$.mountain..hazards[*]` (if `..` supported)

---

If you want to pick one of these, I can flesh it into a full 20–30 level curriculum with exact docs, targets, hint text, and a cute UI glossary (compass, altimeter, etc.).




You’re basically describing “JSONPath Diner / YAML Froggy”: a tiny, joyful, level-based game that teaches query muscle memory through play. Here’s a concrete blueprint you can run with.

---

## Core concept

**Goal:** Teach JSONPath+ by asking players to “select” items in a JSON/YAML document.
**Loop:**

1. Show a small document (left).
2. Show a target outcome (right): highlight nodes, list of values, or “you need X items”.
3. Player types a JSONPath+ expression.
4. Instant feedback with highlights + output.
5. Win condition: output matches target.

Keep it super lightweight and dopamine-y: short levels, immediate “aha” moments, silly theming.

---

## Theme ideas (pick one)

**1) “Artifact Archive” (kinda Vim Adventures vibe)**
You’re an archivist in a magical library. Each level is a scroll. JSONPath spells reveal artifacts.

**2) “Spaceport Cargo Scanner”**
Documents are cargo manifests; targets are “find all hazardous crates”, “get pilot names”, etc.

**3) “Pet Shelter” (Flexbox Froggy energy)**
Docs represent cages, animals, adopters; targets are “select all dogs older than 5”, etc.

Theme matters because it gives you *narrative reasons* for filters.

---

## Level structure (like CSS Diner / SQL Zoo)

### Level types

1. **Selection**

   * “Select all `users`”
   * “Select the 3rd comment”
2. **Filtering**

   * by equality, contains, regex, numeric comparisons
3. **Structure navigation**

   * deep search, descendants, wildcards
4. **Composition**

   * unions, slices, nested filters
5. **Practical tasks**

   * “Find all failing CI jobs by repo”
   * “Grab all endpoints that require auth”

### Difficulty ramp

* 1–5: basics of targeting nodes
* 6–10: arrays + simple filters
* 11–15: nested filters + wildcards
* 16–20: real-world messy docs
* Bonus “boss levels”: big doc, multiple steps, time limit optional

---

## UI layout

**Split view:**

**Left pane: Document**

* Toggle: JSON / YAML (same data)
* Collapsible tree + raw text view
* Clicking a node shows its path (nice hint)

**Right pane: Target + Output**

* Target shown as:

  * highlighted nodes in doc, *or*
  * “Expected output” panel (hidden until failure maybe)
* Live output preview for their query

**Bottom/center: Query editor**

* Monospace input
* Inline error messages
* Autocomplete for operators (later)

### Feedback

* **Green highlight = correct nodes**
* **Yellow highlight = extra nodes**
* **Red highlight = missing nodes**
* Tiny celebratory animation on solve
* Show “diff” between expected and actual output

---

## Hints system (super important)

Give hints in tiers so people learn instead of copy:

1. **Nudge**: “Try starting from `$.store`”
2. **Operator hint**: “You’ll need a filter `[?()]` here.”
3. **Almost-there hint**: highlight approximate subtree
4. **Show solution** (after 3 fails)
5. **Explain solution** in 1–2 lines

Also include a **“Why?” button** after completion that gives a mini explanation.

---

## Example early levels

### Level 1: Pick a field

Doc:

```json
{ "user": { "name": "Ava", "id": 3 } }
```

Target: highlight `"Ava"`
Solution: `$.user.name`

### Level 4: Array index

```yaml
fruits:
  - apple
  - banana
  - cherry
```

Target: output `banana`
Solution: `$.fruits[1]`

### Level 7: Filter

```json
{ "pets": [
  {"type":"dog","age":2},
  {"type":"cat","age":9}
]}
```

Target: highlight the cat
Solution: `$.pets[?(@.type=="cat")]`

### Level 12: Nested filter

```json
{ "orders": [
  { "id":1, "items":[{"sku":"x","qty":2}] },
  { "id":2, "items":[{"sku":"y","qty":0}] }
]}
```

Target: highlight order `id=2`
Solution: `$.orders[?(@.items[?(@.qty==0)])]`

Make your level text whimsical like CSS Diner:

> “Find all the shy cats hiding in the pet list.”

---

## JSONPath+ “curriculum” checklist

Make sure every operator appears at least twice:

* Root `$`
* Dot + bracket notation
* Wildcards `*`
* Descendant / deep scan (`..` if supported)
* Array indices, slices
* Filters `[?()]`
* Comparators `== != > < >= <=`
* Boolean ops `&& || !`
* Regex / contains / startswith (whatever JSONPath+ supports)
* Unions `[a,b]`
* Functions (length, keys, etc.) if part of your dialect

---

## “Real docs” mode (after basics)

Like SQL Zoo’s later sections, give bigger tasks:

* Provide a medium JSON/YAML blob (APIs, Kubernetes manifests, GitHub payloads)
* Task list with checkboxes
* Let them solve in any order
* Score by number of queries

Example packs:

* “K8s Quest”
* “OpenAPI Explorer”
* “CI Pipeline Debugger”

This makes the tool feel *useful*, not just a toy.

---

## Tech stack / implementation sketch

### Data execution

* Use an existing JSONPath+ evaluator (JS library)
* Convert YAML to JSON for evaluation (keep YAML view purely visual)
* Normalize output for comparisons:

  * stable sort arrays of primitives
  * compare by deep equality for nodes

### Frontend

* React + Monaco editor (or CodeMirror) for nice input & errors
* Tree viewer (react-json-view / custom)
* A small state machine per level:

  * doc data
  * expected nodes (paths) or expected output
  * hint counters

### Level format (simple JSON)

```json
{
  "id": 7,
  "title": "Shy cats",
  "doc": {...},
  "expected": {
    "type": "paths",
    "value": ["$.pets[1]"]
  },
  "starter": "$.pets[?()]",
  "hints": [
    "You’re looking inside pets.",
    "Try filtering by type.",
    "Use @.type == \"cat\""
  ],
  "solution": "$.pets[?(@.type==\"cat\")]",
  "explain": "Filters keep elements where the condition is true."
}
```

---

## Little touches that make it *feel like a game*

* **World map** of levels (diner plates / lily pads / library rooms)
* **Badges** for finishing a chapter with no hints
* **“Sandbox” mode** unlocked early
* **Shareable level links** (seeded by URL)
* Sound toggle + tiny animations
* Easter eggs (“type `$.**` to summon chaos”)

---

## If you want a killer MVP in 1–2 weekends

**MVP scope**

1. 20 levels
2. JSON/YAML toggle
3. Query input + live highlighting
4. Hints (3 tiers)
5. Chapter selection screen

Everything else can come later.

---

If you want, tell me which JSONPath+ dialect/features you’re targeting (especially deep scan syntax, functions, regex). I can draft:

* a 20–30 level progression,
* a coherent theme/story,
* and exact expected outputs/solutions for each level.



