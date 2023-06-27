export class GithubUser {
  static search(user) {
    const endpoint = `https://api.github.com/users/${user}`

    return fetch(endpoint).then(data => data.json()).then(({ name, login, html_url, followers, public_repos}) => {
      return {
        name,
        login,
        html_url,
        followers,
        public_repos,
      }
    })
  }
}