const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense','root','7355',{
    host:'localhost',
    dialect:'mysql'
});

(async()=>{
    try{
          await sequelize.authenticate();
          console.log('db is connected');
    }
    catch(error){
       console.log(error);
    }
})();

module.exports = sequelize;