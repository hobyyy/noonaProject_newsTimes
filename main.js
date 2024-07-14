const apiKey = `170dea74e7a84e23bddd61f3f824eb1a`;
const nullImageURL = "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576,h_500/s3/2/50552/image%20not%20available(26).jpg"; 
let newsList = [];

// menu toggle 관련 value
let hamburgerButton = document.querySelector('.mobile-menu-toggle');
let closeButton = document.querySelector('.mobile-menu-close');
let menuGroup = document.querySelector('.menu-area');

let menuSlideOn = () =>  menuGroup.style.left = '0';
let menuSlideOff = () => menuGroup.style.left = '-100%';

hamburgerButton.addEventListener("click", menuSlideOn);
closeButton.addEventListener("click", menuSlideOff);

// 현재 카테고리를 저장할 변수 선언
let category = '';
// 현재 검색어를 저장할 변수 선언
let keyWord = '';

// pagination 관련 value
let totalResults = 0;
const pageSize = 10;
const pageGroupSize = 5;
let pageNow = 1;
// let groupNum = 1;
let pageGroupNow = Math.ceil(pageNow/pageGroupSize);


// API 호출을 위한 URL 객체 생성 함수 newsAPI 테스트용
// const createURL = (params = {}, params2 = {}, params3 = {}) => {
//   const mergedParams = { ...params, ...params2, ...params3, country: 'kr', apiKey: API_KEY };
//   const urlParams = new URLSearchParams(mergedParams).toString();
//   const url = new URL (
//     `https://newsapi.org/v2/top-headlines?${urlParams}`
//   );

//   fetchNews(url);
// };

// API 호출을 위한 URL 객체 생성 함수 누나 뉴스 API 배포용
const createURL = (params = {}, params2 = {}, params3 = {}) => {
  const mergedParams = { ...params, ...params2, ...params3 };
  const urlParams = new URLSearchParams(mergedParams).toString();
  const url = new URL (
    `https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?${urlParams}`
  );
  console.log('url', url)
  console.log('mergedParams',mergedParams)
  console.log('urlParams',urlParams)
  getNews(url);
};
// 뉴스데이터 받아오는 함수
const getNews = async(url)=> {
  try {
    url.searchParams.set("page",pageNow);       // &page=${pageNow}
    url.searchParams.set("pageSize",pageSize);  // &pageSize=${pageSize}
    const response = await fetch(url);
    const data = await response.json();
    console.log('data', data)

    if(response.status===200) {
      if(data.articles.length===0) {
        throw new Error("No matches for your search")
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    }else {
      throw new Error(data.message)
    }
  } catch (error) {
    errorRender(error.message);
  }
}

// 카테고리별 검색함수
// 상단 메뉴 카테고리 클릭시 url setting & getNews() 호출
const getNewsByCategory = async(event)=> {
  menuSlideOff();
  // 카테고리 텍스트를 소문자로 변환하여 변수에 저장
  category = event.target.textContent.toLowerCase();
  // 카테고리 선택하면 검색어 초기화
  keyWord = '';

  // 페이지 초기화
  pageNow = 1;
  //URL 객체 생성 함수 호출
  await createURL({ category });
  // createURL({ category, pageNow, pageSize });

  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${apiKey}`);
  // const url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?&category=${category}`);
  
  // await getNews(url);
  // paginationRender();

}

// 키워드별 검색함수
// 좌측 상단 키워드 입력후 검색시 url setting & getNews() 호출
const getNewsByKeyword = async(event)=> {
  // 사용자 입력값을 변수에 저장
  const keyWord = document.getElementById('search-input').value;
  console.log(keyWord)
  // 입력 필드 초기화
  keyWord.value = '';
  // 키워드로 검색하면 카테고리 초기화
  category = '';
  // 페이지 초기화
  pageNow = 1;
  
  //URL 객체 생성 함수 호출
  await createURL({ q: keyWord });
}


// 화면 첫 로딩시 최근뉴스 셋팅함수
const getLatestNews = async()=> {
  //URL 객체 생성 함수 호출
  await createURL();
}

// UI에 render하는 함수
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

// error화면을 UI에 render하는 함수
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
const onclickSearch = ()=> {
  document.querySelectorAll(".hidden-search").forEach((event)=> {
    // console.log('event',event.style.display)
    if(event.style.display == '') event.style.display = 'block';
    else event.style.display = '';
  })
}

// 페이지 클릭시 실행되는 함수
const onclickPage = (pageNum) => {
  pageNow = pageNum;
  if (category) {
    createURL({ category, pageNow, pageSize });
  } else if (keyWord) {
    createURL({ q: keyWord, pageNow, pageSize });
  } else {
    createURL({ pageNow, pageSize });
  }
}

// page의 첫번째/마지막 페이지의 << < > >> 을 지워주는 함수 
const pageRLbuttonRender = (totalPage)=> {
  if(pageNow===1) {
    document.querySelectorAll(".first-hidden").forEach((event)=> {
      event.style.display = 'none';
    })
  }
  if(pageNow===totalPage) {
    document.querySelectorAll(".last-hidden").forEach((event)=> {
      event.style.display = 'none';
    })
  }
}

// paging을 render하는 함수
const paginationRender = ()=> {
  console.log('pageNow', pageNow)
  const totalPage = Math.ceil(totalResults/pageSize);
  // groupNum = Math.ceil(totalPage/pageGroupSize);
  pageGroupNow = Math.ceil(pageNow/pageGroupSize);
  
  let lastPage = totalPage < pageGroupSize ? totalPage : totalPage < pageGroupNow*pageGroupSize ? totalPage : pageGroupNow*pageGroupSize;
  let firstPage = lastPage <= (pageGroupSize-1) ? 1 : lastPage - (pageGroupSize-1);
  
  let paginationHTML = `            <li class="page-item ">
  <a class="page-link first-hidden" aria-label="PreviousFirst" onclick="onclickPage(1)">
  <span aria-hidden="true">&laquo;</span>
  </a>
  </li>
  <li class="page-item">
  <a class="page-link first-hidden" aria-label="Previous" onclick="onclickPage(${pageNow-1>0 ? pageNow-1 : 1})">
  <span aria-hidden="true">&lsaquo;</span>
  </a>
  </li>`;
  for(i=firstPage;i<=lastPage;i++) {
    paginationHTML += `<li class="page-item ${i===pageNow ? "active" : ""}"><a class="page-link" onclick="onclickPage(${i})">${i}</a></li>`;
  }
  paginationHTML += `            <li class="page-item">
  <a class="page-link last-hidden" aria-label="Next" onclick="onclickPage(${pageNow+1<totalPage? pageNow+1 : totalPage})">
  <span aria-hidden="true">&rsaquo;</span>
  </a>
  </li>
  <li class="page-item">
  <a class="page-link last-hidden" aria-label="NextEnd" onclick="onclickPage(${totalPage})">
  <span aria-hidden="true">&raquo;</span>
  </a>
  </li>`
  document.querySelector(".pagination").innerHTML = paginationHTML;
  pageRLbuttonRender(totalPage);
  
}

const menus = document.querySelectorAll(".menu-area button")
menus.forEach(menu=> menu.addEventListener("click", getNewsByCategory))

const init = async()=> {
  await getLatestNews();
};

init();


