import mongoose from "mongoose";

//Se conecta la BD. Usamos try-catch en caso de haber error, ver que pasa
const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)

            /*Leemos los valores de la conexion e imprime  en consola*/
        const url = `${connection.connection.host}:${connection.connection.port}: `
        console.log(`MongoDB conectado en: ${url}`)
    } catch (error){
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
};

export default conectarDB;