// const numberFormatter = Intl.NumberFormat('pt-br');
const moneyFormatter = Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL',
});

// function formatNumber(value) {
//   return numberFormatter.format(value);
// }

function formatMoney(value) {
  return moneyFormatter.format(value);
}

function formatPercentage(value) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export { formatMoney, formatPercentage };
