export default (sequelize, Sequelize) => {

    const User = sequelize.define("users", {

      email: {
        type: Sequelize.STRING,
        primaryKey: true
      },

      password: {
        type: Sequelize.STRING
      }

    });
  
    return User;
};