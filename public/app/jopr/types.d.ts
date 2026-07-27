interface Context {
  ai: import("./lib/AI.js").default;
  db: import("./lib/Db.js").default;
  db2: import("./lib/Db.js").default;
  Agency: typeof import("./lib/Agency.js").default;
  Contact: typeof import("./lib/Contact.js").default;
  Job: typeof import("./lib/Job.js").default;
  Profile: typeof import("./lib/Profile.js").default;
  Utils: typeof import("../../lib/Utils.js").default;
  Project: typeof import("./lib/Project.js").default;
}
