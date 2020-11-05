import express from 'express';
import { accountsRouter } from './routes/accountsRouter.js';
import mongoose from 'mongoose';

(async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://caiocpsilva:caiocpsilva@cluster0.hmg2h.mongodb.net/Trabalho_Pratico_4?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (err) {
    console.log('Erro ao conectar no MongoDB: ' + err);
  }
})();

const app = express();

app.use(express.json());
app.use(accountsRouter);

app.listen(3000, () => console.log('API Iniciada'));
