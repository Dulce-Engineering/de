
import Utils from "../../lib/Utils.js";

class DeTable extends HTMLElement
{
  static tname = "de-table";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.render();
  }

  set isLoading(value)
  {
    if (value)
    {
      this.loadingRow.hidden = false;
      this.noDataRow.hidden = true;
      this.tableBody.hidden = true;
    }
  }

  set hasData(value)
  {
    if (this.isConnected)
    {
      if (value)
      {
        this.loadingRow.hidden = true;
        this.noDataRow.hidden = true;
        this.tableBody.hidden = false;
      }
      else
      {
        this.loadingRow.hidden = true;
        this.noDataRow.hidden = false;
        this.tableBody.hidden = true;
      }
    }
  }

  set cellRender(value)
  {
    this.onCellRender = value;
  }

  set items(objs)
  {
    if (objs?.length > 0)
    {
      this.tableBody.replaceChildren();
      for (const obj of objs)
      {
        const rowElement = document.createElement("tr");
        this.tableBody.append(rowElement);

        const colElements = this.colsRow.children;
        for (const colElement of colElements)
        {
          const colName = colElement.getAttribute("name");
          const cellClass = colElement.getAttribute("cell-class");

          const cellElement = document.createElement("td");
          if (cellClass)
          {
            cellElement.classList.add(cellClass);
          }
          rowElement.append(cellElement);

          const options = {detail: {obj, cellElement, colName}};
          if (this.onCellRender)
          {
            this.onCellRender(options);
          }
          else
          {
            this.dispatchEvent(new CustomEvent("rendercell", options));
          }
        }
      }
      this.hasData = true;
    }
    else
    {
      this.hasData = false;
    }
  }

  get colCount()
  {
    return this.colsRow.children.length;
  }

  render()
  {
    const colElements = this.querySelectorAll("hw-col");

    const html = `
      <table>

        <thead>
          <tr>
            <th cid="headerCell">
              <slot name="header"></slot>
            </th>
          </tr>
          <tr cid="colsRow">
          </tr>
        </thead>

        <tr cid="noDataRow">
          <td cid="noDataCell">
            <div>
              <img src="img/alarm-high.svg" alt="No Data">
              <span>No Data.</span>
            </div>
          </td>
        </tr>

        <tr cid="loadingRow" hidden>
          <td cid="loadingCell">
            <div>
              <img src="img/alarm-medium.svg" alt="Loading">
              <span>Loading...</span>
            </div>
          </td>
        </tr>

        <tbody cid="tableBody" hidden>
        </tbody>

      </table>
    `;
    const html_elements = Utils.toDocument(html, this);
    this.replaceChildren(html_elements);
    Utils.setIdShortcuts(this, this, "cid");
    
    for (const colElement of colElements)
    {
      const colCell = document.createElement("th");
      colCell.setAttribute("name", colElement.getAttribute("name"));
      if (colElement.hasAttribute("cell-class"))
      {
        colCell.setAttribute("cell-class", colElement.getAttribute("cell-class"));
      }
      colCell.innerText = colElement.innerText;
      this.colsRow.append(colCell);
    }

    this.headerCell.colSpan = this.colCount;
    this.noDataCell.colSpan = this.colCount;
    this.loadingCell.colSpan = this.colCount;
  }
}

Utils.registerElement(DeTable);
export default DeTable;
