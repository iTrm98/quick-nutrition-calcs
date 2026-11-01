// --- 1. DATA DEFINITION ---

const CALC_DATA = {
    adult: {
        "Weight Assessment": {
            bmi: {
                name: "Body Mass Index (BMI)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 10). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.h) return null;
                    const h_m = v.h / 100;
                    const bmi = v.w / (h_m * h_m);
                    return { val: bmi.toFixed(1), unit: "kg/m²", raw: bmi };
                }
            },
            ibw: {
                name: "Ideal Body Weight (Hamwi)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 6). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "h_cm", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.h_cm) return null;
                    const base = v.g === "Male" ? 48.1 : 45.5;
                    const factor = v.g === "Male" ? 1.1 : 0.9;
                    const ibw = base + ((v.h_cm - 152) * factor);
                    return { val: ibw.toFixed(1), unit: "kg" };
                }
            },
            adjBW: {
                name: "Adjusted Body Weight",
                ref: "Pai, M. P., & Paloucek, F. P. (2000). The origin of the 'ideal' body weight equations. The Annals of pharmacotherapy, 34(9), 1066–1069.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "w", label: "Current Weight (kg)", type: "number" },
                    { id: "h_cm", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.h_cm || !v.w) return null;
                    const base = v.g === "Male" ? 48.1 : 45.5;
                    const factor = v.g === "Male" ? 1.1 : 0.9;
                    const ibw = base + ((v.h_cm - 152) * factor);
                    const adj = ibw + (0.4 * (v.w - ibw));
                    return { val: adj.toFixed(1), unit: "kg" };
                }
            },
            dryW: {
                name: "Dry Weight",
                ref: "Newsome PN, Allison ME, Andrews PA, et al. Guidelines for liver transplantation for patients with non-alcoholic steatohepatitis. Gut. 2012;61(4):484-500.",
                inputs: [
                    { id: "w", label: "Current Weight (kg)", type: "number" },
                    { id: "deduct", label: "Edema/Ascites", type: "select", options: [
                        {val: 0, txt: "None"},
                        {val: 2.2, txt: "Ascites: Minimal (2.2 kg)"},
                        {val: 6.0, txt: "Ascites: Moderate (6.0 kg)"},
                        {val: 14.0, txt: "Ascites: Severe (14.0 kg)"},
                        {val: 1.0, txt: "Edema: Minimal (1.0 kg)"},
                        {val: 5.0, txt: "Edema: Moderate (5.0 kg)"},
                        {val: 10.0, txt: "Edema: Severe (10.0 kg)"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.w) return null;
                    return { val: (v.w - parseFloat(v.deduct)).toFixed(1), unit: "kg" };
                }
            },
            ampBW: {
                name: "Est. Amputation Body Mass",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 7). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "h_cm", label: "Height (cm)", type: "number" },
                    { 
                        id: "amp", 
                        label: "Amputation(s)", 
                        type: "select", 
                        multiple: true, // Enabled multiple selection
                        options: [
                            {val: 0.7, txt: "Hand (0.7%)"},
                            {val: 1.4, txt: "Hands (1.4%)"},
                            {val: 1.5, txt: "Foot (1.5%)"},
                            {val: 3.0, txt: "Feet (3.0%)"},
                            {val: 2.3, txt: "Forearm & Hand (2.3%)"},
                            {val: 4.6, txt: "Forearms & Hands (4.6%)"},
                            {val: 5.9, txt: "Lower Leg & Foot (5.9%)"},
                            {val: 11.8, txt: "Lower Legs & Feet (11.8%)"},
                            {val: 16.0, txt: "Entire Leg (16.0%)"},
                            {val: 32.0, txt: "Entire Legs (32.0%)"},
                            {val: 5.0, txt: "Entire Arm (5.0%)"},
                            {val: 10.0, txt: "Entire Arms (10.0%)"},
                            {val: 10.1, txt: "Above Knee (10.1%)"},
                            {val: 20.2, txt: "Above Knees (20.2%)"}
                        ]
                    }
                ],
                logic: (v) => {
                    if(!v.h_cm) return null;
                    const base = v.g === "Male" ? 48.1 : 45.5;
                    const factor = v.g === "Male" ? 1.1 : 0.9;
                    const ibw = base + ((v.h_cm - 152) * factor);
                    // v.amp will be passed as the summed percentage from the UI handler
                    const res = ((100 - parseFloat(v.amp || 0)) / 100) * ibw;
                    return { val: res.toFixed(1), unit: "kg" };
                }
            }
        },
        "Macronutrient and Fluid Requirement (General use)": {
            hbe: {
                name: "Harris-Benedict (HBE)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 13). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h_cm", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.h_cm || !v.a) return null;
                    let res = 0;
                    if(v.g === "Female") {
                        res = 655.1 + (9.6*v.w) + (1.9*v.h_cm) - (4.7*v.a);
                    } else {
                        res = 66.5 + (13.8*v.w) + (5.0*v.h_cm) - (6.8*v.a);
                    }
                    return { val: Math.round(res), unit: "kcal/day" };
                }
            },
            tee: {
                name: "Total Energy Expenditure (TEE)",
                ref: "Width, Mary, and Tonia Reinhard. The Essential Pocket Guide for Clinical Nutrition. Vol. 403, Jones & Bartlett Learning, 23 Apr. 2024, p. 12-13.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h_cm", label: "Height (cm)", type: "number" },
                    { id: "af", label: "Physical Activity Factor", type: "select", options: [
                        {val: "", txt: ""},
                        {val: 1.2, txt: "Sedentary (little or no exercise): 1.2"},
                        {val: 1.375, txt: "Lightly active (30 min moderate, 1-3 days/wk): 1.375"},
                        {val: 1.55, txt: "Moderately active (45 min moderate, 3-5 days/wk): 1.55"},
                        {val: 1.725, txt: "Very active (1 hr training, 6-7 days/wk): 1.725"},
                        {val: 1.9, txt: "Extra active (very hard training/physical job): 1.9"}
                    ]},
                    { id: "sf", label: "Stress Factor", type: "select", options: [
                        {val: "", txt: ""},
                        {val: 1.1, txt: "Minor Surgery: 1.1"},
                        {val: 1.2, txt: "Major Surgery: 1.2"},
                        {val: 1.2, txt: "Skeletal Trauma: 1.2"},
                        {val: 1.35, txt: "Blunt Trauma: 1.35"},
                        {val: 1.4, txt: "Closed Head Injury: 1.4"},
                        {val: 1.2, txt: "Mild Infection: 1.2"},
                        {val: 1.4, txt: "Moderate Infection: 1.4"},
                        {val: 1.8, txt: "Severe Infection: 1.8"},
                        {val: 0.85, txt: "Starvation: 0.85"},
                        {val: 1.5, txt: "Burns <20% TBSA: 1.5"},
                        {val: 1.8, txt: "Burns 20%-40% TBSA: 1.8"},
                        {val: 2.0, txt: "Burns >40% TBSA: 2.0"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.w || !v.h_cm || !v.a) return null;
                    
                    let hbe = 0;
                    if(v.g === "Female") hbe = 655.1 + (9.6*v.w) + (1.9*v.h_cm) - (4.7*v.a);
                    else hbe = 66.5 + (13.8*v.w) + (5.0*v.h_cm) - (6.8*v.a);

                    // Handle Not Mandatory (Default to 1.0 if empty)
                    const af = v.af ? parseFloat(v.af) : 1.0;
                    const sf = v.sf ? parseFloat(v.sf) : 1.0;

                    return { val: Math.round(hbe * af * sf), unit: "kcal/day" };
                }
            },
            mifflin: {
                name: "Mifflin-St Jeor (BMR)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 12). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h_cm", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.h_cm || !v.a) return null;
                    let res = (10*v.w) + (6.25*v.h_cm) - (5*v.a);
                    res += (v.g === "Male" ? 5 : -161);
                    return { val: Math.round(res), unit: "kcal/day" };
                }
            },
            quick: {
                name: "Quick Method",
                ref: null,
                inputs: [
                    { id: "w", label: "Weight (kg)", type: "number" },
                    
                    // Energy Section
                    { 
                        type: "html", 
                        html: `
                        <div style="width:100%; text-align:left; margin-top: 16px; margin-bottom: 4px;">
                            <span onclick="openModal('energy_guidelines.jpg', 'Energy Guidelines')" style="font-size:13px; color:#3b82f6; cursor:pointer; font-weight:500; display:inline-flex; align-items:center; gap:4px;">
                                Energy Guidelines ⓘ 
                            </span>
                        </div>` 
                    },
                    { id: "emin", label: "Energy Min (kcal/kg)", type: "number" },
                    { id: "emax", label: "Energy Max (kcal/kg)", type: "number" },

                    // Protein Section
                    { 
                        type: "html", 
                        html: `
                        <div style="width:100%; text-align:left; margin-top: 20px; margin-bottom: 4px;">
                            <span onclick="openModal('protein_guidelines.jpg', 'Protein Guidelines')" style="font-size:13px; color:#3b82f6; cursor:pointer; font-weight:500; display:inline-flex; align-items:center; gap:4px;">
                                Protein Guidelines ⓘ
                            </span>
                        </div>` 
                    },
                    { id: "pmin", label: "Protein Min (g/kg)", type: "number" },
                    { id: "pmax", label: "Protein Max (g/kg)", type: "number" },

                    // Fluid Section
                    { 
                        type: "html", 
                        html: `
                        <div style="width:100%; text-align:left; margin-top: 20px; margin-bottom: 4px;">
                            <span onclick="openModal('fluid_guidelines.jpg', 'Fluid Guidelines')" style="font-size:13px; color:#3b82f6; cursor:pointer; font-weight:500; display:inline-flex; align-items:center; gap:4px;">
                                Fluid Guidelines ⓘ
                            </span>
                        </div>` 
                    },
                    { id: "fmin", label: "Fluid Min (ml/kg)", type: "number" },
                    { id: "fmax", label: "Fluid Max (ml/kg)", type: "number" }
                ],
                logic: (v) => {
                    const weight = v.w;

                    if(!weight || weight <= 0) return null;

                    // Helper for range
                    const getRange = (min, max, isFloat=false) => {
                        if(!min || !max) return ""; 
                        const v1 = weight * min;
                        const v2 = weight * max;
                        const low = Math.min(v1, v2);
                        const high = Math.max(v1, v2);
                        if(isFloat) return `${low.toFixed(1)} - ${high.toFixed(1)}`;
                        return `${Math.round(low)} - ${Math.round(high)}`;
                    }

                    const e_range = getRange(v.emin, v.emax);
                    const p_range = getRange(v.pmin, v.pmax, true);
                    const f_range = getRange(v.fmin, v.fmax);

                    return { 
                        val: `Energy: ${e_range} kcal\nProtein: ${p_range} g\nFluid: ${f_range} mL`, 
                        unit: "/day" 
                    };
                }
            },
            macroDist: {
                name: "Macronutrient Distribution",
                ref: null,
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h_cm", label: "Height (cm)", type: "number" },
                    { id: "cp", label: "Carb %", type: "number" },
                    { id: "pp", label: "Protein %", type: "number" },
                    { id: "fp", label: "Fat %", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w) return null;
                    let mifflin = (10*v.w) + (6.25*v.h_cm) - (5*v.a);
                    mifflin += (v.g === "Male" ? 5 : -161);
                    
                    const c = Math.round((mifflin * (v.cp/100)) / 4);
                    const p = Math.round((mifflin * (v.pp/100)) / 4);
                    const f = Math.round((mifflin * (v.fp/100)) / 9);
                    return { val: `Carbs: ${c} g\nProtein: ${p} g\nFat: ${f} g`, unit: "/day (Based on Mifflin)" };
                }
            },
            fluid: {
                name: "Baseline Fluid Requirement",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p.64, 65). Academy of Nutrition and Dietetics.",
                inputs: [ { id: "w", label: "Weight (kg)", type: "number" } ],
                logic: (v) => {
                    if(!v.w) return null;
                    let f = 0;
                    if(v.w <= 10) f = 100 * v.w;
                    else if(v.w <= 20) f = 1000 + (50 * (v.w - 10));
                    else f = 1500 + (20 * (v.w - 20));
                    return { val: Math.round(f), unit: "mL/day" };
                }
            }
        },
        "Critical Ill Requirement": {
            iretonVent: {
                name: "Ireton-Jones (Ventilator)",
                ref: "Barcellos PS, Borges N, Torres DPM. New equation to estimate resting energy expenditure in non-critically ill patients.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "trauma", label: "Trauma?", type: "select", options: [{val:0, txt:"No"}, {val:1, txt:"Yes"}] },
                    { id: "burn", label: "Burn?", type: "select", options: [{val:0, txt:"No"}, {val:1, txt:"Yes"}] }
                ],
                logic: (v) => {
                    if(!v.w || !v.a) return null;
                    let res = 1784 - (11*v.a) + (5*v.w);
                    if(v.g === "Male") res += 244;
                    if(parseInt(v.trauma) === 1) res += 239;
                    if(parseInt(v.burn) === 1) res -= 804;
                    return { val: Math.round(res), unit: "kcal/day" };
                }
            },
            iretonSpont: {
                name: "Ireton-Jones (Spontaneous)",
                ref: "Ireton-Jones CS, Turner WW Jr, Liepa GU, Baxter CR. Equations for the estimation of energy expenditures in patients with",
                inputs: [
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.a || !v.h) return null;
                    const h_m = v.h/100;
                    const bmi = v.w / (h_m * h_m);
                    let res = 629 - (11*v.a) + (25*v.w);
                    if(bmi > 30) res -= 609;
                    return { val: Math.round(res), unit: "kcal/day" };
                }
            },
            pennState: {
                name: "Penn State (PSU)",
                ref: "burns with special reference to ventilatory status. J Burn Care Rehabil. 1992;13(3):330-333. doi:10.1097/00004630-",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h", label: "Height (cm)", type: "number" },
                    { id: "tmax", label: "Max Temp (°C)", type: "number" },
                    { id: "ve", label: "Ve (L/min)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.tmax || !v.ve) return null;
                    let mifflin = (10*v.w) + (6.25*v.h) - (5*v.a);
                    mifflin += (v.g === "Male" ? 5 : -161);
                    const bmi = v.w / ((v.h/100)*(v.h/100));
                    
                    let res = 0;
                    if(bmi > 30 && v.a > 60) {
                        res = (mifflin * 0.71) + (v.tmax * 85) + (v.ve * 64) - 3085;
                        return { val: Math.round(res), unit: "kcal/day (Obesity Var)" };
                    } else {
                        res = (mifflin * 0.96) + (v.tmax * 167) + (v.ve * 31) - 6212;
                        return { val: Math.round(res), unit: "kcal/day (Standard)" };
                    }
                }
            }
        },
        "Athletic": {
            cunningham: {
                name: "Cunningham (BMR)",
                ref: "M. M. Manore, N. L. Meyer, and J. Thompson, Sport Nutrition for Health and Performance, 2 ed.: Human Kinetic, 2009.",
                inputs: [
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "bf", label: "Body Fat %", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.bf) return null;
                    const lbm = v.w - (v.w * (v.bf/100));
                    const res = 500 + (22 * lbm);
                    return { val: Math.round(res), unit: "kcal/day" };
                }
            }
        },
        "Fluid and Electrolyte Management": {
            waterDeficit: {
                name: "Water Deficit",
                ref: "Braun MM, Barstow CH, Pyzocha NJ. Diagnosis and management of sodium disorders: hyponatremia and hypernatremia. Am Fam Physician. 2015;91(5):299-307.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "a", label: "Age", type: "number" },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "na", label: "Sodium (mmol/L)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.na || !v.a) return null;
                    let tbw = 0.5;
                    if(v.g === "Male") {
                        tbw = v.a > 65 ? 0.5 : 0.6;
                    } else {
                        tbw = v.a > 65 ? 0.45 : 0.5;
                    }
                    const res = tbw * v.w * ((v.na - 140)/140);
                    return { val: res.toFixed(2), unit: "Liters" };
                }
            }
        },
        "Diabetes": {
            insulinCarb: {
                name: "Insulin to Carb Ratio",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 195). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "tdd", label: "Total Daily Dose", type: "number" },
                    { id: "type", label: "Insulin Type", type: "select", options: [
                        {val: 500, txt: "Rapid-acting insulin (i.e., Humalog or Novolog)"}, 
                        {val: 450, txt: "Short-acting (i.e., Humulin R or Novolin R)"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.tdd) return null;
                    return { val: (parseFloat(v.type) / v.tdd).toFixed(1), unit: "g CHO / Unit" };
                }
            },
            insulinSens: {
                name: "Insulin Sensitivity",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 196). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "tdd", label: "Total Daily Dose", type: "number" },
                    { id: "type", label: "Insulin Type", type: "select", options: [
                        {val: 1800, txt: "Rapid-acting insulin (i.e., Humalog or Novolog)"}, 
                        {val: 1500, txt: "Short-acting (i.e., Humulin R or Novolin R)"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.tdd) return null;
                    return { val: Math.round(parseFloat(v.type) / v.tdd), unit: "mg/dL / Unit" };
                }
            },
            corrBG: {
                name: "Correction Dose",
                ref: null,
                inputs: [
                    { id: "curr", label: "Current BG (mg/dL)", type: "number" },
                    { id: "target", label: "Target BG (mg/dL)", type: "number" },
                    { id: "isf", label: "Manual ISF (mg/dL/U)", type: "number", placeholder: "Optional if TDD entered" },
                    { type: "html", html: '<span style="color:#2563eb; font-weight:600; font-size:14px;">Or calculate Insulin sensitivity factor (ISF), enter the following:</span>' },
                    { id: "tdd", label: "Total Daily Dose (Units)", type: "number", placeholder: "Optional if ISF entered" },
                    { id: "type", label: "Insulin Type", type: "select", options: [
                        {val: "", txt: ""},
                        {val: 1800, txt: "Rapid-acting insulin (i.e., Humalog or Novolog)"}, 
                        {val: 1500, txt: "Short-acting (i.e., Humulin R or Novolin R)"}
                    ]}
                ],
                logic: (v) => {
                    // Mandatory fields
                    if(!v.curr || !v.target) return null;
                    
                    let isf = v.isf;
                    
                    // Step 1: Determine ISF
                    // Condition A is handled by reading v.isf directly above.
                    // Condition B: If manual ISF is blank/zero, calculate from TDD
                    if ((!isf || isf <= 0) && v.tdd && v.type) {
                        isf = v.type / v.tdd;
                    }
                    
                    // Check if we have a valid ISF to proceed
                    if (!isf || isf <= 0) return null;

                    // Step 2: Calculate Correction Dose
                    const res = (v.curr - v.target) / isf;
                    return { val: res.toFixed(1), unit: "Units" };
                }
            }
        }
    },
    pediatric: {
        "Macronutrient and Fluid Requirement (General use)": {
            rda: {
                name: "RDA (Calorie/Protein)",
                ref: null,
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "ageGroup", label: "Age Group", type: "select", options: [
                        {val: "0-6m", txt: "0-6 Months"},
                        {val: "7-12m", txt: "7-12 Months"},
                        {val: "1-3y", txt: "1-3 Years"},
                        {val: "4-6y", txt: "4-6 Years"},
                        {val: "7-10y", txt: "7-10 Years"},
                        {val: "11-14y", txt: "11-14 Years"},
                        {val: "15-18y", txt: "15-18 Years"}
                    ]},
                    { id: "w", label: "Weight (kg)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.ageGroup) return null;
                    let calF = 0, proF = 0;
                    const g = v.g; 
                    
                    switch(v.ageGroup) {
                        case "0-6m": calF = 108; proF = 2.2; break;
                        case "7-12m": calF = 98; proF = 1.6; break;
                        case "1-3y": calF = 102; proF = 1.2; break;
                        case "4-6y": calF = 90; proF = 1.1; break;
                        case "7-10y": calF = 70; proF = 1.0; break;
                        case "11-14y":
                            calF = (g === "Male" ? 55 : 47); proF = 1.0; break;
                        case "15-18y":
                            calF = (g === "Male" ? 45 : 40); proF = (g === "Male" ? 0.9 : 0.8); break;
                    }

                    const kcal = Math.round(v.w * calF);
                    const prot = (v.w * proF).toFixed(1);
                    return { val: `Calories: ${kcal} kcal\nProtein: ${prot} g`, unit: "/day" };
                }
            },
            schofield: {
                name: "Schofield (BMR)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 47). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "ageGroup", label: "Age Group", type: "select", options: [
                        {val: "0-3y", txt: "0-3 Years"},
                        {val: "3-10y", txt: "3-10 Years"},
                        {val: "10-18y", txt: "10-18 Years"}
                    ]},
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h", label: "Height (cm)", type: "number" },
                    { id: "af", label: "Activity Factor", type: "select", options: [
                        {val: "", txt: ""},
                        {val: 1.0, txt: "Paralyzed (1.0)"},
                        {val: 1.1, txt: "Confined to Bed (1.1)"},
                        {val: 1.2, txt: "Ambulatory (1.2)"},
                        {val: 1.3, txt: "Active (1.3)"}
                    ]},
                    { id: "sf", label: "Stress Factor", type: "select", options: [
                        {val: "", txt: ""},
                        {val: 1.5, txt: "Burn (1.5)"},
                        {val: 2.5, txt: "Burn (2.5)"},
                        {val: 1.5, txt: "Growth Failure (1.5)"},
                        {val: 2.0, txt: "Growth Failure (2.0)"},
                        {val: 1.2, txt: "Infection (1.2)"},
                        {val: 1.6, txt: "Infection (1.6)"},
                        {val: 0.7, txt: "Starvation (0.7)"},
                        {val: 1.2, txt: "Surgery (1.2)"},
                        {val: 1.5, txt: "Surgery (1.5)"},
                        {val: 1.1, txt: "Trauma (1.1)"},
                        {val: 1.8, txt: "Trauma (1.8)"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.w || !v.h) return null;
                    let base = 0;
                    const w = v.w; const h = v.h;
                    
                    if(v.ageGroup === "0-3y") {
                        if(v.g === "Male") base = (0.167*w) + (15.174*h) - 617.6;
                        else base = (16.252*w) + (10.23*h) - 413.5;
                    } else if(v.ageGroup === "3-10y") {
                        if(v.g === "Male") base = (19.59*w) + (1.303*h) + 414.9;
                        else base = (16.969*w) + (1.618*h) + 371.2;
                    } else {
                        if(v.g === "Male") base = (16.25*w) + (1.372*h) + 515.5;
                        else base = (8.365*w) + (4.65*h) + 200;
                    }

                    // Use defaults if empty
                    const af = v.af ? parseFloat(v.af) : 1.0;
                    const sf = v.sf ? parseFloat(v.sf) : 1.0;

                    return { val: Math.round(base * af * sf), unit: "kcal/day" };
                }
            },
            pedMacro: {
                name: "Macronutrient Distribution (Pediatric)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 47). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "ageGroup", label: "Age Group", type: "select", options: [{val: "0-3y", txt: "0-3 Years"}, {val: "3-10y", txt: "3-10 Years"}, {val: "10-18y", txt: "10-18 Years"}] },
                    { id: "w", label: "Weight (kg)", type: "number" },
                    { id: "h", label: "Height (cm)", type: "number" },
                    { id: "cp", label: "Carb %", type: "number" },
                    { id: "pp", label: "Protein %", type: "number" },
                    { id: "fp", label: "Fat %", type: "number" }
                ],
                logic: (v) => {
                    if(!v.w || !v.h) return null;
                    // Calculate Base Schofield First
                    let base = 0;
                    const w = v.w; const h = v.h;
                    if(v.ageGroup === "0-3y") {
                        if(v.g === "Male") base = (0.167*w) + (15.174*h) - 617.6;
                        else base = (16.252*w) + (10.23*h) - 413.5;
                    } else if(v.ageGroup === "3-10y") {
                        if(v.g === "Male") base = (19.59*w) + (1.303*h) + 414.9;
                        else base = (16.969*w) + (1.618*h) + 371.2;
                    } else {
                        if(v.g === "Male") base = (16.25*w) + (1.372*h) + 515.5;
                        else base = (8.365*w) + (4.65*h) + 200;
                    }
                    
                    const c = Math.round((base * (v.cp/100)) / 4);
                    const p = Math.round((base * (v.pp/100)) / 4);
                    const f = Math.round((base * (v.fp/100)) / 9);
                    return { val: `Carbs: ${c} g\nProtein: ${p} g\nFat: ${f} g`, unit: "/day (Based on Schofield)" };
                }
            },
            pedFluid: {
                name: "Baseline Fluid Requirement (Pediatric)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p. 65). Academy of Nutrition and Dietetics.",
                inputs: [ { id: "w", label: "Weight (kg)", type: "number" } ],
                logic: (v) => {
                    if(!v.w) return null;
                    let f = 0;
                    if(v.w <= 10) f = 100 * v.w;
                    else if(v.w <= 20) f = 1000 + (50 * (v.w - 10));
                    else f = 1500 + (20 * (v.w - 20));
                    return { val: Math.round(f), unit: "mL/day" };
                }
            }
        },
        "Calorie Requirement for Special Cases (5-12 years)": {
            downSyn: {
                name: "Down Syndrome (5-12 years)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p.69). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "g", label: "Gender", type: "select", options: ["Male", "Female"] },
                    { id: "h", label: "Height (cm)", type: "number" }
                ],
                logic: (v) => {
                    if(!v.h) return null;
                    const factor = v.g === "Male" ? 16.1 : 14.3;
                    return { val: Math.round(v.h * factor), unit: "kcal/day" };
                }
            },
            cerebralPalsy: {
                name: "Cerebral Palsy (5-12 years)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p.70). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "h", label: "Height (cm)", type: "number" },
                    { id: "act", label: "Condition", type: "select", options: [
                        {val: 13.9, txt: "Mild to Moderate"},
                        {val: 11.1, txt: "Severe Physical Restriction"},
                        {val: 10, txt: "Severe Restricted Activity"},
                        {val: "athetoid", txt: "Athetoid CP"}
                    ]}
                ],
                logic: (v) => {
                    if(v.act === "athetoid") return { val: "Up to 6000", unit: "kcal/day" };
                    if(!v.h) return null;
                    return { val: Math.round(v.h * parseFloat(v.act)), unit: "kcal/day" };
                }
            },
            praderWilli: {
                name: "Prader-Willi Syndrome (5-12 years)",
                ref: "Mueller, C. M. (Ed.). (2024). The essential pocket guide for clinical nutrition (4th ed., p.70). Academy of Nutrition and Dietetics.",
                inputs: [
                    { id: "h", label: "Height (cm)", type: "number" },
                    { id: "goal", label: "Goal", type: "select", options: [
                        {val: 10.5, txt: "Weight Maintenance"},
                        {val: 8.5, txt: "Weight Loss"}
                    ]}
                ],
                logic: (v) => {
                    if(!v.h) return null;
                    return { val: Math.round(v.h * parseFloat(v.goal)), unit: "kcal/day" };
                }
            }
        }
    }
};

