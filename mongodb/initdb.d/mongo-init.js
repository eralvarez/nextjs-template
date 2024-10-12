db = db.getSiblingDB("project_db");

db.createUser({
  user: "user",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "project_db",
    },
  ],
});
