export class Query
{
  static async Select_All()
  {
    const res_http = await fetch("/app/job-woper/db/query.json");
    const queries = await res_http.json();
    // sort by order

    return queries;
  }

  /**
   * Checks that all items in query.json have unique IDs.
   * @returns {Promise<boolean>} True if all IDs are unique, false otherwise.
   */
  static async Has_Unique_Ids()
  {
    let res = false;
    const queries = await Query.Select_All();
    if (queries)
    {
      const id_set = new Set(queries.map(q => q.id));
      res = id_set.size === queries.length;
    }

    return res;
  }

  /**
   * Builds an indented markdown bullet-point list representing the query hierarchy.
   * @param {string} [src="seek"] - The search term source to filter by (e.g. "seek"). If null, includes all.
   * @returns {Promise<string>} Markdown bullet points as a single string.
   */
  static async Build_MD_Tree(src = "seek")
  {
    const queries = await Query.Select_All();
    const filtered_queries = src
      ? queries.filter(q => q.src === src || (!q.src && !q.parent_id))
      : queries;

    const lines = [];

    function Append_Children(parent_id, depth)
    {
      const indent_str = "\t".repeat(depth);
      const child_items = filtered_queries.filter(q =>
        parent_id === null ? (!q.parent_id) : (q.parent_id === parent_id)
      );

      for (const item of child_items)
      {
        lines.push(`${indent_str}- ${item.title} (${item.id})`);
        Append_Children(item.id, depth + 1);
      }
    }

    Append_Children(null, 0);

    return lines.join("\n");
  }
}

export class Trend
{
  static async Select_By_Query_Id(query_id)
  {
    const res_http = await fetch(`/app/job-woper/db/trend/query${query_id}.json`);
    const trends = await res_http.json();
    // sort by datetime

    return trends;
  }
}
