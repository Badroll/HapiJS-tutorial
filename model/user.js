/*
OPTIONAL (tidak harus pakai model)
Model adalah cara lain mengolah database (untung masing2 tabel) agar lebih simple.
Perlu sedikit mempelajari kode model untuk tiap teknologi/framework.
Jika dirasa terlalu ribet, bisa pakai raw query saja (query maual), akan lebih confident walau dengan sedikit lebih banyak kode saat mengeksekusi.
*/

const Connection = require('./../dbconfig');
const {DataTypes} = require('sequelize');

const dbConnection = Connection.connect;

const User = dbConnection.define('user', {
    USER_ID:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    USER_NAME:{
        type : DataTypes.STRING
    }
},
{
    freezeTableName: true,
    timestamps: false
}
);

// dbConnection.drop().then(() => {
//     dbConnection.sync();
// })

module.exports.createUser = function(name){
    User.create({USER_NAME: name}).then((data) => {
        console.log(data.toJSON());
    });
}