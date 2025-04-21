import Utils from "../lib/Utils.mjs";

Show_Job_Count();

async function main()
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
