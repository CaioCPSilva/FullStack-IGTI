import express from 'express';
import { accountsModel } from '../models/accountsModels.js';
const app = express();

const ERR_AGENCY_OR_ACCOUNT = 'Angência ou conta não foram informadas.';
const ERR_AGENCY_OR_ACCOUNT_NOTFOUND = 'Agência ou conta não encontradas.';
const ERR_INVALID_VALUE = 'Valor não informado ou menor que zero.';
const ERR_INVALID_BALANCE = 'Saldo insuficiente.';

//4 - Registrar depósito na conta

app.post('/accounts/deposit', async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;
    if (!agencia || !conta) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT);
    }
    if (!value || value < 0) {
      return res.status(404).send(ERR_INVALID_VALUE);
    }

    const newDoc = { returnOriginal: false };
    // const newDoc = {new: true};
    // Os dois retornam o documento com os valores atualizados

    let accountUpdate = await accountsModel.findOneAndUpdate(
      { agencia: agencia, conta: conta },
      { $inc: { balance: value } },
      newDoc
    );
    if (!accountUpdate) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    res.send({ balance: accountUpdate.balance + value });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//5 - Registrar saque na conta cobrando tarifa de (1)

app.post('/accounts/withdraw', async (req, res) => {
  try {
    const { agencia, conta, value } = req.body;
    if (!agencia || !conta) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT);
    }
    if (!value || value < 0) {
      return res.status(404).send(ERR_INVALID_VALUE);
    }

    let withdrawValue = value + 1;
    withdrawValue = -1 * withdrawValue;
    const account = await accountsModel.findOne({
      agencia,
      conta,
    });
    if (!account) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    if (account.balance + withdrawValue < 0) {
      return res.status(404).send(ERR_INVALID_BALANCE);
    }

    const newDoc = { returnOriginal: false };
    // const newDoc = {new: true};
    // Os dois retornam o documento com os valores atualizados

    let accountUpdate = await accountsModel.findOneAndUpdate(
      { agencia: agencia, conta: conta },
      { $inc: { balance: withdrawValue } },
      newDoc
    );
    if (!accountUpdate) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    res.send({ balance: accountUpdate.balance + withdrawValue });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//6 - Consulta o Saldo (query no insomnia)

app.get('/accounts/balance', async (req, res) => {
  try {
    const { agencia, conta } = req.query;
    if (!agencia || !conta) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT);
    }
    const account = await accountsModel.findOne({
      agencia,
      conta,
    });
    if (!account) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    res.send({ balance: account.balance });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//7 - Excluir uma conta

app.delete('/accounts/:agencia/:conta', async (req, res) => {
  try {
    const agencia = req.params.agencia;
    const conta = req.params.conta;
    if (!agencia || !conta) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT);
    }
    const account = await accountsModel.deleteOne({
      agencia: agencia,
      conta: conta,
    });
    if (account.deletedCount <= 0) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    const count = await accountsModel.countDocuments({ agencia });

    return res.send({ agencia: agencia, countAgencia: count });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//8 - Transferência entre contas

app.patch('/accounts/transfer', async (req, res) => {
  try {
    const { contaOrigem, contaDestino, value } = req.body;
    if (!contaOrigem || !contaDestino) {
      return res
        .status(404)
        .send('Campo contaOrigem ou contaDestino não foram informados!');
    }
    if (!value || value < 0) {
      return res.status(404).send(ERR_INVALID_VALUE);
    }
    //valor para transferência
    let transferValue = -1 * value;
    const accountOrigin = await accountsModel.find({
      conta: contaOrigem,
    });
    if (!accountOrigin) {
      return res.status(404).send('Conta de origem não encontrada!');
    }
    //verificar se a conta de origem tem saldo suficiente
    if (accountOrigin.balance + transferValue < 0) {
      return res.status(404).send(ERR_INVALID_BALANCE);
    }

    const accountDestiny = await accountsModel.find({
      conta: contaDestino,
    });
    if (!accountDestiny) {
      return res.status(404).send('Conta de destino não encontrada!');
    }

    const saldoOrigem = accountOrigin[0].balance;
    const agenciaOrigem = accountOrigin[0].agencia;
    const agenciaDestino = accountDestiny[0].agencia;
    //Se não são da mesma agência, acrescenta tarifa de 8 reais (no caso está negativo porq é um saque)
    if (agenciaOrigem === agenciaDestino) {
    } else {
      transferValue = transferValue - 8;
      //verificar novamente se a conta de origem tem saldo suficiente
      if (saldoOrigem + transferValue < 0) {
        return res.status(404).send(ERR_INVALID_BALANCE);
      }
    }

    const newDoc = { returnOriginal: false };
    let accountUpdateOrigin = await accountsModel.findOneAndUpdate(
      { agencia: agenciaOrigem, conta: contaOrigem },
      { $inc: { balance: transferValue } },
      newDoc
    );

    if (!accountUpdateOrigin) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }

    let accountUpdateDestiny = await accountsModel.findOneAndUpdate(
      { agencia: agenciaDestino, conta: contaDestino },
      { $inc: { balance: value } },
      newDoc
    );

    if (!accountUpdateDestiny) {
      return res.status(404).send(ERR_AGENCY_OR_ACCOUNT_NOTFOUND);
    }
    //valor de origin é positivo, porém o transferValue já está negativo, por isso +
    res.send({
      saldoOrigem: saldoOrigem + transferValue,
      agenciaOrigem: agenciaOrigem,
      agenciaDestino: agenciaDestino,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

//9. Crie um endpoint para consultar a média do saldo dos clientes de determinada agência.
//O endpoint deverá receber como parâmetro a “agência” e deverá retornar o balance médio da conta.
app.get('/accounts/mediaBalance/:agencia', async (req, res) => {
  try {
    const agencia = req.params.agencia;
    if (!agencia) {
      return res.status(404).send('Agência é obrigatória!');
    }
    const count = await accountsModel.countDocuments({ agencia: +agencia });

    const accounts = await accountsModel.aggregate([
      {
        $match: { agencia: +agencia },
      },
      {
        $group: {
          _id: null,
          balanceAvg: { $avg: '$balance' },
          total: { $sum: '$balance' },
        },
      },
    ]);

    if (accounts.length === 0) {
      return res.status(404).send('Agência não encontrada!');
    }

    const balanceAvg = accounts[0].balanceAvg;
    const total = accounts[0].total;

    res.send({ mediaBalance: balanceAvg, total: total, count: count });
  } catch (error) {
    res.status(500).send(error);
  }
});

//10. Crie um endpoint para consultar os clientes com o menor saldo em conta. O endpoint
//deverá receber como parâmetro um valor numérico para determinar a quantidade de
//clientes a serem listados, e o endpoint deverá retornar em ordem crescente pelo
//saldo a lista dos clientes (agência, conta, saldo).
app.get('/accounts/smallestBalance', async (req, res) => {
  try {
    const { limit } = req.query;
    if (!limit || limit <= 0) {
      return res.status(404).send('Campo limit não informado ou inválido!');
    }
    const accounts = await accountsModel
      .find({}, { _id: 0, name: 0 })
      .sort({ balance: 1 })
      .limit(+limit);
    if (accounts.length === 0 || !accounts) {
      return res.status(404).send('Não foi encontrado nenhum resultado.');
    }
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//11. Crie um endpoint para consultar os clientes mais ricos do banco
app.get('/accounts/greatestBalance', async (req, res) => {
  try {
    const { limit } = req.query;
    if (!limit || limit <= 0) {
      return res.status(404).send('Campo limit não informado ou inválido!');
    }
    const accounts = await accountsModel
      .find({}, { _id: 0 })
      .sort({ balance: -1 })
      .limit(+limit);
    if (accounts.length === 0 || !accounts) {
      return res.status(404).send('Não foi encontrado nenhum resultado.');
    }
    res.send(accounts);
  } catch (error) {
    res.status(500).send(error);
  }
});

//12. Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada
//agência para a agência private agencia=99. O endpoint deverá retornar a lista dos clientes da agencia private
app.get('/accounts/transferClientToPrivateAgency', async (_, res) => {
  try {
    const accounts = await accountsModel.aggregate([
      {
        $sort: { balance: -1 },
      },
      {
        $group: {
          _id: '$agencia',
          id: { $first: '$_id' },
          name: { $first: '$name' },
          agencia: { $first: '$agencia' },
          conta: { $first: '$conta' },
          balance: { $first: '$balance' },
        },
      },
    ]);

    console.log(accounts);

    accounts.forEach(async (account) => {
      await accountsModel.findOneAndUpdate(
        { _id: account.id },
        {
          $set: {
            agencia: 99,
          },
        }
      );
    });
    const accountsClientsPrivateAggency = await accountsModel.find({
      agencia: 99,
    });

    res.send(accountsClientsPrivateAggency);
  } catch (error) {
    res.status(500).send(error);
  }
});
export { app as accountsRouter };
