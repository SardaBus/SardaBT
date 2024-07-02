const {Sequelize,DataTypes}=require('sequelize');
const sequelize=new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const User=sequelize.define('User',{
    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    usertype:{
        type:DataTypes.STRING,
        allowNull:false,
        values: ['admin', 'employee', 'driver']
    }
});

sequelize.sync();

module.exports={User,sequelize};
