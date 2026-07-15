import AI from "./AI.js";
import Db from "./Db.js";
import Profile from "./Profile.js";
import Job from "./Job.js";
import Utils from "../../../lib/Utils.js";
import Contact from "./Contact.js";
import Agency from "./Agency.js";
import * as fb_app from "firebase/app";
import * as fb_ai from "firebase/ai";
import DB_SCHEMA from "../db/schema.js";

async function New_Ctx()
{
  const db_id = new URLSearchParams(window.location.search).get("db_id");
  if (db_id) DB_SCHEMA.name = db_id;

  const ctx =
  {
    ai: await AI.New(fb_app, fb_ai),
    db: await Db.New(DB_SCHEMA),
    db2: await Db.New(DB_SCHEMA),
    Agency, Contact, Job, Profile, Utils
  };
  return ctx;
}

export default New_Ctx;
