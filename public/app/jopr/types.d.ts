interface Context {
  db: import("./lib/Db.js").default;
  db2: import("./lib/Db.js").default;
  ai: import("./lib/AI.js").default;
  Profile: typeof import("./lib/Profile.js").default;
  Job: typeof import("./lib/Job.js").default;
  Utils: typeof import("../../lib/Utils.js").default;
}
