import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

class DeSelectDrink extends HTMLElement
{
  static tname = "de-select-drink";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.rendered = false;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(v)
  {
    if (this.rendered)
    {

    }
    else
    {
      this.pending_value = v;
    }
  }

  get value()
  {
  }
  
  // attributes ===============================================================

  static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }

  // methods ==================================================================

  // events ===================================================================

  On_Click_Btn()
  {
  }

  // rendering ================================================================

  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.some_elem.addEventListener("click", this.On_Click_Btn);

    this.rendered = true;
    if (this.pending_value) 
    {
      this.value = this.pending_value;
    }
  }
}

Utils.Register_Element(DeSelectDrink);
export default DeSelectDrink;

const drink_types =
[
  { id: 1, name: "Beer", icon: "🍺", alc_vol: 4.8, parent_id: null },
  { id: 2, name: "Wine", icon: "🍷", alc_vol: 13, parent_id: null },
  { id: 3, name: "Spirits", icon: "🥃", alc_vol: 40, parent_id: null },
  { id: 4, name: "Cocktail & Shooters", icon: "🍸", alc_vol: 30, parent_id: null },
  { id: 5, name: "Premix & Cider", icon: "🍹", alc_vol: 5, parent_id: null },

  { id: 6, name: "Strong", icon: "🍺", alc_vol: 4.8, parent_id: 1 },
  { id: 7, name: "Standard", icon: "🍺", alc_vol: 4.8, parent_id: 1 },
  { id: 8, name: "Mid", icon: "🍺", alc_vol: 4.8, parent_id: 1 },
  { id: 9, name: "Light", icon: "🍺", alc_vol: 4.8, parent_id: 1 },
  { id: 10, name: "Alcohol-Free", icon: "🍺", alc_vol: 4.8, parent_id: 1 },

  { id: 11, name: "Wine", icon: "🍷", alc_vol: 13, parent_id: 2 },
  { id: 12, name: "Sparkling", icon: "🍾", alc_vol: 13, parent_id: 2 },
  { id: 13, name: "Fortified", icon: "🍷", alc_vol: 13, parent_id: 2 },
  { id: 14, name: "Dessert", icon: "🥂", alc_vol: 13, parent_id: 2 },

  lagers
];

/* 🍹🍾 🍶 🥂 🍻
├── BEER
│   ├── Ale (IPA, Stout, Porter, Pale Ale, Wheat Beer)
│   ├── Lager (Pilsner, Helles, Bock, Dark Lager)
│   └── Specialty (Sour, Fruit Beer, Cider/Mead Blend)
│
├── WINE
│   ├── Still Wine (Red, White, Rosé, Orange)
│   ├── Sparkling Wine (Champagne, Prosecco, Cava)
│   └── Fortified/Dessert (Port, Sherry, Vermouth)
│
├── SPIRITS
│   ├── Clear Spirits (Vodka, Gin, Tequila Blanco, White Rum)
│   ├── Aged Spirits (Whiskey/Bourbon, Dark Rum, Añejo, Brandy)
│   └── Liqueurs & Digestifs (Amaro, Schnapps, Cream Liqueurs)
│
├── COCKTAILS & Shooters
│   ├── Highballs & Simple Mixers (Gin & Tonic, Rum & Coke)
│   ├── Short / Shaken / Stirred (Margarita, Old Fashioned, Martini)
│   ├── Long / Tropical (Mojito, Piña Colada, Long Island)
│   └── Shooters (B-52, Lemon Drop)
│
├── Other
│   ├── Hard Cider (Dry, Sweet, Flavored)
│   ├── Hard Seltzer
│   └── Premixed Canned Cocktails

*/