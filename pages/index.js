import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import championNames from '../lib/champions.js';
import championData from '../lib/championData.js';
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
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [dailyStats, setDailyStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    hintsUsed: 0,
    answersUsed: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 }
  });
  const [unlimitedStats, setUnlimitedStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    hintsUsed: 0,
    answersUsed: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 }
  });
  const [countdown, setCountdown] = useState('');
  const [hintUsed, setHintUsed] = useState(false);
  const [answerUsed, setAnswerUsed] = useState(false);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const [itemImageMap, setItemImageMap] = useState({});
  const [championImageMap, setChampionImageMap] = useState({});
  const [traitImageMap, setTraitImageMap] = useState({});
  const modalRef = useRef(null);
  const hasLoadedDailyState = useRef(false);

  // Load stats from localStorage
  useEffect(() => {
    const savedDailyStats = localStorage.getItem('bisdleDailyStats');
    const savedUnlimitedStats = localStorage.getItem('bisdleUnlimitedStats');

    if (savedDailyStats) {
      const parsed = JSON.parse(savedDailyStats);
      // Ensure all fields exist (for backward compatibility)
      setDailyStats({
        gamesPlayed: parsed.gamesPlayed || 0,
        gamesWon: parsed.gamesWon || 0,
        currentStreak: parsed.currentStreak || 0,
        maxStreak: parsed.maxStreak || 0,
        hintsUsed: parsed.hintsUsed || 0,
        answersUsed: parsed.answersUsed || 0,
        guessDistribution: parsed.guessDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 }
      });
    }

    if (savedUnlimitedStats) {
      const parsed = JSON.parse(savedUnlimitedStats);
      // Ensure all fields exist (for backward compatibility)
      setUnlimitedStats({
        gamesPlayed: parsed.gamesPlayed || 0,
        gamesWon: parsed.gamesWon || 0,
        currentStreak: parsed.currentStreak || 0,
        maxStreak: parsed.maxStreak || 0,
        hintsUsed: parsed.hintsUsed || 0,
        answersUsed: parsed.answersUsed || 0,
        guessDistribution: parsed.guessDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 }
      });
    }
  }, []);

  // Save daily stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bisdleDailyStats', JSON.stringify(dailyStats));
  }, [dailyStats]);

  // Save unlimited stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bisdleUnlimitedStats', JSON.stringify(unlimitedStats));
  }, [unlimitedStats]);

  // Load and save daily game state (for persistence across page refreshes)
  useEffect(() => {
    console.log(
      '📥 Load useEffect triggered. Mode:',
      currentMode,
      'Index:',
      currentIndex,
      'LoadFlag:',
      hasLoadedDailyState.current
    );

    // Only attempt to load if we have a valid index (not null and not NaN)
    if (currentMode === 'Daily' && currentIndex !== null && !isNaN(currentIndex) && !hasLoadedDailyState.current) {
      const today = new Date().toDateString();
      const savedDailyState = localStorage.getItem('bisdleDailyGameState');

      console.log('Attempting to load daily state. Current index:', currentIndex, 'Today:', today);

      if (savedDailyState) {
        try {
          const parsedState = JSON.parse(savedDailyState);
          console.log('Found saved state:', parsedState);

          // Check if the saved state is from today and for the same champion
          if (parsedState.date === today && parsedState.championIndex === currentIndex) {
            console.log('✅ Loading saved daily state for today');
            // Restore the saved state
            setFeedback(parsedState.feedback || []);
            setGuessedChampions(parsedState.guessedChampions || []);
            setGuessCount(parsedState.guessCount || 0);
            setHintUsed(parsedState.hintUsed || false);
            setAnswerUsed(parsedState.answerUsed || false);
            setDailyCompleted(parsedState.dailyCompleted || false);
          } else {
            console.log(
              '❌ Saved state is for different date or champion. Saved date:',
              parsedState.date,
              'Saved index:',
              parsedState.championIndex
            );
          }
        } catch (e) {
          console.error('Error parsing saved state:', e);
        }
      } else {
        console.log('No saved daily state found - starting fresh');
      }

      // Always mark as loaded after attempting to load
      hasLoadedDailyState.current = true;
      console.log('Daily state load complete. Flag set to true.');
    }
  }, [currentMode, currentIndex]);

  // Save daily game state whenever it changes
  useEffect(() => {
    if (currentMode === 'Daily' && currentIndex !== null && !isNaN(currentIndex) && hasLoadedDailyState.current) {
      const today = new Date().toDateString();
      const dailyGameState = {
        date: today,
        championIndex: currentIndex,
        feedback: feedback,
        guessedChampions: guessedChampions,
        guessCount: guessCount,
        hintUsed: hintUsed,
        answerUsed: answerUsed,
        dailyCompleted: dailyCompleted
      };
      console.log('💾 Saving daily state:', {
        date: dailyGameState.date,
        championIndex: dailyGameState.championIndex,
        feedbackCount: dailyGameState.feedback.length,
        guessCount: dailyGameState.guessCount,
        completed: dailyGameState.dailyCompleted
      });
      localStorage.setItem('bisdleDailyGameState', JSON.stringify(dailyGameState));
    } else {
      console.log(
        '⏸️ Skipping save. Mode:',
        currentMode,
        'Index:',
        currentIndex,
        'LoadFlag:',
        hasLoadedDailyState.current
      );
    }
  }, [currentMode, currentIndex, feedback, guessedChampions, guessCount, hintUsed, answerUsed, dailyCompleted]);

  // Countdown timer for daily reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Midnight tonight/tomorrow

      const diff = tomorrow - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
          .toString()
          .padStart(2, '0')}`
      );
    };

    updateCountdown(); // Initial call
    const interval = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // This useEffect handles data fetching independently
  useEffect(() => {
    fetchData();
    fetchDataDragonItems();
    fetchDataDragonChampions();
    fetchDataDragonTraits();
  }, []); // Run only once on component mount

  // This useEffect handles setting the index based on the mode
  useEffect(() => {
    let index = 0;
    if (currentMode === 'Daily') {
      index = getTodayIndex();
      console.log('🎯 Setting daily index:', index);
    } else if (currentMode === 'Unlimited') {
      index = getRandomIndex();
      console.log('🎲 Setting unlimited index:', index);
    }
    setCurrentIndex(index);
  }, [currentMode, itemData]); // Depend on currentMode and itemData

  // This useEffect handles displaying items once everything is ready
  useEffect(() => {
    if (currentIndex !== null && itemData && Object.keys(itemData).length > 0 && Object.keys(itemImageMap).length > 0) {
      getTopItemsForChampion(currentIndex);
    }
  }, [currentIndex, itemData, itemImageMap]); // Run when currentIndex, itemData, or itemImageMap changes

  const toggleMode = () => {
    const newMode = currentMode === 'Daily' ? 'Unlimited' : 'Daily';
    setCurrentMode(newMode);

    // If switching to Unlimited, reset everything
    if (newMode === 'Unlimited') {
      setFeedback([]);
      setInput('');
      setGuessedChampions([]);
      setGuessCount(0);
      setHintUsed(false);
      setAnswerUsed(false);
      setDailyCompleted(false);
      hasLoadedDailyState.current = false;
    } else {
      // Switching to Daily - reset the flag so state can be loaded
      hasLoadedDailyState.current = false;
    }
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
    setHintUsed(false);
    setAnswerUsed(false);
    getTopItemsForChampion(currentIndex);
  };

  const isValidChampionName = (input) => {
    return championNames.some((champion) => champion.toLowerCase() === input.toLowerCase());
  };

  const handleGuess = () => {
    if (!unitName) return;

    // Prevent guessing if in Daily mode and already completed
    if (currentMode === 'Daily' && dailyCompleted) {
      return;
    }

    const isCorrect = input.toLowerCase() === unitName.toLowerCase().split('_')[1];
    setGuessCount((prevCount) => prevCount + 1);
    setGuessedChampions((prev) => [...prev, input.toLowerCase()]); // Add to guessed list

    // Get the guessed champion's image URL
    const guessedChampName = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    const guessedChampImageUrl = championImageMap[guessedChampName] || '';

    const newFeedback = {
      text: isCorrect
        ? `Correct! It is ${unitName.split('_')[1]}. It took you ${guessCount + 1} ${
            guessCount + 1 > 1 ? 'tries!' : 'try!'
          }`
        : `It is not ${guessedChampName}, try again!`,
      isCorrect: isCorrect,
      color: isCorrect ? 'lightgreen' : 'salmon',
      guessChampionImageUrl: guessedChampImageUrl,
      isGuess: true,
      showCountdown: isCorrect && currentMode === 'Daily'
    };

    if (isCorrect) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸']
      });
      document.getElementById('unitInput').blur();

      // Mark daily as completed if in Daily mode
      if (currentMode === 'Daily') {
        setDailyCompleted(true);
      }

      // Only update stats if the answer wasn't revealed
      if (!answerUsed) {
        const guesses = guessCount + 1;
        const guessKey = guesses <= 5 ? guesses : '6+';

        // Update the appropriate stats based on current mode
        if (currentMode === 'Daily') {
          setDailyStats((prevStats) => ({
            gamesPlayed: prevStats.gamesPlayed + 1,
            gamesWon: prevStats.gamesWon + 1,
            currentStreak: prevStats.currentStreak + 1,
            maxStreak: Math.max(prevStats.currentStreak + 1, prevStats.maxStreak),
            guessDistribution: {
              ...prevStats.guessDistribution,
              [guessKey]: prevStats.guessDistribution[guessKey] + 1
            }
          }));
        } else {
          setUnlimitedStats((prevStats) => ({
            gamesPlayed: prevStats.gamesPlayed + 1,
            gamesWon: prevStats.gamesWon + 1,
            currentStreak: prevStats.currentStreak + 1,
            maxStreak: Math.max(prevStats.currentStreak + 1, prevStats.maxStreak),
            guessDistribution: {
              ...prevStats.guessDistribution,
              [guessKey]: prevStats.guessDistribution[guessKey] + 1
            }
          }));
        }
      }
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
    if (hintUsed) {
      const hint = {
        text: "You've already used your hint for this champion!",
        isCorrect: false,
        color: 'orange'
      };
      setFeedback((prevFeedback) => [...prevFeedback, hint]);
      return;
    }

    const championName = unitName.split('_')[1];
    const championInfo = championData[championName];

    let hintText = '';
    let emblemUrl = '';
    if (championInfo && championInfo.classes) {
      const classes = championInfo.classes;
      if (classes.length > 0) {
        // Randomly select a class from the available classes
        const randomIndex = Math.floor(Math.random() * classes.length);
        const className = classes[randomIndex];
        hintText = `${className}`;
        // Get trait image from Data Dragon
        emblemUrl = traitImageMap[className] || traitImageMap[className.replace(/\s+/g, '')] || '';
        console.log('Class name:', className, 'Class URL:', emblemUrl);
      } else {
        // No classes available (empty array)
        hintText = 'The champion has no class';
      }
    } else {
      // No champion data available
      hintText = 'The champion has no class';
    }

    const hint = {
      text: hintText,
      isCorrect: false,
      color: 'lightblue',
      emblemUrl,
      isHint: true // Always mark as hint so it uses styled container
    };
    setFeedback((prevFeedback) => [...prevFeedback, hint]);
    setHintUsed(true);

    // Increment hints used counter based on current mode
    if (currentMode === 'Daily') {
      setDailyStats((prevStats) => ({
        ...prevStats,
        hintsUsed: prevStats.hintsUsed + 1
      }));
    } else {
      setUnlimitedStats((prevStats) => ({
        ...prevStats,
        hintsUsed: prevStats.hintsUsed + 1
      }));
    }
  };

  const handleAnswer = () => {
    if (answerUsed) {
      const alreadyAnswered = {
        text: "You've already revealed the answer!",
        isCorrect: false,
        color: 'orange'
      };
      setFeedback((prevFeedback) => [...prevFeedback, alreadyAnswered]);
      return;
    }

    const championName = unitName.split('_')[1];
    console.log('Champion name:', championName);
    console.log('Champion image map keys:', Object.keys(championImageMap));

    // Try different variations of the champion name
    let championImageUrl =
      championImageMap[championName] ||
      championImageMap[`TFT13_${championName}`] ||
      championImageMap[`TFT_TrainingDummy`] ||
      '';

    console.log('Champion image URL:', championImageUrl);

    const answer = {
      text: championName,
      isCorrect: true,
      color: 'lavender',
      championImageUrl
    };
    setFeedback((prevFeedback) => [...prevFeedback, answer]);
    setAnswerUsed(true);

    // Increment answers used counter based on current mode
    if (currentMode === 'Daily') {
      setDailyStats((prevStats) => ({
        ...prevStats,
        answersUsed: prevStats.answersUsed + 1
      }));
    } else {
      setUnlimitedStats((prevStats) => ({
        ...prevStats,
        answersUsed: prevStats.answersUsed + 1
      }));
    }
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

  // Fetch TFT item images from Data Dragon
  const fetchDataDragonItems = async () => {
    try {
      // 1. Get latest version
      const versionsRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await versionsRes.json();
      const latestVersion = versions[0];
      console.log('Data Dragon version:', latestVersion);

      // 2. Fetch TFT items data
      const itemsRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/tft-item.json`);
      const itemsData = await itemsRes.json();

      // 3. Build item name → image URL map
      const imageMap = {};
      Object.values(itemsData.data).forEach((item) => {
        // Map item ID (e.g., "TFT_Item_BFSword") to image URL
        imageMap[item.id] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/tft-item/${item.image.full}`;
      });

      setItemImageMap(imageMap);
      console.log('Loaded Data Dragon item images:', Object.keys(imageMap).length);
    } catch (error) {
      console.error('Failed to load Data Dragon items:', error);
    }
  };

  // Fetch TFT champion images from Data Dragon
  const fetchDataDragonChampions = async () => {
    try {
      // 1. Get latest version
      const versionsRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await versionsRes.json();
      const latestVersion = versions[0];
      console.log('Data Dragon version for champions:', latestVersion);

      // 2. Fetch TFT champions data
      const championsRes = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/tft-champion.json`
      );
      const championsData = await championsRes.json();

      // 3. Build champion name → image URL map
      const champImageMap = {};
      Object.values(championsData.data).forEach((champ) => {
        // Map champion ID to image URL
        champImageMap[
          champ.id
        ] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/tft-champion/${champ.image.full}`;
        // Also map the champion name without the TFT prefix for easier lookup
        const simpleName = champ.id.replace(/^TFT\d*_/, '');
        champImageMap[
          simpleName
        ] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/tft-champion/${champ.image.full}`;
      });

      setChampionImageMap(champImageMap);
      console.log('Loaded Data Dragon champion images:', Object.keys(champImageMap).length);
      console.log('Sample champion keys:', Object.keys(champImageMap).slice(0, 10));
    } catch (error) {
      console.error('Failed to load Data Dragon champions:', error);
    }
  };

  // Fetch TFT trait images from Data Dragon
  const fetchDataDragonTraits = async () => {
    try {
      // 1. Get latest version
      const versionsRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      const versions = await versionsRes.json();
      const latestVersion = versions[0];
      console.log('Data Dragon version for traits:', latestVersion);

      // 2. Fetch TFT traits data
      const traitsRes = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/tft-trait.json`
      );
      const traitsData = await traitsRes.json();

      // 3. Build trait name → image URL map
      const traitImgMap = {};
      Object.values(traitsData.data).forEach((trait) => {
        // Map trait name to image URL
        traitImgMap[
          trait.name
        ] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/tft-trait/${trait.image.full}`;
        // Also try mapping without spaces for easier lookup
        const nameWithoutSpaces = trait.name.replace(/\s+/g, '');
        traitImgMap[
          nameWithoutSpaces
        ] = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/tft-trait/${trait.image.full}`;
      });

      setTraitImageMap(traitImgMap);
      console.log('Loaded Data Dragon trait images:', Object.keys(traitImgMap).length);
      console.log('Sample trait keys:', Object.keys(traitImgMap).slice(0, 10));
    } catch (error) {
      console.error('Failed to load Data Dragon traits:', error);
    }
  };

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

  const getTopItemsForChampion = async (index) => {
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

    // Validate items and get next valid items if 404s occur
    const validItems = [];
    let itemIndex = 0;

    while (validItems.length < 3 && itemIndex < sortedItems.length) {
      const item = sortedItems[itemIndex][0];
      const imageUrl = getImageUrl(item);

      // Check if image exists
      const isValid = await checkImageExists(imageUrl);
      if (isValid) {
        validItems.push(item);
      } else {
        console.log(`Image not found for ${item}, trying next item...`);
      }
      itemIndex++;
    }

    const container = document.getElementById('itemImgContainer');
    container.innerHTML = ''; // Clear previous items
    validItems.forEach((item) => {
      const imgElement = document.createElement('img');
      imgElement.src = getImageUrl(item);
      imgElement.alt = item;
      imgElement.className = 'itemImg';
      // imgElement.style.width = '100px';
      imgElement.style.border = 'solid 3px #c8aa6d';
      imgElement.style.margin = '6px'; // Set image width
      container.appendChild(imgElement);
    });
    console.log(`Top 3 valid items for ${championName}:`, validItems.map(getImageUrl));
    return { championName, topThreeItems: validItems };
  };

  // Helper function to check if image exists
  const checkImageExists = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  function getImageUrl(itemName) {
    // First, try Data Dragon (official Riot CDN)
    if (itemImageMap[itemName]) {
      return itemImageMap[itemName];
    }

    // Fallback to CommunityDragon for missing items
    const cdnBaseUrl = 'https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/';
    const parts = itemName.split('_');
    const cleanName = parts.slice(2).join('_'); // Remove TFT_Item_ prefix

    // Try to construct CommunityDragon URL (lowercase with underscores)
    return `${cdnBaseUrl}${cleanName.toLowerCase()}.png`;
  }

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenStatsModal = () => {
    setStatsModalOpen(true);
  };

  const handleCloseStatsModal = () => {
    setStatsModalOpen(false);
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
        {/* Navbar */}
        <nav className='navbar'>
          <button className='nav-icon-btn' onClick={handleOpenModal} title='How to Play'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10'></circle>
              <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'></path>
              <line x1='12' y1='17' x2='12.01' y2='17'></line>
            </svg>
          </button>
          <button className='nav-icon-btn' onClick={handleOpenStatsModal} title='Statistics'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='18' y1='20' x2='18' y2='10'></line>
              <line x1='12' y1='20' x2='12' y2='4'></line>
              <line x1='6' y1='20' x2='6' y2='14'></line>
            </svg>
          </button>
        </nav>

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
            <li>Use a hint to reveal the champion's class, or press answer if you give up.</li>
            <li>If you want to keep playing, switch to Unlimited Mode!</li>
            <li>Have fun and test your TFT knowledge!</li>
          </ul>
          <div className='daily-reset-timer'>
            <div className='timer-label'>Next Daily Champion In:</div>
            <div className='timer-countdown'>{countdown}</div>
          </div>
        </Modal>

        <Modal isOpen={statsModalOpen} onClose={handleCloseStatsModal} ref={modalRef}>
          <h2>Statistics - {currentMode}</h2>
          <div className='stats-container'>
            <div className='stats-grid'>
              <div className='stat-item'>
                <div className='stat-value'>
                  {currentMode === 'Daily' ? dailyStats.gamesPlayed : unlimitedStats.gamesPlayed}
                </div>
                <div className='stat-label'>Played</div>
              </div>
              <div className='stat-item'>
                <div className='stat-value'>
                  {currentMode === 'Daily' ? dailyStats.hintsUsed : unlimitedStats.hintsUsed}
                </div>
                <div className='stat-label'>Hints Used</div>
              </div>
              <div className='stat-item'>
                <div className='stat-value'>
                  {currentMode === 'Daily' ? dailyStats.answersUsed : unlimitedStats.answersUsed}
                </div>
                <div className='stat-label'>Answers Used</div>
              </div>
              <div className='stat-item'>
                <div className='stat-value'>
                  {currentMode === 'Daily' ? dailyStats.currentStreak : unlimitedStats.currentStreak}
                </div>
                <div className='stat-label'>Current Streak</div>
              </div>
              <div className='stat-item'>
                <div className='stat-value'>
                  {currentMode === 'Daily' ? dailyStats.maxStreak : unlimitedStats.maxStreak}
                </div>
                <div className='stat-label'>Max Streak</div>
              </div>
            </div>
            <div className='guess-distribution'>
              <h3>Guess Distribution</h3>
              {Object.entries(
                currentMode === 'Daily' ? dailyStats.guessDistribution : unlimitedStats.guessDistribution
              ).map(([guesses, count]) => {
                const currentStats = currentMode === 'Daily' ? dailyStats : unlimitedStats;
                const maxCount = Math.max(...Object.values(currentStats.guessDistribution));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={guesses} className='distribution-row'>
                    <div className='distribution-label'>{guesses}</div>
                    <div className='distribution-bar-container'>
                      <div
                        className='distribution-bar'
                        style={{ width: `${percentage}%`, minWidth: count > 0 ? '20px' : '0' }}
                      >
                        {count > 0 && <span className='distribution-count'>{count}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>

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
            placeholder='Enter champion name...'
            autoComplete='off'
            disabled={currentMode === 'Daily' && dailyCompleted}
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
          <button
            id='guessBtn'
            onClick={handleGuess}
            disabled={!isValidChampionName(input) || (currentMode === 'Daily' && dailyCompleted)}
          >
            Guess
          </button>
        </div>

        <div id='hintsContainer'>
          <button
            id='hintBtn'
            onClick={handleHint}
            disabled={hintUsed}
            title={hintUsed ? 'Hint already used' : 'Reveal class hint'}
          >
            Hint
          </button>
          <button
            id='answerBtn'
            onClick={handleAnswer}
            disabled={answerUsed}
            title={answerUsed ? 'Answer already revealed' : 'Reveal champion'}
          >
            Answer
          </button>
        </div>

        <div className='listChampsBtnContainer'>
          <button id='listChampsBtn' onClick={handleListChamps}>
            All TFT Champions
          </button>
        </div>
        <div id='feedback' style={{ whiteSpace: 'pre-wrap' }}>
          {feedback.map((f, index) => (
            <div key={index} style={{ color: f.color || 'inherit' }}>
              {f.isHint ? (
                <div className='hint-box'>
                  {f.emblemUrl && (
                    <img className='emblem' src={f.emblemUrl} alt='Class Emblem' width={40} height={40} />
                  )}
                  <span className='hint-text'>{f.emblemUrl ? `The champion's class is ${f.text}` : f.text}</span>
                </div>
              ) : f.hasOwnProperty('championImageUrl') ? (
                <div className='answer-box'>
                  {f.championImageUrl && (
                    <img className='champion-image' src={f.championImageUrl} alt={f.text} width={60} height={60} />
                  )}
                  <span className='answer-text'>The champion is {f.text}</span>
                </div>
              ) : f.isGuess ? (
                <div className={f.isCorrect ? 'guess-box-correct' : 'guess-box-incorrect'}>
                  {f.guessChampionImageUrl && (
                    <img className='champion-image' src={f.guessChampionImageUrl} alt={f.text} width={60} height={60} />
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span className='guess-text'>{f.text}</span>
                    {f.showCountdown && (
                      <div className='countdown-display'>
                        <span className='countdown-label'>Next daily champion in:</span>
                        <span className='countdown-time'>{countdown}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <span>{f.text}</span>
              )}
            </div>
          ))}
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}
