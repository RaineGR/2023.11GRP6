import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import router from './router';
import * as dotenv from 'dotenv';
dotenv.config();

// Conectando a la base de datos
mongoose.Promise = global.Promise;
const dbUrl = "mongodb://localhost:27017/tienda_cursos";
mongoose.connect(
    dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(mongoose => console.log('Conectado a la base de datos puerto 27017'))
.catch(err => console.log(err));

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/',router);

app.set('port', process.env.PORT || 4200);

app.listen(app.get('port'), () => {
    console.log("Servidor ejecutandose en el puerto 3000");
});