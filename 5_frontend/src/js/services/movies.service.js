export default class Movies {
  constructor(AppConstants, $http, $q, GraphQLClient) {
    'ngInject';

    this._AppConstants = AppConstants;
    this._$http = $http;
    this._$q = $q;
    this._GQL = GraphQLClient;
  }

  query(config) {
    let request = {
      url: this._AppConstants.api + '/movies' + ((config.type === 'feed') ? '/feed' : ''),
      method: 'GET',
      params: config.filters ? config.filters : null
    };
    return this._$http(request).then((res) => res.data);
  }

  getMovies() {
    let query = `
      query {
        movie (slug: "avatar-h44l8x") {
          title
          releaseYear
          director
          duration
        }
      }
    `;
    return this._GQL.get(query, this._AppConstants.gql + "/graphql");
  }

  getMovie(slug) {
    let deferred = this._$q.defer();

    if (!slug.replace(" ", "")) {
      deferred.reject("Movie slug is empty");
      return deferred.promise;
    }

    let query = `
      query {
        movie (slug: "avatar-h44l8x") {
          id
          slug
          title
          releaseYear
          director
          duration
          favoritesCount
          author {
            username
            image
          }
        }
      }
    `;
    return this._GQL.get(query, this._AppConstants.gql + "/graphql");
  }

  destroy(slug) {
    return this._$http({
      url: this._AppConstants.api + '/movies/' + slug,
      method: 'DELETE'
    })
  }

  save(movie) {
    let request = {};

    if (movie.slug) {
      request.url = `${this._AppConstants.api}/movies/${movie.slug}`;
      request.method = 'PUT';
      delete movie.slug;

    } else {
      request.url = `${this._AppConstants.api}/movies`;
      request.method = 'POST';
    }

    request.data = { movie: movie };

    return this._$http(request).then((res) => res.data.movie);
  }


  favorite(slug) {
    return this._$http({
      url: this._AppConstants.api + '/movies/' + slug + '/favorite',
      method: 'POST'
    })
  }

  unfavorite(slug) {
    return this._$http({
      url: this._AppConstants.api + '/movies/' + slug + '/favorite',
      method: 'DELETE'
    })
  }


}
