module.exports = (sequelize, Sequelize) => {

    const Task = sequelize.define("tasks", {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      description: {
        type: Sequelize.STRING
      }

    });
  
    return Task;
};