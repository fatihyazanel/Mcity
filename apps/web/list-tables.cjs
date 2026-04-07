const { createClient } = require("@libsql/client");
const path = require("path");
const c = createClient({ url: "file:" + path.join(process.cwd(), "data.db") });
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
  .then((r) => console.log("Tables:", r.rows.map((x) => x.name).join(", ")))
  .catch(console.error);
