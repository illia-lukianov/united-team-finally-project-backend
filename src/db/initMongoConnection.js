import mongoose from 'mongoose';
import getEnvVariables from '../utils/getEnvVariables.js';

export async function initMongoConnection () {
    const nameUser = getEnvVariables('MONGODB_USER');
    const password = getEnvVariables('MONGODB_PASSWORD');
    const url = getEnvVariables('MONGODB_URL');
    const nameDb = getEnvVariables('MONGODB_DB');
    const DBURI = `mongodb+srv://${nameUser}:${password}@${url}/${nameDb}?retryWrites=true&w=majority`;
    await mongoose.connect(DBURI);
}