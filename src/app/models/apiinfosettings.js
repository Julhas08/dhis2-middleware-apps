'use strict';
module.exports = (sequelize, DataTypes) => {
  var ApiInfoSettings = sequelize.define('ApiInfoSettings', {
    id: DataTypes.INTEGER,
    connection_name: DataTypes.TEXT,
    source_name: DataTypes.TEXT,
    base_url: DataTypes.TEXT,
    resource_path: DataTypes.TEXT,
    token_type: DataTypes.CHARACTER
  }, {});
  ApiInfoSettings.associate = function(models) {
    // associations can be defined here
  };
  return ApiInfoSettings;
};