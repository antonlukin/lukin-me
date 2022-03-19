module.exports = (sequelize, DataTypes) => {
  return sequelize.define('live', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    place: {
      type: new DataTypes.STRING(256),
    },
    country: {
      type: new DataTypes.STRING(2),
      allowNull: false,
    },
    coords: {
      type: new DataTypes.STRING(32),
      defaultValue: 0,
    },
    from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'live',
  });
};
