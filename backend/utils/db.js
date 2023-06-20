import { Sequelize } from 'sequelize'

export const connect = async () => {
    const hostName = process.env.HOST;
    const userName = process.env.USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB;
    const dialect = process.env.DIALECT;

    try {

        const sequelize = new Sequelize(database, userName, password, {
            host: hostName,
            dialect: dialect,
            operatorsAliases: false,
            pool: {
                max: 10,
                min: 0,
                acquire: 20000,
                idle: 5000
            }
        });

        await sequelize.authenticate()
        console.log('Connection has been established successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);

    }
}