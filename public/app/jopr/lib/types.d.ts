interface Context {
  db: import("./Db.js").default;
  db2: import("./Db.js").default;
  ai: import("./AI.js").default;
  Profile: typeof import("./Profile.js").default;
  Job: typeof import("./Job.js").default;
  Utils: typeof import("../../../lib/Utils.js").default;
}
