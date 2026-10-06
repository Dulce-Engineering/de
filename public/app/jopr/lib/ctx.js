import AI from "./AI.js?v=2";
import Db from "./Db.js?v=2";
import Profile from "./Profile.js?v=2";
import Job from "./Job.js?v=2";
import Utils from "../../../lib/Utils.js?v=2";
import Contact from "./Contact.js?v=2";
import Agency from "./Agency.js?v=2";
import Project from "./Project.js?v=2";
import * as fb_app from "firebase/app";
import * as fb_ai from "firebase/ai";
import DB_SCHEMA from "../db/schema.js?v=2";

async function New_Ctx()
{
  const url_params = new URLSearchParams(window.location.search);

  const db_id = url_params.get("db_id");
  if (db_id) DB_SCHEMA.name = db_id;

  const ctx =
  {
    ai: await AI.New(fb_app, fb_ai),
    db: await Db.New(DB_SCHEMA),
    Agency, Contact, Job, Profile, Utils, Project,
    routes:
    {
      "gen-cv-2": 
        (job_id, profile_id, gen) => 
          Add_Params("page/gen-cv-2.html", {job_id, profile_id, gen, db_id}),
      "gen-cl": job_id => Add_Params("page/gen-cl.html", {job_id, db_id}),
      "profiles": () => Add_Params("page/profiles.html", {db_id}),
      "index": () => Add_Params("index.html", {db_id}),
    }
  };
  ctx.db2 = ctx.db;

  const db_read_only = url_params.get("db_read_only");
  ctx.db.read_only = db_read_only == "true";

  return ctx;
}

function Add_Params(url, params)
{
  let res = url;

  if (params)
  {
    let param_sep = "?";
    for (const param_name in params)
    {
      const param_value = params[param_name];
      if (param_value != null && param_value != undefined)
      {
        const param_str = param_sep + param_name + "=" + param_value;
        res += param_str;
        param_sep = "&";
      }
    }
  }

  return res;
}

export default New_Ctx;
