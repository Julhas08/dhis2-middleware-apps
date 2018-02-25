'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SchedularInfoSettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.CHARACTER
      },
      short_code: {
        type: Sequelize.CHARACTER
      },
      is_enable: {
        type: Sequelize.INTEGER
      },
      schedular_type: {
        type: Sequelize.CHARACTER
      },
      minutes: {
        type: Sequelize.INTEGER
      },
      hours: {
        type: Sequelize.INTEGER
      },
      day_of_month: {
        type: Sequelize.CHARACTER
      },
      month_of_year: {
        type: Sequelize.CHARACTER
      },
      day_of_week: {
        type: Sequelize.CHARACTER
      },
      exported_date_limit: {
        type: Sequelize.INTEGER
      },
      export_from_days: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('SchedularInfoSettings');
  }
};