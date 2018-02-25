'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ApiInfoSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      connection_name: {
        type: Sequelize.TEXT
      },
      source_name: {
        type: Sequelize.TEXT
      },
      base_url: {
        type: Sequelize.TEXT
      },
      resource_path: {
        type: Sequelize.TEXT
      },
      token_type: {
        type: Sequelize.CHARACTER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ApiInfoSettings');
  }
};