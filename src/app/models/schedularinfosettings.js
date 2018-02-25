'use strict';
module.exports = (sequelize, DataTypes) => {
  var SchedularInfoSettings = sequelize.define('SchedularInfoSettings', {
    id: DataTypes.INTEGER,
    name: DataTypes.CHARACTER,
    short_code: DataTypes.CHARACTER,
    is_enable: DataTypes.INTEGER,
    schedular_type: DataTypes.CHARACTER,
    minutes: DataTypes.INTEGER,
    hours: DataTypes.INTEGER,
    day_of_month: DataTypes.CHARACTER,
    month_of_year: DataTypes.CHARACTER,
    day_of_week: DataTypes.CHARACTER,
    exported_date_limit: DataTypes.INTEGER,
    export_from_days: DataTypes.INTEGER,
    notes: DataTypes.TEXT
  }, {});
  SchedularInfoSettings.associate = function(models) {
    // associations can be defined here
  };
  return SchedularInfoSettings;
};