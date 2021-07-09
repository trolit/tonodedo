module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "YOUR_PASSWORD",
    DB: "tonodedodb",
    PORT: 0000,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};