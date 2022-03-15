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
    country: {
      type: new DataTypes.STRING(2),
      allowNull: false,
    },
    lat: {
      type: new DataTypes.STRING(16),
      defaultValue: 0,
    },
    lng: {
      type: new DataTypes.STRING(16),
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
