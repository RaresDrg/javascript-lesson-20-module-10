const ENDPOINT = 'https://newsapi.org/v2/everything';
const KEY_API = 'c16730bd019e47b49168e3f2670f55aa';

class NewsApi {
  constructor() {
    this.searchQuery = '';
    this.queryPage = 1;
  }

  getNews() {
    const url = `${ENDPOINT}?q=${this.searchQuery}&pageSize=3&page=${this.queryPage}`;
    const options = {
      headers: {
        'X-Api-Key': KEY_API,
      },
    };

    return fetch(url, options)
      .then(response => response.json())
      .then(data => {
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.queryPage += 1;
  }

  resetPage() {
    this.queryPage = 1;
  }
}

export default NewsApi;
