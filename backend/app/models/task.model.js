export default (sequelize, Sequelize) => {

    const Task = sequelize.define("tasks", {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },

      description: {
        type: Sequelize.STRING
      }

    });
  
    return Task;
  };