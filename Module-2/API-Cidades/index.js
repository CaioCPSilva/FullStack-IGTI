import { promises as fs } from 'fs';

let statesAll = [];
let citiesAll = [];
let statesQuantity = [];

executeChallenge();

async function executeChallenge() {
  await fillArray();
  await createStatesFiles();
  await fiveBiggerStates();
  await fiveLowerStates();
  await biggestCityFromState();
  await lowerestCityFromState();
  await biggestCityAll();
  await lowerestCityAll();
}

async function fillArray() {
  statesAll = JSON.parse(await fs.readFile('Estados.json'));
  citiesAll = JSON.parse(await fs.readFile('Cidades.json'));
  // console.log(statesAll);
}
async function createStatesFiles() {
  console.log('');
  console.log('Quantidade de cidades por estado');
  statesAll.forEach((state) => {
    let citiesFromState = citiesAll
      .filter((city) => {
        return city.Estado === state.ID;
      })
      .sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });

    // prettier-ignore
    fs.writeFile(`./Arquivos/${state.Sigla}.json`,JSON.stringify(citiesFromState));

    const uf = state.Sigla;
    const quantity = citiesFromState.length;
    statesQuantity.push({ uf, quantity });

    console.log(state.Sigla + '-' + citiesFromState.length);
  });
  console.log('');
  statesQuantity.sort((a, b) => {
    return a.uf.localeCompare(b.uf);
  });
}

async function fiveBiggerStates() {
  const states = statesQuantity.sort((a, b) => {
    return b.quantity - a.quantity;
  });

  let fiveStates = [];
  for (let i = 0; i < 5; i++) {
    fiveStates[i] = states[i];
  }

  console.log('5 Maiores estados');
  console.log(fiveStates);
  console.log('');
}

async function fiveLowerStates() {
  const states = statesQuantity.sort((a, b) => {
    return a.quantity - b.quantity;
  });

  let fiveStates = [];
  for (let i = 0; i < 5; i++) {
    fiveStates[i] = states[i];
  }

  console.log('5 menores estados');
  console.log(fiveStates);
  console.log('');
}

async function biggestCityFromState() {
  console.log('maiores cidades por estado');
  for (let i = 0; i < statesAll.length; i++) {
    let filterCities = JSON.parse(
      await fs.readFile(`./Arquivos/${statesAll[i].Sigla}.json`)
    );

    filterCities = filterCities.sort((a, b) => {
      return b.Nome.length - a.Nome.length;
    });

    const size = filterCities[0].Nome.length;

    let citiesWithSize = filterCities
      .filter((city) => {
        return city.Nome.length === size;
      })
      .sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });

    const stateUF = statesAll.find((state) => {
      return state.ID === citiesWithSize[0].Estado;
    });
    console.log(stateUF.Sigla + ' - ' + citiesWithSize[0].Nome);
  }
  console.log('');
}
async function lowerestCityFromState() {
  console.log('menores cidades por estado');
  for (let i = 0; i < statesAll.length; i++) {
    let filterCities = JSON.parse(
      await fs.readFile(`./Arquivos/${statesAll[i].Sigla}.json`)
    );

    filterCities = filterCities.sort((a, b) => {
      return a.Nome.length - b.Nome.length;
    });

    const size = filterCities[0].Nome.length;

    let citiesWithSize = filterCities
      .filter((city) => {
        return city.Nome.length === size;
      })
      .sort((a, b) => {
        return a.Nome.localeCompare(b.Nome);
      });

    const stateUF = statesAll.find((state) => {
      return state.ID === citiesWithSize[0].Estado;
    });
    console.log(stateUF.Sigla + ' - ' + citiesWithSize[0].Nome);
  }
  console.log('');
}

async function biggestCityAll() {
  let biggestCity = citiesAll.sort((a, b) => {
    return b.Nome.length - a.Nome.length;
  });

  const size = biggestCity[0].Nome.length;

  let citiesWithSize = biggestCity
    .filter((city) => {
      return city.Nome.length === size;
    })
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    });

  const stateUF = statesAll.find((state) => {
    return state.ID === citiesWithSize[0].Estado;
  });
  console.log('Maior cidade');
  console.log(stateUF.Sigla + ' - ' + citiesWithSize[0].Nome);
  console.log('');
}
async function lowerestCityAll() {
  let biggestCity = citiesAll.sort((a, b) => {
    return a.Nome.length - b.Nome.length;
  });

  const size = biggestCity[0].Nome.length;

  let citiesWithSize = biggestCity
    .filter((city) => {
      return city.Nome.length === size;
    })
    .sort((a, b) => {
      return a.Nome.localeCompare(b.Nome);
    });

  const stateUF = statesAll.find((state) => {
    return state.ID === citiesWithSize[0].Estado;
  });
  console.log('menor cidade');
  console.log(stateUF.Sigla + ' - ' + citiesWithSize[0].Nome);
  console.log('');
}
