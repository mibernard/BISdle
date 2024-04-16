champion = [
  'Aatrox',
  'Ahri',
  'Alune',
  'Annie',
  'Aphelios',
  'Ashe',
  'Azir',
  'Bard',
  'Caitlyn',
  'chogath',
  'Darius',
  'Diana',
  'Galio',
  'Garen',
  'Gnar',
  'Hwei',
  'Illaoi',
  'Irelia',
  'Janna',
  'Jax',
  'KaiSa',
  'Kayn',
  'KhaZix',
  'Kindred',
  'Kobuko',
  'kogmaw',
  'leesin',
  'Lillia',
  'Lissandra',
  'Lux',
  'Malphite',
  'Morgana',
  'Nautilus',
  'Neeko',
  'Ornn',
  'Qiyana',
  'Rakan',
  'reksai',
  'Riven',
  'Senna',
  'Sett',
  'Shen',
  'Sivir',
  'Soraka',
  'Sylas',
  'Syndra',
  'tahmkench',
  'Teemo',
  'Thresh',
  'Tristana',
  'Udyr',
  'Volibear',
  'Wukong',
  'Xayah',
  'Yasuo',
  'Yone',
  'Yorick',
  'Zoe',
  'Zyra',
];

document.addEventListener('DOMContentLoaded', () => {
  const storedData = localStorage.getItem('unitData');
  const pageTitle = document.getElementById('page-title');

  if (storedData && pageTitle.textContent.includes('Daily')) {
    console.log('using local storage, title.textContent =', pageTitle);
    const data = JSON.parse(storedData);
    updatePageWithResults(data); // Use the locally stored data
  } else {
    fetchUnitData(randomIndex); // No data found, proceed to fetch new data
  }
});

document.getElementById('toggle-mode').addEventListener('click', function () {
  const pageTitle = document.getElementById('page-title');
  const generateButton = document.getElementById('generate-unit');
  if (this.textContent.includes('Unlimited')) {
    pageTitle.textContent = 'B.I.Sdle - Unlimited';
    this.textContent = 'Switch to Daily';
    generateButton.style.display = 'block'; // Show the generate button
  } else {
    pageTitle.textContent = 'B.I.Sdle - Daily';
    this.textContent = 'Switch to Unlimited';
    generateButton.style.display = 'none'; // Hide the generate button
  }
});

document.getElementById('generate-unit').addEventListener('click', function () {
  const randomIndex = getRandomIndex();
  console.log('Random index champion:', champion[randomIndex]);
  fetchUnitData(randomIndex);
});

function fetchUnitData(index) {
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');

  loadingDiv.style.display = 'block'; // Show loading message
  resultsDiv.innerHTML = ''; // Clear previous results

  fetch(`/api/fetch-alts?unit=${champion[randomIndex]}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('updating page with results');
      updatePageWithResults(data);
    })
    .catch((error) => {
      loadingDiv.style.display = 'none'; // Hide loading message even on error
      console.error('Error fetching data:', error);
      alert('Error fetching data, check the console for more information.');
    });
}

function updatePageWithResults(data) {
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');

  resultsDiv.innerHTML = ''; // Clear previous results
  loadingDiv.style.display = 'none'; // Hide loading message
  if (data.success && Array.isArray(data.alts)) {
    localStorage.setItem('unitData', JSON.stringify(data)); // Save the data to localStorage
    data.alts.forEach((alt) => {
      const itemImg = document.createElement('img');
      alt = alt.replace(/[^a-zA-Z]/g, '');
      itemImg.src = `https://rerollcdn.com/items/${alt}.png`;
      console.log('item url:', itemImg.src);
      itemImg.width = 100;
      itemImg.alt = alt;
      resultsDiv.appendChild(itemImg);
    });
  } else {
    alert('Failed to fetch data: ' + (data.message || 'Unknown error'));
  }
}

const day = new Date().getDate();
const month = new Date().getMonth();

let num = Math.round(((day + 7) / month) * 3913).toString();
console.log('Num: ', num);
const today = +(num[4] + num[3]);
let todayschampion = 0;

if (today > champion.length - 1) {
  var overflow = today - 59;
  todayschampion = overflow;
  console.log(champion.length);
  console.log('Today: ', overflow);
  console.log('Todays Champion:', champion[overflow]);
} else {
  todayschampion = today;
  console.log('Today: ', today);
  console.log('Todays Champion:', champion[today]);
}

// var unitName = document.getElementById('unitName').value;

function getRandomIndex() {
  const max = 58; // Length of the array
  return Math.floor(Math.random() * max); // Math.random() gives a number from 0 (inclusive) to 1 (exclusive)
}

const randomIndex = getRandomIndex();
console.log('Random index:', randomIndex);
console.log('Random index champion:', champion[randomIndex]);

// fetch(`/api/fetch-alts?unit=${champion[todayschampion]}`)
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.success && Array.isArray(data.alts)) {
//       const resultsDiv = document.getElementById('results');
//       resultsDiv.innerHTML = ''; // Clear previous results
//       data.alts.forEach((alt) => {
//         const itemImg = document.createElement('img');

//         // alt = alt.replaceAll(' ', '');
//         alt = alt.replace(/[^a-zA-Z]/g, '');

//         console.log(alt);

//         itemImg.src = `https://rerollcdn.com/items/${alt}.png`;
//         console.log(itemImg.src);
//         itemImg.width = 100;

//         resultsDiv.appendChild(itemImg);
//       });
//     } else {
//       alert('Failed to fetch data: ' + (data.message || 'Unknown error'));
//     }
//   });
