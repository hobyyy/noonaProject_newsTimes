// const api_Key = `170dea74e7a84e23bddd61f3f824eb1a`;
const keyword = '데이식스';
const PAGE_SIZE = 20;
let news = [];
const getLatestNew = async ()=> {
  // const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${api_Key}`);
  const url = new URL(`https://noonaproject-newstimes.netlify.app/top-headlines`);
  // const url = new URL(`https://noona-times-v2.netlify.app/top-headlines`);
  //?q=${keyword}&country=kr&pageSize=${PAGE_SIZE}
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;

  console.log(news);
}
getLatestNew();