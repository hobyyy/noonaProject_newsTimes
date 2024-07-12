const apiKey = `170dea74e7a84e23bddd61f3f824eb1a`;
const nullImageURL = "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_500/s3/2/50552/image%20not%20available(26).jpg"; 
// const keyword = '데이식스';
let newsList = [];

// menu toggle 관련 value
let hamburgerButton = document.querySelector('.mobile-menu-toggle');
let closeButton = document.querySelector('.mobile-menu-close');
let menuGroup = document.querySelector('.menu-area');

let menuSlideOn = () =>  menuGroup.style.left = '0';
let menuSlideOff = () => menuGroup.style.left = '-100%';

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);

//pagination 관련 value
let totalResults = 0;
const pageSize = 20;
const pageGroupSize = 5;
let pageNow = 1;


const getNews = async(url)=> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data)

    if(response.status===200) {
      if(data.articles.length===0) {
        throw new Error("No result for this search")
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
    }else {
      throw new Error(data.message)
    }
  } catch (error) {
    errorRender(error.message);
  }
}

const getNewsByCategory = async(event)=> {
  menuSlideOff();
  const targetValue = event.target.textContent.toLowerCase();
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${targetValue}&apiKey=${apiKey}`);
  // const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?category=${targetValue}`);
  await getNews(url);
}

const getNewsByKeyword = async(event)=> {
  const keyword = document.getElementById("search-input").value;
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${apiKey}`);
  // const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?q=${keyword}`);
  await getNews(url);
}

const getLatestNews = async()=> {
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`);
  // const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?page=1&pageSize=20`);
  await getNews(url);
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
          ${news.description == null ? "내용없음" : news.description == "[Removed]" ? "내용없음" : news.description == "" ? "내용없음" : textLenOverCut(news.description, length = 200)}
        </p>
        <div>
          ${news.source.name == null ? "no source" : news.source.name == "[Removed]" ? "no source" : news.source.name} * ${moment(news.publishedAt).fromNow()}
        </div>
      </div>
    </div>
    `
  ).join('');
  document.getElementById("news-board").innerHTML = newsHTML;
}

const errorRender = (message)=>{
  const errorHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="d-none">
    <symbol id="exclamation-triangle-fill" width="50" viewBox="0 0 16 16">
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </symbol>
  </svg>

  <div class="alert alert-danger d-flex align-items-center" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="50" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <div>${message}</div>
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
}

// text의 길이가 length의 길이보다 크면 나머지 글자들은 ...으로 대체
const textLenOverCut = (txt, length = 200)=> {
  let result = '';
  if (txt.length > length) {
    result = txt.substr(0, length) + '...';
    // console.log(result.length)
  } else {
    result = txt;
  }
  return result;
};

// 돋보기 Btn 클릭시 실행되는 함수
// 돋보기 Btn 클릭시 input-box와 검색 Btn이 보였다가 사라졌다가 하는 기능
const clickSearch = ()=> {
  console.log('clickSearch',document.querySelectorAll(".hidden-search"))
  document.querySelectorAll(".hidden-search").forEach((event)=> {
    console.log('event',event.style.display)
    if(event.style.display == '') event.style.display = 'block';
    else event.style.display = '';
  })
}

const paginationRender = ()=> {
  const totalPage = Math.ceil(totalResults/pageGroupSize);
  let pageGroupNow = Math.ceil(pageNow/pageGroupSize);
  
  // let lastPage = pageGroupNow*pageGroupSize;
  let lastPage = totalPage < pageGroupSize ? totalPage : pageGroupNow*pageGroupSize;

  let firstPage = lastPage - (pageGroupSize-1);

  let paginationHTML = ``;
  
  for(i=1;i<lastPage;i++) {
    `<li class="page-item"><a class="page-link">${i}</a></li>`
  }
  
  document.getElementById("page-num-area").innerHTML += paginationHTML;
  
  // console.log('pageHTML', document.getElementById("page-num-area").innerHTML)
}

const menus = document.querySelectorAll(".menu-area button")
menus.forEach(menu=> menu.addEventListener("click", getNewsByCategory))


const init = async()=> {
  await getLatestNews();
  paginationRender();
};

init();


