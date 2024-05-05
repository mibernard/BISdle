import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const champions = [
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

export default function Home() {
  const [currentMode, setCurrentMode] = useState('daily');
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
    if (currentMode === 'daily') {
      setCurrentIndex(getTodayIndex());
    } else if (currentMode === 'unlimited' && currentIndex === null) {
      setCurrentIndex(getRandomIndex());
    }
    getTopItemsForChampion(currentIndex);
  }, [currentMode]);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleMode = () => {
    const newMode = currentMode === 'daily' ? 'unlimited' : 'daily';
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
    getTopItemsForChampion(currentIndex);
    setInput('');
    setFeedback('');
  };

  const handleGuess = () => {
    if (!unitName) return;
    console.log('current index:', currentIndex, 'champions[currentIndex]:', champions[currentIndex]);
    const isCorrect = input.toLowerCase() === unitName.toLowerCase().split('_')[1];
    console.log('input:', input.toLowerCase(), 'unitName:', unitName.toLowerCase().split('_')[1]);
    if (isCorrect) {
      setFeedback(`Correct! It is ${unitName.split('_')[1]}.`);
    } else {
      setFeedback(`It is not ${input}, try again!`);
      setIncorrectGuesses([...incorrectGuesses, unitName]);
    }
    setInput('');
    setGuessedChampions([...guessedChampions, unitName.toLowerCase()]);
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
    // if (!itemData || Object.keys(itemData).length === 0) {
    //   console.log('No item data available', index);
    //   return;
    // }
    const championNames = Object.keys(itemData);
    const championName = championNames[index];
    setUnitName(championName);
    console.log('unitName', unitName);
    const items = itemData[championName];
    console.log('championName', championName);
    console.log('items', items);

    if (!items || Object.keys(items).length === 0) {
      console.log(`No items data available for ${championName}`);
      return { championName, topThreeItems: [] };
    }
    const sortedItems = Object.entries(items).sort((a, b) => b[1] - a[1]);
    const topThreeItems = sortedItems.slice(0, 3).map((item) => item[0]);

    const container = document.getElementById('results');
    container.innerHTML = ''; // Clear previous items
    topThreeItems.forEach((item) => {
      const para = document.createElement('p');
      para.textContent = item;
      container.appendChild(para);
    });
    console.log(`Top 3 items for ${championName}:`, topThreeItems);
    return { championName, topThreeItems };
  };

  return (
    <div className={styles.container}>
      <h1>BISdle - {currentMode}</h1>
      <button onClick={toggleMode}>{currentMode === 'daily' ? 'Switch to Unlimited' : 'Switch to Daily'}</button>
      <button onClick={handleNewItems}>Get new BIS</button>
      <div>{loading ? 'Loading...' : 'fetched'}</div>
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
      <div>{feedback}</div>
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
  );
}
