const api_Key = `170dea74e7a84e23bddd61f3f824eb1a`;
let news = [];
const getLatestNew = async ()=> {
  const url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${api_Key}`);
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles;

  console.log(news);
}
getLatestNew();