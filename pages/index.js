import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const champions = [
  'Aatrox',
  'Ahri',
  'Alune',
  'Amumu',
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

export default function Home() {
  const [currentMode, setCurrentMode] = useState('Daily');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [guessedChampions, setGuessedChampions] = useState([]);
  const [unitName, setUnitName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [incorrectGuesses, setIncorrectGuesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [itemData, setItemData] = useState({}); // State to store item data

  useEffect(() => {
    // Only set the index based on the mode
    if (currentMode === 'Daily') {
      setCurrentIndex(getTodayIndex());
    } else if (currentMode === 'Unlimited' && currentIndex === null) {
      setCurrentIndex(getRandomIndex());
    }
    getTopItemsForChampion(currentIndex);
  }, [currentMode]);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleMode = () => {
    const newMode = currentMode === 'Daily' ? 'Unlimited' : 'Daily';
    setCurrentMode(newMode);
    setFeedback('');
    setInput('');
    setIncorrectGuesses([]);
    setGuessedChampions([]);
  };

  const handleInputChange = (event) => {
    const input = event.target.value.toLowerCase();
    setInput(event.target.value);
    if (!input) return;
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      document.getElementById('guessBtn').click(); // Programmatically click the guess button
    }
  };

  const handleNewItems = () => {
    setCurrentIndex(getRandomIndex());
    setInput('');
    setFeedback('');
    getTopItemsForChampion(currentIndex);
  };

  // const getFeedbackForCorrectGuess = () => {
  //   const unit = unitName.split('_')[1];

  //   const itemDetails = Object.entries(itemData[Object.keys(itemData)[currentIndex]]).map(([item, count], index) => (
  //     // item = itemMapping[item] || item;
  //     <div key={index}>
  //       {item.split('Item_')[1]}: {count} times
  //     </div>
  //   ));

  //   return (
  //     <>
  //       <div>Correct! It is {unit}.</div>
  //       <div>Item frequencies:</div>
  //       {itemDetails}
  //     </>
  //   );
  // };

  const handleGuess = () => {
    if (!unitName) return;
    // console.log('current index:', currentIndex, 'champions[currentIndex]:', champions[currentIndex]);
    const isCorrect = input.toLowerCase() === unitName.toLowerCase().split('_')[1];
    console.log('input:', input.toLowerCase(), 'answer:', unitName.toLowerCase().split('_')[1]);
    if (isCorrect) {
      document.getElementById('feedback').style.color = 'green';
      setFeedback(`Correct! It is ${unitName.split('_')[1]}.`);
      // document.getElementById('feedback').innerHTML = getFeedbackForCorrectGuess();
      // setFeedback(getFeedbackForCorrectGuess());
    } else {
      document.getElementById('feedback').style.color = 'red';
      setFeedback(`It is not ${input}, try again!`);
      setIncorrectGuesses([...incorrectGuesses, unitName]);
    }
    setInput('');
    setGuessedChampions([...guessedChampions, unitName.toLowerCase()]);
  };

  const handleAnswer = () => {
    document.getElementById('feedback').style.color = '#fffbe6';
    setFeedback(`The answer is ${unitName.split('_')[1]}`);
  };

  function getTodayIndex() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1; // January is 0 in JavaScript, hence +1
    let num = Math.round(((day + 7) / month) * 3913).toString();
    // console.log('Num:', num); // Debugging output to see what num looks like

    // Ensure num has at least 5 characters; pad if necessary
    num = num.padStart(5, '0'); // Ensures there are at least 5 digits, padding with '0' if not

    // Convert the specific characters to numbers; using a safer access approach
    const index4 = +num.charAt(4); // Safely access character, if not exist will give empty string which becomes 0
    const index3 = +num.charAt(3); // Same as above
    let todayIndex = index4 + index3;

    if (todayIndex > champions.length - 1) {
      todayIndex = todayIndex % champions.length;
    }

    // console.log('champions.length:', champions.length);
    // console.log('TodayIndex:', todayIndex);
    // console.log('currentIndex:', currentIndex);
    console.log('Daily Champion:', champions[currentIndex]);

    return todayIndex;
  }

  function getRandomIndex() {
    const max = 58; // Adjust if your champion list size is different
    return Math.floor(Math.random() * max);
  }

  // Update suggestions based on input
  useEffect(() => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    const filtered = champions.filter(
      (champion) =>
        champion.toLowerCase().startsWith(input.toLowerCase()) && !guessedChampions.includes(champion.toLowerCase())
    );
    setSuggestions(filtered);
  }, [input, guessedChampions]);

  // Handle selecting a suggestion
  const handleSelect = (champion) => {
    setInput(champion); // Set input to the selected champion
    console.log('champion', champion);
    setGuessedChampions((prev) => [...prev, champion.toLowerCase()]); // Add to guessed list
    setSuggestions([]); // Clear suggestions
    document.getElementById('guessBtn').click();
  };

  // Clear suggestions when clicking outside the input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.matches('#unitName')) {
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tftMatches'); // Adjust the endpoint if needed
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setItemData(data.data); // Assuming the backend returns an object with a 'data' key
      console.log('itemData:', itemData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item data:', error);
      setLoading(false);
    }
  };

  const getTopItemsForChampion = (index) => {
    if (!itemData || Object.keys(itemData).length === 0) {
      console.log('No item data available', index);
      return;
    }

    const championNames = Object.keys(itemData);
    const championName = championNames[index];
    if (championName === 'TFT11_Kayle') {
      championName = championNames[index + 1];
    }
    setUnitName(championName);
    console.log('unitName', unitName);
    const items = itemData[championName];
    console.log('championName', championName);
    console.log('items', items);

    //itemData[Object.keys(itemData)[currentIndex]]

    if (!items || Object.keys(items).length === 0) {
      console.log(`No items data available for ${championName}`);
      // handleNewItems();
      // getTopItemsForChampion(index + 1); these two can lead to max call stack for some reason
      return { championName, topThreeItems: [] };
    }

    const sortedItems = Object.entries(items).sort((a, b) => b[1] - a[1]);
    const topThreeItems = sortedItems.slice(0, 3).map((item) => item[0]);

    const container = document.getElementById('results');
    container.innerHTML = ''; // Clear previous items
    topThreeItems.forEach((item) => {
      const imgElement = document.createElement('img');
      imgElement.src = getImageUrl(item);
      imgElement.alt = item;
      imgElement.className = 'itemImg';
      imgElement.style.width = '100px';
      imgElement.style.border = 'solid 3px #c8aa6d';
      imgElement.style.margin = '6px'; // Set image width
      container.appendChild(imgElement);
    });
    console.log(`Top 3 items for ${championName}:`, topThreeItems.map(getImageUrl));
    return { championName, topThreeItems };
  };

  function pascalToSnakeCase(str) {
    return str
      .replace(/\.?([A-Z]+)/g, function (x, y) {
        return '_' + y.toLowerCase();
      })
      .replace(/^_/, '');
  }
  function pascalToKebab(inputString) {
    // Initialize the result with the first character converted to lowercase
    let result = inputString[0].toLowerCase();
    // Loop over the input string starting from the second character
    for (let i = 1; i < inputString.length; i++) {
      let char = inputString[i];
      // If the character is uppercase, add a hyphen before it
      if (char >= 'A' && char <= 'Z') {
        result += '-' + char.toLowerCase();
      } else {
        result += char;
      }
    }
    return result;
  }

  const itemMapping = {
    NightHarvester: 'SteadfastHeart',
    RedBuff: 'SunfireCape',
    GuardianAngel: 'EdgeOfNight',
    MadredsBloodrazor: 'GiantSlayer',
    FrozenHeart: 'ProtectorsVow',
    PowerGauntlet: 'Guardbreaker',
    Hullbreaker: 'Hullcrusher',
    Chalice: 'ChaliceOfPower',
    UnstableConcoction: 'HandOfJustice',
    Leviathan: 'NashorsTooth',
    RapidFireCannon: 'RedBuff',
    ZzRotPortal: 'ZzrotPortal',
    InkshadowTiger: 'TattooOfFury',
    InkshadowRat: 'TattooOfBombardment',
    InkshadowHorse: 'TattooOfForce',
    InkshadowOx: 'TattooOfVitality',
    InkshadowPig: 'TattooOfProtection',
    InkshadowSnake: 'TattooOfToxin',
    Moonstone: 'MoonstoneRenewer',
    // SpectralGauntlet: '',
    ForceOfNature: 'TacticiansCrown',
    TheCollector: 'GoldCollector',
    RadiantVirtue: 'VirtueOfTheMartyr',
  };

  function getImageUrl(itemName) {
    const baseUrl =
      // 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/maps/particles/tft/item_icons/';
      // 'https://rerollcdn.com/items/';
      'https://www.mobafire.com/images/tft/set11/item/icon/';

    itemName = itemName.split('Item_')[1];
    if (itemName.includes('Emblem')) {
      itemName = itemName.split('Item')[0];
    } else if (itemName.includes('Artifact')) {
      itemName = itemName.split('Artifact_')[1];
    } else if (itemName.includes('Ornn')) {
      itemName = itemName.split('Ornn')[1];
    } else if (itemName.includes('Radiant')) {
      itemName = itemName.split('Radiant')[0];
    }
    itemName = itemMapping[itemName] || itemName;
    console.log('pascal:', itemName);
    // console.log('snake:', pascalToSnakeCase(itemName));
    console.log('kebab:', pascalToKebab(itemName));

    return `${baseUrl}${pascalToKebab(itemName)}.png`;
  }

  return (
    <center className='back'>
      <div>
        <img
          className='logo'
          src='https://cdn.discordapp.com/attachments/411423022117945356/1237513676915998720/bisdle.png?ex=663bebec&is=663a9a6c&hm=0b617fd168f14251b1d4c874524a28566e08c83806b032897484353b96e49710&'
        />
        <h1>{currentMode}</h1>
        <p>(not rly bis but most frequent items placed on this unit in sojus last 10 games)</p>
        <button onClick={toggleMode}>{currentMode === 'Daily' ? 'Switch to Unlimited' : 'Switch to Daily'}</button>
        <button onClick={handleNewItems}>Get new BIS</button>
        <div>{loading ? 'Loading...' : ''}</div>
        <div id='results'></div>
        <input
          id='unitName'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputChange}
          placeholder='Enter champion name'
        />
        <button id='guessBtn' onClick={handleGuess}>
          Guess
        </button>
        <button id='answerBtn' onClick={handleAnswer}>
          Answer
        </button>
        <div id='feedback'>{feedback}</div>
        {suggestions.length > 0 && (
          <div id='autocomplete-list'>
            {suggestions.map((item, index) => (
              <div key={index} onClick={() => handleSelect(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </center>
  );
}
