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

const day = new Date().getDate();
const month = new Date().getMonth();

let num = Math.round(((day + 7) / month) * 3913).toString();
console.log('Num: ', num);
const today = +(num[4] + num[3]);

if (today > champion.length - 1) {
  var overflow = today - 59;
  console.log(champion.length);
  console.log('Today: ', overflow);
  console.log('Champion: ', champion[overflow]);
} else {
  console.log('Today: ', today);
  console.log('Champion: ', champion[today]);
}

var unitName = document.getElementById('unitName').value;

// console.log('champion', champion[overflow]);
console.log('champion', champion[0]);

fetch(`/api/fetch-alts?unit=${champion[0]}`)
  .then((response) => response.json())
  .then((data) => {
    if (data.success && Array.isArray(data.alts)) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; // Clear previous results
      data.alts.forEach((alt) => {
        const itemImg = document.createElement('img');

        alt = alt.replaceAll(' ', '');
        console.log(alt);

        itemImg.src = `https://rerollcdn.com/items/${alt}.png`;
        console.log(itemImg.src);
        itemImg.width = 100;

        resultsDiv.appendChild(itemImg);
      });
    } else {
      alert('Failed to fetch data: ' + (data.message || 'Unknown error'));
    }
  });
