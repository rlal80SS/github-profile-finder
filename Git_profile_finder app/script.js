const searchBtn = document.getElementById("searchBtn")
const input = document.getElementById("searchInput")
const profile = document.getElementById("profile")
const repos = document.getElementById("repos")
const loading = document.getElementById("loading")
const toggleTheme = document.getElementById("toggleTheme")

searchBtn.addEventListener("click", getUser)

input.addEventListener("keypress", function(e){
if(e.key === "Enter"){
getUser()
}
})

// toggleTheme.addEventListener("click", ()=>{
// document.body.classList.toggle("light")
// })

toggleTheme.addEventListener("click", () => {

document.body.classList.toggle("light")

if(document.body.classList.contains("light")){
toggleTheme.textContent = "☀️"
}else{
toggleTheme.textContent = "🌙"
}

})


async function getUser(){

const username = input.value.trim()

if(username === "") {
    alert("Enter a username ");
    return 
}

profile.innerHTML = ""
repos.innerHTML = ""

loading.classList.remove("hidden")

try{

const userRes = await fetch(`https://api.github.com/users/${username}`)
const user = await userRes.json()

if(user.message === "Not Found"){
loading.classList.add("hidden")
profile.innerHTML = "<h2>User Not Found</h2>"
return
}

profile.innerHTML = `
<div class="profile-card">
<img src="${user.avatar_url}">
<div>
<h2>${user.name || user.login}</h2>
<p>${user.bio || "No bio available"}</p>
<p>Followers: ${user.followers} | Following: ${user.following}</p>
<p>Public Repos: ${user.public_repos}</p>
<a href="${user.html_url}" target="_blank">View Profile</a>
</div>
</div>
`

const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars`)
const repoData = await repoRes.json()

repos.innerHTML = "<h2>Top Repositories</h2><div class='repo-grid'></div>"

const repoGrid = document.querySelector(".repo-grid")

repoData.slice(0,6).forEach(repo=>{
repoGrid.innerHTML += `
<div class="repo">
<h4>${repo.name}</h4>
<p>⭐ ${repo.stargazers_count}</p>
<p>${repo.language || "Unknown"}</p>
<a href="${repo.html_url}" target="_blank">View Repo</a>
</div>
`
})

loading.classList.add("hidden")

}catch(error){

loading.classList.add("hidden")
profile.innerHTML = "Error fetching data"

}

}