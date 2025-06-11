const {Sequelize} = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.SCHEMA,process.env.DBUSERNAME,process.env.DBPASSWORD,{
    host:process.env.HOST,
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