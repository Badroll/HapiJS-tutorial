const Sequelize = require('sequelize');

// konfigurasi kredensial mysql
const sequelize = new Sequelize('hapi_tutorial', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports.connect = sequelize;

// query raw/plain (versi 1)
module.exports.raw = async function(query){
    try{
        await sequelize.authenticate();

        const [result, metadata] = await sequelize.query(query);
        console.log(result);

        return [result, metadata];

    } catch(error){
        console.log(`raw query failed ${error}`);
    }
}

// query raw/plain (versi 2)
module.exports.raw = async function(query, params){
    try{
        await sequelize.authenticate();

        const [result, metadata] = await sequelize.query(query);
        console.log(result);

        return [result, metadata];

    } catch(error){
        console.log(`raw query failed ${error}`);
    }
}

// async function testConnection(){
//     try{
//         await sequelize.authenticate();
//         console.log("connected")

//         const [result, metadata] = await sequelize.query("SELECT * FROM user");
//         console.log(result);

//     } catch(error){
//         console.log(`test connection failed ${error}`);
//     }
// }

// testConnection();
