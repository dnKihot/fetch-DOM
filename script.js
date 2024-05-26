
async function fetchRepositories(query) {
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${query}`);
    if (!response.ok) {
      throw new Error('Error !')
    }
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

const searchInput = document.getElementById('searchInput')
const autocompleteList = document.getElementById('autocompleteList')
const repositoryList = document.querySelector('.repositoryList')

searchInput.addEventListener('input', debounce(async function(event) {
  const query = event.target.value.trim()
  if (!query.length) {
    displayAutocomplete([]) 
    return
  }

  const repositories = await fetchRepositories(query);
  displayAutocomplete(repositories.slice(0, 5)); 
}, 150)); 

repositoryList.addEventListener('click', function(event) {
  if (event.target.classList.contains('remove-btn')) {
    const listItem = event.target.closest('li')
    listItem.remove()
  }
});

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  };
}

function displayAutocomplete(repositories) {
  autocompleteList.innerHTML = '' 

  repositories.forEach(repo => {
    const listItem = document.createElement('li')
    listItem.textContent = repo.name;
    listItem.addEventListener('click', function() {
      addRepositoryToList(repo)
      searchInput.value = ''; 
      autocompleteList.innerHTML = '' 
    });
    autocompleteList.appendChild(listItem)
  });
}

function addRepositoryToList(repo) {
  const listItem = document.createElement('li')

  listItem.innerHTML = `
    <span>Name: ${repo.name}</span>
    <span>Owner: ${repo.owner.login}</span>
    <span>Stars: ${repo.stargazers_count}</span>
    <button class="remove-btn">X</button>
  `

  repositoryList.insertBefore(listItem, repositoryList.firstChild) 
}

