db = db.getSiblingDB("cms_db");

db.createUser({
  user: "admin",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "cms_db",
    },
  ],
});
