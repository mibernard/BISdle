import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import championNames from '../lib/champions.js';
import JSConfetti from 'js-confetti';
import Head from 'next/head';

export default function Home() {
  const [currentMode, setCurrentMode] = useState('Daily');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [guessedChampions, setGuessedChampions] = useState([]);
  const [unitName, setUnitName] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [itemData, setItemData] = useState({}); // State to store item data
  const [clickPending, setClickPending] = useState(false);
  const [modalOpen, setModalOpen] = useState(true);
  const [guessCount, setGuessCount] = useState(0);
  const modalRef = useRef(null);

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
    setFeedback([]);
    setInput('');
    setGuessedChampions([]);
    setGuessCount(0);
  };

  const handleInputChange = (event) => {
    const input = event.target.value.toLowerCase();
    setInput(event.target.value);
    if (!input) return;
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      if (suggestions.length > 0) {
        // Select the top suggestion if it exists
        handleSelect(suggestions[0]);
      } else {
        // If no suggestions, proceed with current input
        document.getElementById('guessBtn').click();
      }
    }
  };

  const handleNewItems = () => {
    setCurrentIndex(getRandomIndex());
    console.log('current index:', currentIndex);
    setInput('');
    setFeedback([]);
    setGuessedChampions([]);
    setGuessCount(0);
    getTopItemsForChampion(currentIndex);
  };

  const isValidChampionName = (input) => {
    return championNames.some((champion) => champion.toLowerCase() === input.toLowerCase());
  };

  const handleGuess = () => {
    if (!unitName) return;
    const isCorrect = input.toLowerCase() === unitName.toLowerCase().split('_')[1];
    setGuessCount((prevCount) => prevCount + 1);
    setGuessedChampions((prev) => [...prev, input.toLowerCase()]); // Add to guessed list

    const newFeedback = {
      text: isCorrect
        ? `Correct! It is ${unitName.split('_')[1]}. It took you ${guessCount + 1} ${
            guessCount + 1 > 1 ? 'tries' : 'try'
          }.`
        : `It is not ${input}, try again!`,
      isCorrect: isCorrect,
      color: isCorrect ? 'lightgreen' : 'salmon'
    };

    if (isCorrect) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸']
      });
      document.getElementById('unitInput').blur();
    } else {
      document.getElementById('unitInput').focus();
    }

    setFeedback((prevFeedback) => [...prevFeedback, newFeedback]);
    setInput('');
  };

  const handleListChamps = () => {
    window.open('https://tftactics.gg/champions/', '_blank');
  };

  const handleHint = () => {
    const hint = {
      text: `The champion's name starts with ${unitName.split('_')[1].charAt(0).toUpperCase()}`,
      isCorrect: false, // Assuming false since it's a hint, not a correct or incorrect guess
      color: 'lightblue' // Specific color for hints
    };
    setFeedback((prevFeedback) => [...prevFeedback, hint]);
  };

  const handleAnswer = () => {
    const answer = {
      text: `The champion's name is ${unitName.split('_')[1]}`,
      isCorrect: true, // You can decide whether to mark this as correct or simply informational
      color: 'lavender' // Specific color for answers
    };
    setFeedback((prevFeedback) => [...prevFeedback, answer]);
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
    const filtered = championNames.filter(
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
      if (!event.target.matches('#unitInput')) {
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
    // const baseUrl = 'https://cdn.matches.lol/latest/img/tft-item/';
    // const baseUrl = 'https://rerollcdn.com/items/';
    const baseUrl = 'https://cdn.teamfight.lol/tft/item/TFTSet13/';
    const parts = itemName.split('_');
    const splitItemName = parts.slice(2).join('_');

    // return `${baseUrl}${splitItemName}.png`;
    return `${baseUrl}${itemName}.png`;
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        console.log('Clicked outside modal');
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [modalOpen]);

  return (
    <>
      <Head>
        <title>BISdle - TFT Champion Guessing Game</title>
        <meta
          name='description'
          content='Play BISdle, the ultimate guessing game for Teamfight Tactics fans! Guess the champion based on BIS items and test your TFT knowledge!'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' />
      </Head>
      <div className='app'>
        <div className='logo'></div>
        {/* <h1>{`BISdle ${currentMode}`}</h1> */}

        <Modal isOpen={modalOpen} onClose={handleCloseModal} ref={modalRef}>
          <h2>How to Play</h2>
          {/* <hr></hr> */}
          <p>Welcome to BISdle! Here's how you play:</p>
          <ul>
            <li>
              Guess today's champion from Riot's game "Teamfight Tactics" using the champion's BIS (best-in-slot) item
              combination!
            </li>
            <li>The daily champion changes every 24 hours.</li>
            <li>The item combination is taken from challenger games and may not be true BIS.</li>
            <li>Use a hint if you're stuck or press answer if you give up.</li>
            <li>If you want to keep playing, switch to Unlimited Mode!</li>
            <li>Have fun and test your TFT knowledge!</li>
          </ul>
        </Modal>
        <button onClick={handleOpenModal}>How to Play</button>
        <button onClick={toggleMode}>
          {currentMode === 'Daily' ? 'Switch to Unlimited Mode' : 'Switch to Daily Mode'}
        </button>
        {/* <p>Guess the Set 12 Teamfight Tactics champion given its best-in-slot (BIS) item combination!</p> */}
        {/* <p>(not rly BIS but most frequently slammed items in a few recent challenger games)</p> */}

        {currentMode === 'Unlimited' && <button onClick={handleNewItems}>Get new BIS</button>}
        <div>{loading ? 'Loading...' : ''}</div>
        <div id='itemImgContainer'></div>
        <div id='guessContainer'>
          <input
            id='unitInput'
            name='myText'
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputChange}
            placeholder='Enter champion name'
            autoComplete='off'
          />
          {suggestions.length > 0 && (
            <div id='autocomplete-list'>
              {suggestions.map((item, index) => (
                <div className='Champion' key={index} onClick={() => handleSelect(item)}>
                  {item}
                </div>
              ))}
            </div>
          )}
          <button id='guessBtn' onClick={handleGuess} disabled={!isValidChampionName(input)}>
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

        <div id='feedback' style={{ whiteSpace: 'pre-wrap' }}>
          {feedback.map((f, index) => (
            <div key={index} style={{ color: f.color || 'inherit' }}>
              {f.text}
            </div>
          ))}
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
