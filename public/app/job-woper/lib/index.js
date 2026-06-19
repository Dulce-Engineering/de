export class Query
{
  static async Select_All()
  {
    const res_http = await fetch("/app/job-woper/db/query.json");
    const queries = await res_http.json();
    // sort by order

    return queries;
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
