import React from 'react';
import InstallmentComponent from './InstallmentComponent';

export default function InstallmentsComponent(props) {
  return (
    <div className="row">
      {props.installments.map(
        ({ id, totalValue, incomeInvestment, incomePercentage }, index) => {
          return (
            <div className="col s2" key={index}>
              <InstallmentComponent
                installment={index + 1}
                totalValue={totalValue}
                incomeInvestment={incomeInvestment}
                incomePercentage={incomePercentage}
              />
            </div>
          );
        }
      )}
    </div>
  );
}
