const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_CON, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de Datos ON LINE');

    } catch(error) {
        console.log(error);
        throw new Error('Error al iniciar la Base de Datos');
    }
}

module.exports = {
    dbConnection
}