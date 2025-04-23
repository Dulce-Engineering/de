import Utils from "../lib/Utils.mjs";
import fs from 'node:fs';

main();

function main()
{
  //Import();
}

function Import()
{
  const trend_path = "db-firebase/job-woper-default-rtdb-trend-export.json";
  const trend_objs = Read_File(trend_path);
  const trends = To_Array(trend_objs);

  const query_path = "db-firebase/job-woper-default-rtdb-query-export.json";
  const query_objs = Read_File(query_path);
  const queries = To_Array(query_objs, For_Each_Query);
  function For_Each_Query(query)
  {
    query.src = "indeed";

    const query_trends = trends.filter(t => t.query_id == query.id);
    const trend_path = "db/trend/query" + query.id + ".json";
    Write_File(trend_path, query_trends);
  }

  Write_File("db/query.json", queries);
}

function To_Array(obj, on_each_fn)
{
  const array = [];
  for (const id in obj)
  {
    const item = obj[id];
    if (on_each_fn)
    {
      on_each_fn(item);
    }
    array.push(item);
  }

  return array;
}

function Read_File(path)
{
  const json_str = fs.readFileSync(path, 'utf8');
  const obj = JSON.parse(json_str);

  return obj;
}

function Write_File(path, obj)
{
  const json_str = JSON.stringify(obj, null, 2);
  fs.writeFileSync(path, json_str, 'utf8');
}

async function xmain()
{
  const base_url = "https://www.seek.com.au";
  const search_str = "react";
  const classification = "information-communication-technology";
  const where = "All-Sydney-NSW";
  const work_type = "contract-temp";
  const class_des = "Information%20%26%20Communication%20Technology";
  
  // do job search and get resulting page
  const url = 
    base_url + "/" +
    search_str + "-jobs-in-" +
    classification;
  const res_http = await fetch(url);
  const res_text = await res_http.text();

  // find relevant html element
  const elem_start_index = res_text.indexOf("totalJobsCount");
  const elem_end_index = res_text.indexOf(">", elem_start_index);

  // extract job count
  const value_start_index = elem_end_index + 1;
  const value_end_index = res_text.indexOf("<", value_start_index);
  
  const count_str = res_text.substring(value_start_index, value_end_index);
  const count = Utils.To_Int(count_str);

  console.log(count);
}

async function Show_Job_Count()
{
  const base_url = "https://www.seek.com.au";
  const search_str = "react";
  const classification = "information-communication-technology";
  
  // do job search and get resulting page
  const url = 
    base_url + "/" +
    search_str + "-jobs-in-" +
    classification;
  const res_http = await fetch(url);
  const res_text = await res_http.text();

  // find relevant html element
  const elem_start_index = res_text.indexOf("totalJobsCount");
  const elem_end_index = res_text.indexOf(">", elem_start_index);

  // extract job count
  const value_start_index = elem_end_index + 1;
  const value_end_index = res_text.indexOf("<", value_start_index);
  const count_str = res_text.substring(value_start_index, value_end_index);

  console.log("Number of React jobs on Seek: ", count_str);
}
