const champions = [
  'Ahri',
  'Akali',
  'Ashe',
  'Bard',
  'Blitzcrank',
  'Briar',
  'Camille',
  'Cassiopeia',
  'Diana',
  'Elise',
  'Ezreal',
  'Fiora',
  'Galio',
  'Gwen',
  'Hecarim',
  'Hwei',
  'Jax',
  'Jayce',
  'Jinx',
  'Kalista',
  'Karma',
  'Kassadin',
  'Katarina',
  'KogMaw',
  'Lillia',
  'Milio',
  'Mordekaiser',
  'Morgana',
  'Nami',
  'Nasus',
  'Neeko',
  'Nilah',
  'Nomsy',
  'Norra & Yuumi',
  'Nunu',
  'Olaf',
  'Poppy',
  'Rakan',
  'Rumble',
  'Ryze',
  'Seraphine',
  'Shen',
  'Shyvana',
  'Smolder',
  'Soraka',
  'Swain',
  'Syndra',
  'Tahm Kench',
  'Taric',
  'Tristana',
  'Twitch',
  'Varus',
  'Veigar',
  'Vex',
  'Warwick',
  'Wukong',
  'Xerath',
  'Ziggs',
  'Zilean',
  'Zoe'
];

let currentMode = 'daily'; // Default mode
let currentIndex; // This will hold the index of the current champion to guess

let guessedChampions = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchUnitData(currentIndex);
});

document.getElementById('toggle-mode').addEventListener('click', function () {
  const resultsDiv = document.getElementById('results');
  const incorrectGuesses = document.getElementById('incorrectGuesses');
  const feedback = document.getElementById('feedback');
  const loadingDiv = document.getElementById('loading');

  resultsDiv.innerHTML = ''; // Clear previous results
  incorrectGuesses.innerHTML = ''; // Clear previous incorrect guesses
  feedback.innerHTML = ''; // Clear previous feedback
  const pageTitle = document.getElementById('page-title');
  const generateButton = document.getElementById('generate-unit');
  guessedChampions = [];

  if (this.textContent.includes('Unlimited')) {
    pageTitle.textContent = 'BISdle - Unlimited';
    this.textContent = 'Daily Mode';
    loadingDiv.textContent = '';
    generateButton.style.display = 'block'; // Show the generate button
    currentMode = 'Daily';
  } else {
    pageTitle.textContent = 'BISdle - Daily';
    this.textContent = 'Unlimited Mode';
    loadingDiv.textContent = 'loading...'; // clear loading message
    generateButton.style.display = 'none'; // Hide the generate button
    currentMode = 'Unlimited';
    currentIndex = todayschampion;
    fetchUnitData(currentIndex);
  }
});

document.getElementById('unitName').addEventListener('input', function (e) {
  const input = e.target.value.toLowerCase();
  const list = document.getElementById('autocomplete-list');
  list.innerHTML = ''; // Clear previous suggestions

  if (!input) return;

  champions.forEach((champion) => {
    if (champion.toLowerCase().startsWith(input) && !guessedChampions.includes(champion.toLowerCase())) {
      const item = document.createElement('div');
      item.innerHTML = champion;
      item.addEventListener('click', function () {
        document.getElementById('unitName').value = champion; // Set input value
        document.getElementById('guessButton').click(); // Trigger the click event on the button
        document.getElementById('unitName').focus();
        list.innerHTML = ''; // Clear suggestions
        guessedChampions.push(champion.toLowerCase()); // Add to guessed list
      });
      list.appendChild(item);
    }
  });
});

document.addEventListener('click', function (e) {
  if (!e.target.matches('#unitName')) {
    document.getElementById('autocomplete-list').innerHTML = '';
  }
});

document.getElementById('generate-unit').addEventListener('click', function () {
  const incorrectGuesses = document.getElementById('incorrectGuesses');
  const feedback = document.getElementById('feedback');
  const loadingDiv = document.getElementById('loading');
  loadingDiv.textContent = 'loading...'; // clear loading message
  incorrectGuesses.innerHTML = ''; // Clear previous incorrect guesses
  feedback.innerHTML = ''; // Clear previous feedback
  currentIndex = getRandomIndex();
  console.log('Random Champion:', champions[currentIndex]);
  fetchUnitData(currentIndex);
  guessedChampions = [];
});