// --- 2. UI LOGIC ---

const customDropdown = document.getElementById('customDropdown');
const dropdownMenu = document.getElementById('dropdownMenu');
const triggerText = document.getElementById('triggerText');
const inputContainer = document.getElementById('inputContainer');
const resultCard = document.getElementById('resultCard');
const resultTitle = document.getElementById('resultTitle');
const bmiResultUI = document.getElementById('bmiResultUI');
const textResultUI = document.getElementById('textResultUI');
const refUI = document.getElementById('refUI');

let currentSelection = { group: null, section: null, key: null };

function init() {
    populateDropdown();
    document.addEventListener('click', (e) => {
        if (!customDropdown.contains(e.target)) {
            customDropdown.classList.remove('active');
        }
    });
    
    // Search Functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'dd-search-input';
    searchInput.placeholder = 'Search equations...';
    searchInput.onclick = (e) => e.stopPropagation(); 
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'dd-search-container';
    searchContainer.appendChild(searchInput);
    
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = dropdownMenu.querySelectorAll('.dd-item');
        const groups = dropdownMenu.querySelectorAll('.group-block');
        
        groups.forEach(group => {
            let hasVisibleInSection = false;
            const sections = group.querySelectorAll('.section-block');
            
            sections.forEach(section => {
                let hasVisibleItem = false;
                const sectionItems = section.querySelectorAll('.dd-item');
                
                sectionItems.forEach(item => {
                    const text = item.innerText.toLowerCase();
                    if (text.includes(term)) {
                        item.style.display = 'block';
                        hasVisibleItem = true;
                        hasVisibleInSection = true;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                if (hasVisibleItem) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
            
            if (hasVisibleInSection) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });
    });

    dropdownMenu.innerHTML = ''; 
    dropdownMenu.appendChild(searchContainer);
    
    const listContainer = document.createElement('div');
    listContainer.className = 'dd-list-container';
    listContainer.id = 'dropdownList';
    dropdownMenu.appendChild(listContainer);
    
    populateList(listContainer);
}

function toggleDropdown() {
    customDropdown.classList.toggle('active');
    if (customDropdown.classList.contains('active')) {
        setTimeout(() => {
            const input = customDropdown.querySelector('input');
            if(input) input.focus();
        }, 100);
    }
}

function populateDropdown() {
    // Logic handled in init()
}

function populateList(container) {
    container.innerHTML = "";

    const buildGroup = (groupName, dataObj, groupId) => {
        if (!dataObj) {
            console.warn(`Data for group ${groupName} is missing or undefined.`);
            return;
        }

        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-block';
        
        const header = document.createElement('div');
        header.className = "dd-main-header";
        header.innerText = groupName;
        groupDiv.appendChild(header);

        for (const [section, calcs] of Object.entries(dataObj)) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-block';
            
            const sub = document.createElement('div');
            sub.className = "dd-sub-header";
            sub.innerText = section;
            sectionDiv.appendChild(sub);

            for (const [key, data] of Object.entries(calcs)) {
                const item = document.createElement('div');
                item.className = "dd-item";
                item.innerText = data.name;
                item.onclick = () => selectItem(groupId, section, key, data.name);
                sectionDiv.appendChild(item);
            }
            groupDiv.appendChild(sectionDiv);
        }
        container.appendChild(groupDiv);
    };

    buildGroup("Adult", CALC_DATA.adult, "adult");
    buildGroup("Pediatric", CALC_DATA.pediatric, "pediatric");
}

function selectItem(group, section, key, name) {
    currentSelection = { group, section, key };
    triggerText.innerText = name;
    triggerText.style.color = "#0f172a";
    triggerText.style.fontWeight = "600";
    customDropdown.classList.remove('active');
    
    const searchInput = customDropdown.querySelector('input');
    if(searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
    
    // --- تتبع البيانات (Metrics Tracking) - Fires once upon selection ---
    metrics(name);
    
    renderCalculatorUI();
}

function renderCalculatorUI() {
    const { group, section, key } = currentSelection;
    if(!group) return;

    const calc = CALC_DATA[group][section][key];
    inputContainer.innerHTML = "";

    const renderInputs = () => {
        inputContainer.innerHTML = "";
        calc.inputs.forEach(inp => {
            // Check Dependency
            if(inp.dependent) {
                const [depId, depVal] = inp.dependent.split('=');
                const parentEl = document.getElementById(`inp_${depId}`);
                if(!parentEl || parentEl.value !== depVal) return;
            }

            // Handle HTML Separators
            if (inp.type === 'html') {
                const div = document.createElement('div');
                div.style.gridColumn = "1 / -1"; 
                div.style.marginBottom = "8px";
                div.style.marginTop = "8px";
                div.innerHTML = inp.html;
                inputContainer.appendChild(div);
                return; 
            }

            const row = document.createElement('div');
            row.className = 'form-row';

            const label = document.createElement('label');
            label.innerText = inp.label;

            // Handle Image Button (New Feature)
            if (inp.type === 'image_button') {
                const btn = document.createElement('button');
                btn.className = 'info-btn';
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    ${inp.btnText}
                `;
                btn.onclick = () => openModal(inp.src);
                
                row.appendChild(label);
                row.appendChild(btn);
                inputContainer.appendChild(row);
                return; // Done with this input
            }

            // Handle Multi-Select vs Standard Inputs
            if (inp.multiple) {
                // Create hidden input to store actual value
                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.id = `inp_${inp.id}`;
                hiddenInput.value = "0"; // Default
                
                // Create UI Wrapper
                const msWrapper = document.createElement('div');
                msWrapper.className = 'ms-container';
                msWrapper.id = `ms-container-${inp.id}`;
                
                // Trigger
                const trigger = document.createElement('div');
                trigger.className = 'ms-trigger';
                trigger.id = `ms-trigger-${inp.id}`;
                trigger.innerHTML = `<span>Select Amputation(s)...</span><span style="font-size:10px; color:#94a3b8;">▼</span>`;
                trigger.onclick = (e) => {
                    e.stopPropagation();
                    msWrapper.classList.toggle('active');
                };
                
                // Options Container
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'ms-options';
                
                inp.options.forEach(opt => {
                    const optDiv = document.createElement('div');
                    optDiv.className = 'ms-option';
                    optDiv.setAttribute('data-value', opt.val); // Store value on div
                    
                    // Checkmark Icon (SVG or char)
                    const checkIcon = document.createElement('span');
                    checkIcon.className = 'ms-check-icon';
                    checkIcon.innerHTML = '✓';

                    const textSpan = document.createElement('span');
                    textSpan.innerText = opt.txt;

                    optDiv.appendChild(textSpan);
                    optDiv.appendChild(checkIcon);

                    optDiv.onclick = (e) => {
                        e.stopPropagation();
                        optDiv.classList.toggle('selected');
                        updateMultiSelect(inp.id);
                    };
                    
                    optionsDiv.appendChild(optDiv);
                });
                
                msWrapper.appendChild(trigger);
                msWrapper.appendChild(optionsDiv);
                row.appendChild(hiddenInput); // Append hidden input for calculation
                row.appendChild(label);
                row.appendChild(msWrapper); // Replace standard input slot
                
                // Close multi-select on outside click
                document.addEventListener('click', (e) => {
                    if(!msWrapper.contains(e.target)) msWrapper.classList.remove('active');
                });

            } else {
                // Standard Input Logic
                let inputEl;
                if (inp.type === 'select') {
                    inputEl = document.createElement('select');
                    inp.options.forEach(opt => {
                        const optionEl = document.createElement('option');
                        if (typeof opt === 'object') {
                            optionEl.value = opt.val;
                            optionEl.innerText = opt.txt;
                        } else {
                            optionEl.value = opt;
                            optionEl.innerText = opt;
                        }
                        inputEl.appendChild(optionEl);
                    });
                } else {
                    inputEl = document.createElement('input');
                    inputEl.type = inp.type || 'text';
                    if(inp.placeholder) inputEl.placeholder = inp.placeholder;
                    if(inp.step) inputEl.step = inp.step;
                }

                inputEl.id = `inp_${inp.id}`;
                if(calc.inputs.some(i => i.dependent && i.dependent.startsWith(inp.id))) {
                    inputEl.onchange = () => { renderInputs(); calculate(); };
                } else {
                    inputEl.oninput = calculate; 
                    inputEl.onchange = calculate;
                }
                
                row.appendChild(label);
                row.appendChild(inputEl);
            }

            inputContainer.appendChild(row);
        });
        calculate();
    };

    renderInputs();
    resultCard.classList.add('hidden');
    resultCard.classList.remove('visible');
}

// Handler for Multi-Select Logic
function updateMultiSelect(id) {
    const container = document.getElementById(`ms-container-${id}`);
    const selectedOptions = container.querySelectorAll('.ms-option.selected');
    let sum = 0;
    let count = 0;
    
    selectedOptions.forEach(opt => {
        sum += parseFloat(opt.getAttribute('data-value'));
        count++;
    });
    
    // Update hidden input
    document.getElementById(`inp_${id}`).value = sum;
    
    // Update trigger text
    const trigger = document.getElementById(`ms-trigger-${id}`);
    // Keep the chevron
    const chevron = `<span style="font-size:10px; color:#94a3b8;">▼</span>`;
    
    if (count > 0) {
        trigger.innerHTML = `<span>${count} selected (${sum.toFixed(1)}%)</span>${chevron}`;
        trigger.style.color = "#0f172a";
        trigger.style.fontWeight = "500";
        trigger.style.borderColor = "#10b981"; // Highlight border when active
        trigger.style.backgroundColor = "#ecfdf5";
    } else {
        trigger.innerHTML = `<span>Select Amputation(s)...</span>${chevron}`;
        trigger.style.color = "#64748b";
        trigger.style.fontWeight = "400";
        trigger.style.borderColor = "#e2e8f0";
        trigger.style.backgroundColor = "#fff";
    }
    
    // Trigger Calc
    calculate();
}

function calculate() {
    const { group, section, key } = currentSelection;
    if(!group) return;
    
    const calc = CALC_DATA[group][section][key];
    const values = {};
    
    const inputs = inputContainer.querySelectorAll('input:not([type="checkbox"]), select'); // Exclude raw checkboxes, include hidden inputs
    inputs.forEach(el => {
        const id = el.id.replace('inp_', '');
        values[id] = el.type === 'number' ? parseFloat(el.value) : el.value;
    });

    const result = calc.logic(values);

    if (!result) {
        resultCard.classList.add('hidden');
        resultCard.classList.remove('visible');
        refUI.classList.add('hidden'); 
    } else {
        resultCard.classList.remove('hidden');
        setTimeout(() => resultCard.classList.add('visible'), 10);
        
        if (calc.ref) {
            refUI.innerText = "Reference: " + calc.ref;
            refUI.classList.remove('hidden');
        } else {
            refUI.classList.add('hidden');
        }
    }

    if (key === 'bmi') {
        showBMI(result);
    } else {
        showTextResult(result);
    }
}

function metrics(equationName) {
    console.log(" Metrics Tracked:");
    console.log("Equation Name:", equationName);
    
}

function showTextResult(result) {
    textResultUI.classList.remove('hidden');
    bmiResultUI.classList.add('hidden'); 
    textResultUI.innerHTML = ''; 

    if (!result) return;

    const valStr = String(result.val);
    
    if (valStr.includes('\n')) {
        textResultUI.className = 'multi-mode';
        const lines = valStr.split('\n');
        lines.forEach(line => {
            const parts = line.split(':');
            let html = '';
            if (parts.length > 1) {
                html = `
                <div class="result-row">
                    <span class="result-label-text">${parts[0]}:</span>
                    <span class="result-data-text">${parts[1]}</span>
                </div>`;
            } else {
                html = `<div class="result-row"><span class="result-data-text">${line}</span></div>`;
            }
            textResultUI.innerHTML += html;
        });
        
    } else {
        textResultUI.className = 'single-mode';
        const valDiv = document.createElement('div');
        valDiv.className = 'text-result-value';
        valDiv.innerText = result.val;
        
        const unitDiv = document.createElement('div');
        unitDiv.className = 'text-result-unit';
        unitDiv.innerText = result.unit;

        textResultUI.appendChild(valDiv);
        textResultUI.appendChild(unitDiv);
    }
}

function showBMI(result) {
    bmiResultUI.classList.remove('hidden');
    textResultUI.classList.add('hidden');

    const valEl = document.getElementById('bmiVal');
    const statusEl = document.getElementById('bmiText');

    if (!result) return;

    const bmi = result.raw;
    valEl.innerText = result.val;

    let status = "";
    let color = "";
    let borderColor = "";
    
    if (bmi < 18.5) {
        status = "Underweight"; color = "#854d0e"; borderColor = "#fef08a"; 
    } else if (bmi < 25) {
        status = "Healthy weight"; color = "#166534"; borderColor = "#bbf7d0"; 
    } else if (bmi < 30) {
        status = "Overweight"; color = "#9a3412"; borderColor = "#fed7aa"; 
    } else if (bmi < 35) {
        status = "Obese class I"; color = "#991b1b"; borderColor = "#fecaca"; 
    } else if (bmi < 40) {
        status = "Obese class II"; color = "#7f1d1d"; borderColor = "#fca5a5"; 
    } else {
        status = "Obese class III"; color = "#581c87"; borderColor = "#e9d5ff"; 
    }

    statusEl.innerText = status;
    statusEl.style.color = color;
    statusEl.style.backgroundColor = borderColor;
}

// --- Modal Logic ---
function openModal(src, title) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('modalImg');
    const titleEl = document.getElementById('modalTitle');
    
    img.src = src;
    titleEl.innerText = title || "Reference"; // Set title dynamically
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
}

window.onload = init;