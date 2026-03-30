# UX / UI Design

## Palette

- **Nautical Blue:** Deep ocean color for primary backgrounds.
  - ![#053A5A](./images/palette/053A5A.png) Dark (`#053A5A`)
  - ![#09527D](./images/palette/09527D.png) Base (`#09527D`)
  - ![#1F77A9](./images/palette/1F77A9.png) Light (`#1F77A9`)
- **Parchment Tan:** Warm sandy color for primary text and light panels.
  - ![#C49C65](./images/palette/C49C65.png) Dark (`#C49C65`)
  - ![#EAC796](./images/palette/EAC796.png) Base (`#EAC796`)
  - ![#F4DFB8](./images/palette/F4DFB8.png) Light (`#F4DFB8`)
- **Terracotta Orange:** Sunburnt orange for borders, warnings, and accents.
  - ![#A1451E](./images/palette/A1451E.png) Dark (`#A1451E`)
  - ![#D86938](./images/palette/D86938.png) Base (`#D86938`)
  - ![#E58A60](./images/palette/E58A60.png) Light (`#E58A60`)
- **Seafoam Green:** Muted green from the ribbons, perfect for 'Safe Harbor' mapping and success states.
  - ![#457D65](./images/palette/457D65.png) Dark (`#457D65`)
  - ![#6BA890](./images/palette/6BA890.png) Base (`#6BA890`)
  - ![#93C6B1](./images/palette/93C6B1.png) Light (`#93C6B1`)
- **Ink Brown:** Dark aged brown for deep contrast, UI panel backgrounds, and borders.
  - ![#1E100A](./images/palette/1E100A.png) Dark (`#1E100A`)
  - ![#3A2318](./images/palette/3A2318.png) Base (`#3A2318`)
  - ![#5E3B29](./images/palette/5E3B29.png) Light (`#5E3B29`)

## Fonts

- **Header / Display Font:** `Beau Rivage` (Used for big titles, the Storm Glass, timer numbers, and all nautical thematic elements).  

- **Body / Utility Font:** `Quattrocento` (A highly legible, classic Roman serif used for all small UI text, inputs, buttons, and paragraphs).  

## Images

## Home Page

**Top Navigation Bar (Quick Access):**
Because we need to allow the user to change their settings quickly, these should live at the very top of the screen on the home page:
- **Top Left:** `[Captain's Profile Button]` (An icon of a pirate hat or wheel to open the weight/sex settings modal).
- **Top Right:** `[Storm Glass Button]` (An icon of a barometer to open the Buzz Target settings modal to adjust the target BAC limit).
- **Center Title:** "Blottolog" written in `Beau Rivage`.

**Primary View (The Hero Section):**
- **Course Plot (The Timer):** This is the focal point. A large UI component taking up the top half of the screen. It features the treasure map animation of the ship navigating toward the target. 
- **The Countdown:** Prominent countdown text below the map (e.g., "Next Port of Call in 34:12").

**Secondary View (The Graphic Manifest):**
- **Manifest (Active Drinks List):** Below the timer sits the manifest. Instead of a text list, drinks are highly graphic, represented by themed illustrations of bottles, tankards, and glasses (e.g., a rum bottle for liquor, a wooden mug for beer).
- **Layout:** The icons are centered in the view and aggregate horizontally side-by-side. Once the row runs out of horizontal room, they wrap and flow underneath into a new row (a flex-wrap layout). They contain very little to no text, relying purely on visual representation to show the 'Cargo' filling up.

**Primary Action:**
- **Add Drink Button:** A persistent Floating Action Button (FAB) at the bottom right/center. Visually, this could be a large, shiny gold Doubloon that opens the "Quick Add" drink sheet when tapped.

## Captain's Profile

## Manifest (Active Drinks List)

## Storm Glass (Buzz Target)

## Course Plot (Timer)
