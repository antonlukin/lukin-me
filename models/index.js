const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_LINK, {
  logging: false
});

(async () => {
  await sequelize.sync({alter: true});
})();

const models = {
  live: require('./live')(sequelize, DataTypes),
};

module.exports = models;
