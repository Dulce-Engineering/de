import Utils from "../../lib/Utils.js";

class TableHistory extends HTMLElement
{
  static tname = "table-history";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Render()
  {
  }
}

Utils.Register_Element(TableHistory);
export default TableHistory;