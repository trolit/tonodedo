import { DB, USER, PASSWORD, HOST, dialect as _dialect, pool as _pool } from "../config/db.config.js";

import Sequelize from "sequelize";

const sequelize = new Sequelize(
  DB,
  USER,
  PASSWORD,
  {
    host: HOST,
    dialect: _dialect,
    operatorsAliases: false,

    pool: {
      max: _pool.max,
      min: _pool.min,
      acquire: _pool.acquire,
      idle: _pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/user.model.js")(sequelize, Sequelize);
db.tasks = require("../models/task.model.js")(sequelize, Sequelize);

db.users.hasMany(db.tasks, { as: "tasks" });

db.tasks.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

export default db;
