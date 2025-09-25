import { ValidationError } from "../errors/ValidationError";
import { ForbiddenError } from "../errors/ForbiddenError";

module.exports = (app: any) => {
  const find = (filter = {}) => {
    return app
      .db('transfers')
      .where(filter)
      .select();
  };

  const validateRequiredFields = (transfer: any) => {
    if (!transfer.description) {
      throw new ValidationError('Descricao e um atributo obrigatorio');
    }
    if (transfer.ammount === undefined || transfer.ammount === null) {
      throw new ValidationError('Valor e um atributo obrigatorio');
    }
    if (!transfer.date) {
      throw new ValidationError('Data e um atributo obrigatoria');
    }
    if (!transfer.acc_ori_id) {
      throw new ValidationError('Conta de origem e um atributo obrigatorio');
    }
    if (!transfer.acc_dest_id) {
      throw new ValidationError('Conta de destino e um atributo obrigatorio');
    }
    if (!transfer.user_id) {
      throw new ValidationError('Usuario e um atributo obrigatorio');
    }
  };

  const validateAmount = (transfer: any) => {
    const value = Number(transfer.ammount);
    if (Number.isNaN(value)) {
      throw new ValidationError('Valor invalido');
    }
    if (value <= 0) {
      throw new ValidationError('Valor deve ser positivo');
    }
    return value;
  };

  const validateAccounts = async (transfer: any) => {
    if (transfer.acc_ori_id === transfer.acc_dest_id) {
      throw new ValidationError('Conta de origem e destino devem ser diferentes');
    }

    const originAccount = await app.services.account.find({ id: transfer.acc_ori_id });
    if (!originAccount) {
      throw new ValidationError('Conta de origem invalida');
    }
    if (originAccount.user_id !== transfer.user_id) {
      throw new ForbiddenError('Este recurso não pertence ao usuário');
    }

    const destinationAccount = await app.services.account.find({ id: transfer.acc_dest_id });
    if (!destinationAccount) {
      throw new ValidationError('Conta de destino invalida');
    }
    if (destinationAccount.user_id !== transfer.user_id) {
      throw new ForbiddenError('Este recurso não pertence ao usuário');
    }

    return { originAccount, destinationAccount };
  };

  const save = async (transfer: any) => {
    validateRequiredFields(transfer);
    const value = validateAmount(transfer);
    const { originAccount, destinationAccount } = await validateAccounts(transfer);

    return app.db.transaction(async (trx: any) => {
      const result = await trx('transfers').insert(transfer, '*');
      const savedTransfer = result[0];

      const creditTransaction = {
        description: `Transfer from ${originAccount.name}`,
        date: transfer.date,
        ammount: value,
        type: 'I',
        acc_id: transfer.acc_dest_id,
        transfer_id: savedTransfer.id,
      };

      const debitTransaction = {
        description: `Transfer to ${destinationAccount.name}`,
        date: transfer.date,
        ammount: -value,
        type: 'O',
        acc_id: transfer.acc_ori_id,
        transfer_id: savedTransfer.id,
      };

      await trx('transactions').insert([creditTransaction, debitTransaction]);

      return result;
    });
  };

  return { find, save };
};
