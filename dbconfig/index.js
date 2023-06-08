const Sequelize = require('sequelize');

const sequelize = new Sequelize('hapi_tutorial', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

module.exports.connect = sequelize;

module.exports.raw = async function(query){
    try{
        await sequelize.authenticate();
        console.log("connected")

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
