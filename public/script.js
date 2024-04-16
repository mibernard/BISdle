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

// console.log(ChampionItems);

const day = new Date().getDate();
const month = new Date().getMonth();

let num = Math.round(((day + 7) / month) * 3913).toString();
console.log('Num: ', num);
const today = +(num[4] + num[3]);

// const champion = champs;
// console.log(Object.keys(ChampionItems));

if (today > champion.length - 1) {
  var overflow = today - 59;
  console.log(champion.length);
  //   document.querySelector('#origin-text p').innerHTML = champion[overflow];
  //   var answer = document.querySelector('#origin-text p').innerHTML;
  console.log('Today: ', overflow);
  console.log('Champion: ', champion[overflow]);
} else {
  //   document.querySelector('#origin-text p').innerHTML = champion[today];
  //   var answer = document.querySelector('#origin-text p').innerHTML;
  console.log('Today: ', today);
  console.log('Champion: ', champion[today]);
}

// function getItemsForChampion(champion) {
//   return ChampionItems[champion] || []; // Return associated items or an empty array if not found
// }
// const items = getItemsForChampion(answer);
// console.log('Items:', items);

// document.getElementById('Img1').src = items[0];
// document.getElementById('Img2').src = items[1];
// document.getElementById('Img3').src = items[2];

var unitName = document.getElementById('unitName').value;
// if (!unitName) {
//   alert('Please enter a unit name');
//     return;
// }

console.log('champion', champion[overflow]);

fetch(`/fetch-alts/${champion[overflow]}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Clear previous results
      data.alts.forEach((alt) => {
        // const p = document.createElement('p');
        // p.textContent = alt;
        // resultsDiv.appendChild(p);
        // itemImg.setAttribute("class", "itemImage");
        const itemImg = document.createElement('img');

        alt = alt.replaceAll(' ', '');
        console.log(alt);

        itemImg.src = `https://rerollcdn.com/items/${alt}.png`;
        console.log(itemImg.src);
        itemImg.width = 100;
        // itemImg.margin = 10;

        resultsDiv.appendChild(itemImg);
      });
    } else {
      alert('Failed to fetch data: ' + data.message);
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
    alert('Error fetching data, check the console for more information.');
  });
