import React, { useEffect, useState } from 'react';

export default function FormComponent({ onChangeFormsValue }) {
  const [investment, setInvestment] = useState('');
  const [percentage, setPercentage] = useState('');
  const [term, setTerm] = useState('');

  useEffect(() => {
    const formData = {
      investment,
      percentage,
      term,
    };
    onChangeFormsValue(formData);
  }, [investment, percentage, term]);

  return (
    <div>
      <form action="">
        <div className="row">
          <div className="col s4">
            <div className="input-field">
              <input
                type="number"
                id="investment"
                step="1"
                onChange={(event) => setInvestment(event.target.value)}
              />
              <label htmlFor="investment" className="active">
                Valor inicial:
              </label>
            </div>
          </div>
          <div className="col s4">
            <div className="input-field">
              <input
                type="number"
                id="percentage"
                step="0.1"
                onChange={(event) => setPercentage(event.target.value)}
              />
              <label htmlFor="percentage" className="active">
                Taxa percentual:
              </label>
            </div>
          </div>
          <div className="col s4">
            <div className="input-field">
              <input
                type="number"
                id="term"
                step="1"
                onChange={(event) => setTerm(event.target.value)}
              />
              <label htmlFor="term" className="active">
                Meses:
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
