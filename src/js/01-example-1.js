import NewsApi from './NewsApi.js';
import LoadMoreBtn from './LoadMoreBtn.js';

const loadMoreBtn = new LoadMoreBtn({
  selector: '#loadMoreBtn',
  isHidden: true,
});

const newsApi = new NewsApi();

const form = document.getElementById('form');
const articlesList = document.getElementById('articlesWrapper');

form.addEventListener('submit', event => {
  event.preventDefault();
  const inputValue = form.elements.news.value.trim();

  if (inputValue === '') {
    alert('Please, write something');
    return;
  }

  setApi(inputValue);
  clear();
  loadData(event);
});

function setApi(searchQuery) {
  newsApi.searchQuery = searchQuery;
  newsApi.resetPage();
}

function loadData(event) {
  loadMoreBtn.show();
  loadMoreBtn.disable();

  return newsApi
    .getNews()
    .then(({ articles }) => {
      if (articles?.length === 0) {
        return onError(event);
      }

      return createMarkup(articles);
    })

    .then(markup => {
      updateArticlesList(markup);
      loadMoreBtn.enable();
    })
    .catch(error => alert(error));
}

function createMarkup(articles) {
  const markup = articles
    .map(article => {
      const { author, title, description, url, urlToImage } = article;
      return `
      <div class="article-card">
        <h2 class="article-title">${title}</h2>
        <h3 class="article-author">${author || 'Anonym'}</h3>
        <img src=${urlToImage} class="article-img">
        <p class="article-description">${description}</p>
        <a href=${url} class="article-link" target="_blank">Read more</a>
      </div>
    `;
    })
    .join('');
  return markup;
}

function updateArticlesList(markup) {
  articlesList.innerHTML += markup;
}

function clear() {
  articlesList.innerHTML = '';
  form.reset();
}

function onError(event) {
  loadMoreBtn.hide();

  if (event.type === 'submit') {
    updateArticlesList('<h3>Articles not found</h3>');
    throw new Error('No data');
  }

  if (event.type === 'click') {
    throw new Error('No more articles');
  }
}

loadMoreBtn.button.addEventListener('click', event => {
  loadData(event);
});