function fetchUnitData() {
  const loadingDiv = document.getElementById('loading');
  const resultsDiv = document.getElementById('results');

  loadingDiv.style.display = 'block'; // Show loading message
  resultsDiv.innerHTML = ''; // Clear previous results

  fetch(`/api/fetch-alts?unit=${champions[currentIndex]}`)
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
  console.log('Received data:', data);
  const resultsDiv = document.getElementById('results');
  const loadingDiv = document.getElementById('loading');

  resultsDiv.innerHTML = ''; // Clear previous results

  if (data.success && Array.isArray(data.alts)) {
    // localStorage.setItem('unitData', JSON.stringify(data)); // Save the data to localStorage
    loadingDiv.style.display = 'none'; // Hide loading message
    data.alts.forEach((alt) => {
      const itemImg = document.createElement('img');
      alt = alt
        .split('-') // Split the string into an array of words using hyphen as delimiter
        .map((word) => {
          // Capitalize the first letter of each word, except for the word "of"
          if (word === 'of') {
            return word;
          } else {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
        })
        .join('');
      alt = alt.replace(/[^a-zA-Z]/g, '');

      itemImg.src = `https://rerollcdn.com/items/${alt}.png`;
      console.log('item url:', itemImg.src);
      itemImg.width = 100;
      itemImg.alt = alt;
      resultsDiv.appendChild(itemImg);
    });
  } else {
    loadingDiv.textContent = 'ya the fetch failed oops(vercels fault not mine)'; // Hide loading message
    console.log('updatePageWithResults Error: ' + (data.message || 'Unknown error'));
  }
}

document.getElementById('guessButton').addEventListener('click', function () {
  const userInputField = document.getElementById('unitName');
  const userInput = userInputField.value.trim();
  const correctAnswer = champions[currentIndex]; // Make sure this variable is correctly assigned somewhere in your script

  const feedback = document.getElementById('feedback');
  const incorrectGuesses = document.getElementById('incorrectGuesses');

  if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
    feedback.textContent = `Correct! It was ${correctAnswer}.`;
    feedback.style.color = 'green';
  } else {
    feedback.textContent = 'Incorrect, try again!';
    feedback.style.color = 'red';

    // Create a new paragraph for each incorrect guess and append it
    const guessEntry = document.createElement('p');
    guessEntry.textContent = userInput;
    guessEntry.style.color = 'red'; // Optional: make incorrect guesses red
    incorrectGuesses.appendChild(guessEntry);
  }

  userInputField.value = ''; // Clear input field after the guess
});

// Clear feedback when the page reloads
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('feedback').textContent = '';
});

document.getElementById('unitName').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    // Check if the key pressed is 'Enter'
    event.preventDefault(); // Prevent the default action to avoid form submission
    var firstItem = document.querySelector('#autocomplete-list div');
    if (firstItem) {
      firstItem.click(); // Programmatically click the first item in the list
    }
  }
});

// DAILY RANDOM NUMBER GENERATION CODE

const day = new Date().getDate();
const month = new Date().getMonth();

let num = Math.round(((day + 7) / month) * 3913).toString();
console.log('Num:', num);
const today = +(num[4] + num[3]);
let todayschampion;

if (today > champions.length - 1) {
  var overflow = today - 59;
  currentIndex = overflow;
  todayschampion = overflow;

  console.log(champions.length);
  console.log('Daily Random Number:', overflow);
  console.log('Daily Champion:', champions[overflow]);
} else {
  currentIndex = today;
  todayschampion = today;
  console.log('Daily Random Number:', today);
  console.log('Daily Champion:', champions[today]);
}

// UNLIMITED RANDOM NUMBER GENERATION CODE
function getRandomIndex() {
  const max = 58; // Length of the array
  return Math.floor(Math.random() * max); // Math.random() gives a number from 0 (inclusive) to 1 (exclusive)
}

const randomIndex = getRandomIndex();
