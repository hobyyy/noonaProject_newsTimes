const api_Key = `170dea74e7a84e23bddd61f3f824eb1a`;
const nullImageURL = "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_500/s3/2/50552/image%20not%20available(26).jpg"; 
// const keyword = '데이식스';
const PAGE_SIZE = 20;
let newsList = [];

const getNews = async(url)=> {
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
}

const getNewsByCategory = async(event)=> {
  const targetValue = event.target.textContent.toLowerCase();
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${targetValue}&apiKey=${api_Key}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${targetValue}`);
  getNews(url);
}

const getNewsByKeyword = async(event)=> {
  const keyword = document.getElementById("search-input").value;
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${api_Key}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  getNews(url);
}

const menus = document.querySelectorAll(".menu-area button")
menus.forEach(menu=> menu.addEventListener("click", getNewsByCategory))

const getLatestNew = async()=> {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${api_Key}`);
  const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
  getNews(url);
}

const render = ()=> {
  const newsHTML = newsList.map(
    (news)=> `<div class="row news">
      <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage == null ? nullImageURL : news.urlToImage == "[Removed]" ? nullImageURL : news.urlToImage}"/>
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
          ${news.description == null ? "내용없음" : news.description == "[Removed]" ? "내용없음" : textLenOverCut(news.description, length = 200)}
        </p>
        <div>
          ${news.source.name == null ? "no source" : news.source.name == "[Removed]" ? "no source" : news.source.name} * ${moment(news.publishedAt).fromNow()}
        </div>
      </div>
    </div>
    `
  ).join('');
  // console.log(document.getElementById("news-board").innerHTML )
  document.getElementById("news-board").innerHTML = newsHTML;
}
getLatestNew();
 
function textLenOverCut(txt, length = 200) {
  let result = '';
  if (txt.length > length) {
    result = txt.substr(0, length) + '...';
    // console.log(result.length)
  } else {
    result = txt;
  }
  return result;
};

