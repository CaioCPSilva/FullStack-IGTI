let usersList = null;
let statisticsList = null;
let inputName = null;

let allUsers = [];
let filteredUsers = [];

let countUsers = 0;
let countMale = 0;
let countFemale = 0;
let sumAges = 0;
let averageAges = 0;

window.addEventListener('load', () => {
  usersList = document.querySelector('#usersList');
  statisticsList = document.querySelector('#statisticsList');
  countUsers = document.querySelector('#countUsers');
  countMale = document.querySelector('#countMale');
  countFemale = document.querySelector('#countFemale');
  sumAges = document.querySelector('#sumAges');
  averageAges = document.querySelector('#averageAges');
  inputName = document.querySelector('#inputName');
  button = document.querySelector('#searchButton');

  fetchUsers();
  filterUserList();
});

async function fetchUsers() {
  //prettier-ignore
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();
  allUsers = json.results.map((users) => {
    const { name, dob, gender, picture } = users;

    return {
      name: `${name.first} ${name.last}`,
      birth: dob.age,
      gender: gender,
      picture: picture.thumbnail,
    };
  });
}

function filterUserList() {
  function handleInput(event) {
    nameToSearch = event.target.value.toLowerCase();
    if (event.key === 'Enter' && event.target.value.trim() !== '')
      filterUsers();
  }
  function handleButton(event) {
    if (event.target.value === '') {
      document.getElementById('searchButton').disabled = true;
    } else {
      document.getElementById('searchButton').disabled = false;
    }
  }

  inputName.addEventListener('input', handleButton);
  inputName.addEventListener('keyup', handleInput);
  button.addEventListener('click', filterUsers);

  function filterUsers() {
    filteredUsers = allUsers.filter((users) => {
      return users.name.toLowerCase().indexOf(nameToSearch) !== -1;
    });
    let countFilteredUsers = filteredUsers.length;
    let usersHTML = '<div>';

    filteredUsers.forEach((users) => {
      const userHTML = `
      <div class='users'>
        <div class='users-items'>
        <img src="${users.picture}" alt="${users.name}">
        <span>${users.name}, ${users.birth} anos</span>
        </div>
      </div>
      `;
      usersHTML += userHTML;
    });
    usersHTML += '</div>';
    usersList.innerHTML = usersHTML;
    countUsers.innerHTML = `${countFilteredUsers} usuário(s) filtrado(s)`;

    countMale = filteredUsers.filter((users) => {
      return users.gender === 'male';
    });

    countFemale = filteredUsers.filter((users) => {
      return users.gender === 'female';
    });

    sumAges = filteredUsers.reduce((acc, curr) => {
      return acc + curr.birth;
    }, 0);

    averageAges = (sumAges / filteredUsers.length).toFixed(2);

    titleStatistics.innerHTML = 'Estatísticas';
    attributesList.innerHTML = `
    <ul class="collection">
                  <li class="collection-item">
                    Sexo masculino: ${countMale.length}
                  </li>
                  <li class="collection-item">
                    Sexo feminino: ${countFemale.length}
                  </li>
                  <li class="collection-item">
                    Soma das idades: ${sumAges}
                  </li>
                  <li class="collection-item">
                    Média das idades: ${averageAges}
                  </li>
                </ul>
    `;
  }
}
