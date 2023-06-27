import { GithubUser } from "./github-api.js"
//This class will be responsible for everything related to user data.
export class Favorite {
  constructor(root) {
    this.root = document.querySelector(root)
    this.tbody = this.root.querySelector("table tbody")
    this.load()
  }
  async add(user) {
    try {
      const userAlreadyExists = this.githubUsers.find(githubUser => githubUser.login === user)
      if (userAlreadyExists) {
        throw new Error("Usuário já existente!")
      }
      const githubUser = await GithubUser.search(user)
      if (githubUser.login === undefined) {
        throw new Error("Usuário não existente!")
      } else {
        this.githubUsers = [githubUser, ...this.githubUsers]
        this.update()
        this.save()
      }
    } catch (error) {
      alert(error.message)
    }
    
  }
  delete(user) {
    const filteredGithubUsers = this.githubUsers.filter(githubUser => githubUser.login !== user.login)
    this.githubUsers = filteredGithubUsers 
    this.update()
    this.save()
  }
  load() {
    this.githubUsers = JSON.parse(localStorage.getItem("@github-favorites:")) || []
    if (this.githubUsers.length === 0) {
      this.loadEmptyTable()
    }
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.githubUsers))
  }
}

//This class will be responsible for everything related to DOM manipulation, events and whatsoever.
export class FavoriteView extends Favorite {
  constructor(root) {
    super(root)
    this.update()
    this.onadd()
  }
  createRow() {
    const tr = document.createElement("tr")
    tr.innerHTML = `
      <td class="user-info">
        <img src="https://github.com/gustavogarciac.png" alt="Imagem de Gustavo Garcia">
        <a class="user-text" href="#" target="_blank">
        <span class="user-name">Gustavo Garcia</span>
        <span class="user-login">gustavogarciac</span>
        </a>
      </td>
      <td id="repositories">123</td>
      <td id="followers">2154</td> 
      <td>
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }
  update() {
    this.removeAllTr()
    this.deleteEmptyTable()
    this.githubUsers.forEach(user => {
      const row = this.createRow()
      row.querySelector(".user-info img").src = `${user.html_url}.png`
      row.querySelector(".user-info img").alt = `Imagem de ${user.name}`
      row.querySelector(".user-info .user-text").href = `${user.html_url}`
      row.querySelector(".user-info .user-name").textContent = `${user.name}`
      row.querySelector(".user-info .user-login").textContent = `${user.login}`
      row.querySelector("#repositories").textContent = `${user.public_repos}`
      row.querySelector("#followers").textContent = `${user.followers}`
      row.querySelector(".remove").addEventListener("click", () => {
        const isOk = confirm("Você deseja realmente excluir o usuário da lista?")
        if (isOk) {
          this.delete(user)
        }
      })

      this.tbody.append(row)
    })
  }
  onadd() {
    const addButton = document.querySelector("#favorite-button")
    addButton.addEventListener("click", () => {
      const { value } = document.querySelector("input")
      this.add(value)
    })
  }
  removeAllTr() {
    document.querySelectorAll("tbody tr").forEach(tr => {
      tr.remove()
    })
  }
  loadEmptyTable() {
      const emptyTable = document.createElement("article")
      const content = `
      <div class="empty-table">
        <img src="/assets/Estrela.svg" alt="Icone de uma estrela">
        <h2>Nenhum favorito ainda</h2>
      <div>
      `
      emptyTable.innerHTML = content
      this.root.append(emptyTable)
  }
  deleteEmptyTable() {
    try {
      const emptyTable = this.root.querySelector(".empty-table")
      if(emptyTable && this.githubUsers.length != 0) {
        emptyTable.remove()
      }
    } catch(error) {
      alert(error.message)
    }
  }
}
