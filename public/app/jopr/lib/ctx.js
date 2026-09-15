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
  const db_id = new URLSearchParams(window.location.search).get("db_id");
  if (db_id) DB_SCHEMA.name = db_id;

  const ctx =
  {

    ai: await AI.New(fb_app, fb_ai),
    db: await Db.New(DB_SCHEMA),
    Agency, Contact, Job, Profile, Utils, Project
  };
  ctx.db2 = ctx.db;

  const db_read_only = new URLSearchParams(window.location.search).get("db_read_only");
  ctx.db.read_only = db_read_only == "true";

  return ctx;
}

export default New_Ctx;
