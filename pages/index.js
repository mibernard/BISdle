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
    if (currentMode === 'daily') {
      calculateTodayIndex();
    } else {
      // handler(currentIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentMode === 'unlimited') {
      setCurrentIndex(getRandomIndex());
    }
  }, [currentMode]);

  const toggleMode = () => {
    const newMode = currentMode === 'daily' ? 'unlimited' : 'daily';
    setCurrentMode(newMode);
    setFeedback('');
    setIncorrectGuesses([]);
    setGuessedChampions([]);
  };

  const handleInputChange = (event) => {
    const input = event.target.value.toLowerCase();
    setUnitName(input);
    if (!input) return;
  };

  const handleGuess = () => {
    if (!unitName) return;
    const isCorrect = unitName.toLowerCase() === champions[currentIndex].toLowerCase();
    if (isCorrect) {
      setFeedback(`Correct! It was ${champions[currentIndex]}.`);
    } else {
      setFeedback('Incorrect, try again!');
      setIncorrectGuesses([...incorrectGuesses, unitName]);
    }
    setUnitName('');
    setGuessedChampions([...guessedChampions, unitName.toLowerCase()]);
  };

  function calculateTodayIndex() {
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    let num = Math.round(((day + 7) / month) * 3913).toString();
    const todayIndex = +num[4] + num[3];
    if (todayIndex > champions.length - 1) {
      setCurrentIndex(todayIndex - 59);
    } else {
      setCurrentIndex(todayIndex);
    }
    console.log('Daily Champion:', champions[todayIndex]);
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

  // Handle input change
  const handleChange = (event) => {
    setInput(event.target.value.toLowerCase());
  };

  // Handle selecting a suggestion
  const handleSelect = (champion) => {
    setInput(champion); // Set input to the selected champion
    setGuessedChampions((prev) => [...prev, champion.toLowerCase()]); // Add to guessed list
    setSuggestions([]); // Clear suggestions
    // Trigger guess handling logic here if needed
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching item data:', error);
      setLoading(false);
    }
    getTopItemsForChampion(getRandomIndex());
  };

  const getTopItemsForChampion = (index) => {
    if (!itemData || Object.keys(itemData).length === 0) {
      console.log('No item data available', index);
      return;
    }
    const championNames = Object.keys(itemData);
    const championName = championNames[index];
    const items = itemData[championName];

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
      <button onClick={() => fetchData()}>Get new BIS</button>
      <div>{loading ? 'Loading...' : 'fetched'}</div>
      <div id='results'></div>
      <input id='unitName' value={input} onChange={handleChange} placeholder='Enter champion name' />
      <button onClick={handleGuess}>Guess</button>
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