import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
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
  'Kayle',
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
  'Zyra'
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
  const [clickPending, setClickPending] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);

  // This useEffect handles data fetching independently
  useEffect(() => {
    fetchData();
  }, []); // Run only once on component mount

  // This useEffect handles setting the index based on the mode
  useEffect(() => {
    let index = 0;
    if (currentMode === 'Daily') {
      index = getTodayIndex();
    } else if (currentMode === 'Unlimited') {
      index = getRandomIndex();
    }
    setCurrentIndex(index);
  }, [currentMode, itemData]); // Depend on currentMode and itemData

  // This useEffect handles displaying items once everything is ready
  useEffect(() => {
    if (currentIndex !== null && itemData && Object.keys(itemData).length > 0) {
      getTopItemsForChampion(currentIndex);
    }
  }, [currentIndex, itemData]); // Run when currentIndex or itemData changes

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
    console.log('current index:', currentIndex);
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
      document.getElementById('unitName').blur();
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

  const handleListChamps = () => {
    window.open('https://tftactics.gg/champions/', '_blank');
  };

  const handleHint = () => {
    document.getElementById('feedback').style.color = '#fffbe6';
    setFeedback(`The champion's name starts with ${unitName.split('_')[1].charAt(0).toUpperCase()}`);
  };

  const handleAnswer = () => {
    document.getElementById('feedback').style.color = '#fffbe6';
    setFeedback(`The champion's name is ${unitName.split('_')[1]}`);
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

    console.log('todayIndex before if:', todayIndex);
    console.log('Object.keys(itemData).length:', Object.keys(itemData).length);

    if (todayIndex > Object.keys(itemData).length) {
      todayIndex = todayIndex % Object.keys(itemData).length;
      console.log('todayIndex inside if:', todayIndex);
    }

    // console.log('champions.length:', champions.length);
    console.log('todayIndex:', todayIndex);
    // console.log('currentIndex:', currentIndex);
    // console.log('Daily Champion:', champions[currentIndex]);

    return todayIndex;
  }

  function getRandomIndex() {
    const max = Object.keys(itemData).length; // Adjust if your champion list size is different
    let randomIndex = Math.floor(Math.random() * max);
    console.log('randomIndex:', randomIndex);
    return randomIndex;
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

  const handleSelect = (champion) => {
    setInput(champion); // Set input to the selected champion
    console.log('champion', champion);
    setGuessedChampions((prev) => [...prev, champion.toLowerCase()]); // Add to guessed list
    setSuggestions([]); // Clear suggestions
    setClickPending(true); // Set the flag to trigger the click
  };

  //makes sure guessBtn is always clicked after setInput is completeled since it is async
  useEffect(() => {
    if (clickPending) {
      document.getElementById('guessBtn').click();
      setClickPending(false); // Reset the flag after the click
    }
  }, [clickPending]);

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
      setItemData(data.data); // Set item data here
      console.log('itemData:', data.data);
    } catch (error) {
      console.error('Error fetching item data:', error);
    } finally {
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

    setUnitName(championName);
    const items = itemData[championName];
    // console.log('unitName', unitName);
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

    const container = document.getElementById('itemImgContainer');
    container.innerHTML = ''; // Clear previous items
    topThreeItems.forEach((item) => {
      const imgElement = document.createElement('img');
      imgElement.src = getImageUrl(item);
      imgElement.alt = item;
      imgElement.className = 'itemImg';
      // imgElement.style.width = '100px';
      imgElement.style.border = 'solid 3px #c8aa6d';
      imgElement.style.margin = '6px'; // Set image width
      container.appendChild(imgElement);
    });
    console.log(`Top 3 items for ${championName}:`, topThreeItems.map(getImageUrl));
    return { championName, topThreeItems };
  };

  function getImageUrl(itemName) {
    const baseUrl = 'https://cdn.matches.lol/latest/img/tft-item/';
    return `${baseUrl}${itemName}.png`;
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <center className='back'>
      <div>
        <div className='logo'></div>
        <h1>{`BIS-dle ${currentMode}`}</h1>
        <button onClick={handleOpenModal}>How to Play</button>
        <Modal isOpen={modalOpen} onClose={handleCloseModal}>
          <h2>How to Play</h2>
          <p>Welcome to the game! Here's how you play:</p>
          <ul>
            <li>Guess the right champion give the triple item combination.</li>
            <li>Use hints if you're stuck.</li>
            <li>Have fun and test your TFT knowledge!</li>
          </ul>
        </Modal>
        <p>Guess the Set 11 Teamfight Tactics champion given its best-in-slot (BIS) item combination!</p>
        <p>(not rly BIS but most frequently slammed items in a few recent challenger games)</p>
        <button onClick={toggleMode}>
          {currentMode === 'Daily' ? 'Switch to Unlimited Mode' : 'Switch to Daily Mode'}
        </button>
        {currentMode === 'Unlimited' && <button onClick={handleNewItems}>Get new BIS</button>}
        <div>{loading ? 'Loading...' : ''}</div>
        <div id='itemImgContainer'></div>
        <div id='guessContainer'>
          <input
            id='unitName'
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputChange}
            placeholder='Enter champion name'
            autoComplete='off'
          />
          <button id='guessBtn' onClick={handleGuess}>
            Guess
          </button>
        </div>

        <div id='hintsContainer'>
          <button id='listChampsBtn' onClick={handleListChamps}>
            All TFT Champions
          </button>
          <button id='hintBtn' onClick={handleHint}>
            Hint
          </button>
          <button id='answerBtn' onClick={handleAnswer}>
            Answer
          </button>
        </div>

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
