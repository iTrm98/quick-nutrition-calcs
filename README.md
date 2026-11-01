# Quick Calcs

A fast, lightweight web tool for common **clinical nutrition calculations**. Pick an equation, enter the patient values, and the result updates instantly, together with the reference it comes from.

Built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

## Features

- **26 calculators** across adult and pediatric nutrition, grouped by clinical area
- **Searchable dropdown** to find an equation quickly
- **Live results** that update as you type
- **BMI classification** with a color-coded status (underweight to obese class III)
- **Multi-select input** for estimating body mass after amputations
- **Reference shown under every result** so the source of each equation is clear
- **Guideline images** for the Quick Method (energy, protein, and fluid) in a pop-up viewer
- **Responsive layout** for desktop, tablet, and mobile

## Calculators

### Adult

| Area | Calculators |
|---|---|
| Weight Assessment | BMI, Ideal Body Weight (Hamwi), Adjusted Body Weight, Dry Weight, Estimated Amputation Body Mass |
| Macronutrient and Fluid Requirement | Harris-Benedict, Total Energy Expenditure (TEE), Mifflin-St Jeor, Quick Method, Macronutrient Distribution, Baseline Fluid Requirement |
| Critical Illness | Ireton-Jones (Ventilator), Ireton-Jones (Spontaneous), Penn State (PSU) |
| Athletic | Cunningham (BMR) |
| Fluid and Electrolyte Management | Water Deficit |
| Diabetes | Insulin to Carb Ratio, Insulin Sensitivity, Correction Dose |

### Pediatric

| Area | Calculators |
|---|---|
| Macronutrient and Fluid Requirement | RDA (Calorie/Protein), Schofield (BMR), Macronutrient Distribution, Baseline Fluid Requirement |
| Special Cases (5-12 years) | Down Syndrome, Cerebral Palsy, Prader-Willi Syndrome |

## Getting Started

No installation needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/iTrm98/Quick-Calcs.git
   ```
2. Open `index.html` in any modern browser.

To serve it locally instead, run this inside the project folder and open `http://localhost:8000`:

```bash
python -m http.server 8000
```

## Project Structure

```
Quick-Calcs/
├── index.html    # Page structure
├── style.css     # Styling and responsive layout
├── script.js     # Calculator data, equation logic, and UI behavior
└── README.md
```

The Quick Method pop-ups load `energy_guidelines.jpg`, `protein_guidelines.jpg`, and `fluid_guidelines.jpg`, which need to be in the same folder as `index.html`.

## How It Works

Each calculator is defined once in `script.js` as an entry containing its name, input fields, reference, and a `logic` function. The interface (dropdown, input form, and result display) is generated from that data, so adding a new equation only requires adding one entry to `CALC_DATA`.

## Disclaimer

This tool is for educational and professional reference only. It does not replace clinical judgment. Always verify results against the original sources and your institution's protocols before applying them to patient care.

## References

Equations and guideline values are cited in the app next to each result. The primary source is *The Essential Pocket Guide for Clinical Nutrition* (4th ed., Academy of Nutrition and Dietetics, 2024).

## Author

**Turki Alsufyani**: [GitHub](https://github.com/iTrm98) 