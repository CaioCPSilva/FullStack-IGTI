import React, { useState } from 'react';
import FormComponent from './components/FormComponent';
import InstallmentsComponent from './components/InstallmentsComponent';

export default function App() {
  const [installments, setInstallments] = useState([]);
  const generateInstallments = (formData) => {
    const { investment, percentage, term } = formData;
    investment &&
      percentage &&
      term &&
      setInstallments(calculate(investment, percentage, term));
  };

  const calculate = (investment, percentage, term) => {
    const installments = [];
    for (let month = 1; month <= parseInt(term); month++) {
      const installment = {};
      installment.totalValue =
        parseFloat(investment) *
        (1 + parseFloat(percentage / 100)) ** parseInt(month);
      installment.incomeInvestment =
        parseFloat(installment.totalValue) - parseFloat(investment);
      installment.incomePercentage =
        (parseFloat(installment.incomeInvestment) / parseFloat(investment)) *
        100;
      installments.push(installment);
    }
    return installments;
  };

  return (
    <div className="container">
      <FormComponent onChangeFormsValue={generateInstallments} />
      <InstallmentsComponent installments={installments} />
    </div>
  );
}
