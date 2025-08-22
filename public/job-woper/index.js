import Utils from "../lib/Utils.mjs";
import fs from 'node:fs';
import crypto from 'node:crypto';
import pw from "playwright";

main();

async function main()
{
  console.log("Import started...");
  const queries = Select_All("query");
  const seek_queries = queries.filter
    (q => q.src == "seek" && Query_Needs_Update(q, Utils.MILLIS_DAY));
  const browser = await pw.chromium.launch({ headless: false }); 
  const page = await browser.newPage();

  for (let i = 0; i < seek_queries.length; ++i)
  {
    if (seek_queries.length > 1 && i > 0)
    {
      await Wait(Utils.MILLIS_MINUTE);
    }

    const query = seek_queries[i];
    const count = await Query_Get_Trend_Count2(query, page);
    if (count>0)
    {
      Trend_Insert_Count(query, count);
    }

    console.log(query.title, count, "...");
  }

  await browser.close();
  console.log("Completed.");
}

// uses playwright
async function Query_Get_Trend_Count2(query, page)
{
  let count = 0;
  const base_url = "https://www.seek.com.au";
  const search_str = query.terms.replace(" ", "-");
  const classification = "information-communication-technology";
  const url = 
    base_url + "/" +
    search_str + "-jobs-in-" +
    classification;

  try 
  {
    await page.goto(url); 

    const count_elem = await Find_Job_Count_Elem(page);
    if (count_elem) 
    {
      const count_str = await count_elem.textContent();
      count = Utils.To_Int(count_str);
    } 
    else 
    {
      console.log('element not found.');
    }
  } 
  catch (error) 
  {
    console.error(error);
  } 

  return count;
}

async function Find_Job_Count_Elem(page)
{
  let count_elem = page.locator('[data-automation="totalJobsCount"]');
  if (await count_elem.count() == 0) 
    count_elem = page.locator("[data-automation='totalJobsCountBcues']");
  if (await count_elem.count() == 0) 
    count_elem = page.locator("[data-automation='totalJobsMessage']:first-child");
  if (await count_elem.count() == 0) 
    count_elem = null;
  
  return count_elem;
}

function Wait(milliseconds) 
{
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function Query_Needs_Update(query, millis)
{
  let res = true;
  const trends = Select_All("trend/query" + query.id);
  if (trends.length > 0)
  {
    trends.sort((a, b) => b.datetime - a.datetime);
    const last_datetime = trends[0].datetime;
    const millis_since = Date.now() - last_datetime;
    res = millis_since > millis;
  }

  return res;
}

function Trend_Insert_Count(query, count)
{
  const trend =
  {
    count,
    datetime: Date.now(),
    id: crypto.randomUUID(),
    query_id: query.id
  }

  const table = "trend/query" + query.id;
  Insert(table, trend);
}

function Insert(table, item)
{
  const items = Select_All(table);
  items.push(item);
  Save_All(table, items);
}

function Save_All(table, data)
{
  const path = "db/" + table + ".json";
  Write_File(path, data);
}

function Select_All(table)
{
  const path = "db/" + table + ".json";
  let res = [];

  try {res = Read_File(path); }
  catch (e) 
  {
    ///res = [];
    if (!(e.code == "ENOENT" && e.errno == -4058 && e.syscall == "open"))
    {
      console.error(e);
    }
  }

  return res;
}

// uses fetch
async function Query_Get_Trend_Count(query)
{
  let count = 0;
  let err_msg = null;
  let res_text = null;

  const base_url = "https://www.seek.com.au";
  const search_str = query.terms.replace(" ", "-");
  const classification = "information-communication-technology";
  //const where = "All-Sydney-NSW";
  //const work_type = "contract-temp";
  //const class_des = "Information%20%26%20Communication%20Technology";
  
  // do job search and get resulting page
  const url = 
    base_url + "/" +
    search_str + "-jobs-in-" +
    classification;
  const res_http = await fetch(url);
  res_text = await res_http.text();
  if (res_http.ok)
  {
    // find relevant html element
    const elem_start_index = res_text.indexOf("totalJobsCount");
    if (elem_start_index >= 0)
    {
      const elem_end_index = res_text.indexOf(">", elem_start_index);

      // extract job count
      const value_start_index = elem_end_index + 1;
      const value_end_index = res_text.indexOf("<", value_start_index);
      
      const count_str = res_text.substring(value_start_index, value_end_index);
      count = Utils.To_Int(count_str);
    }
    else
    {
      err_msg = "key not found: totalJobsCount";
    }
  }
  else
  {
    err_msg = "fetch failed";
  }

  if (err_msg)
  {
    console.error("msg:", err_msg);
    console.error(`for query: ${query.title} (ID: ${query.id})`);
    console.error("URL fetched:", url);
    if (res_text)
    {
      const timestamp = Date.now();
      const filename = `log/query_${query.id}_${timestamp}.html`;
      fs.writeFileSync(filename, res_text, 'utf8');
    }
  }

  return count;
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
