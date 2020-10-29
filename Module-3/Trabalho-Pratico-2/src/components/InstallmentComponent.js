import React from 'react';
import css from './installment.module.css';
import { formatNumber } from '../helpers/formData';

export default function InstallmentComponent({
  installment,
  totalValue,
  incomeInvestment,
  incomePercentage,
}) {
  return (
    <div className={css.box}>
      <div className={css.leftComponent}>
        <span>{installment}</span>
      </div>
      <div
        className={incomeInvestment > 0 ? css.positiveValue : css.negativeValue}
      >
        <span className={css.value}>R$ {formatNumber(totalValue)}</span>
        <span className={css.value}>
          {incomeInvestment > 0 ? '+' : '-'}R${formatNumber(incomeInvestment)}
        </span>
        <span
          className={
            incomeInvestment > 0
              ? css.positivePercentage
              : css.negativePercentage
          }
        >
          {formatNumber(incomePercentage)}%
        </span>
      </div>
    </div>
  );
}
