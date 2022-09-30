module.exports = (sequelize, DataTypes) => {
  return sequelize.define('photo', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    url: {
      type: new DataTypes.STRING(256),
      allowNull: '',
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'photo',
  });
};
