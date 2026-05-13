// There are two elements with class `container` in the markup (one in the nav and one for content).
// Select the last one which is the main content container for recipe cards.
const _containers = Array.from(document.querySelectorAll('.container'));
const container = _containers.length ? _containers[_containers.length - 1] : null; // Main container for recipe cards
const qInput = document.getElementById('q'); // Search query input
const cuisineSelect = document.getElementById('cuisine'); // Cuisine dropdown
const searchBtn = document.getElementById('searchBtn'); // Search button

function render(recipes) { // Render recipe cards
  if (!container) return;
  container.innerHTML = recipes.map((r, i) => `
    <div class="card">
      <img class="card-image" src="${r.image || 'images/placeholder.png'}" alt="Image of ${r.title}">
      <h2 class="card-name">${r.title}</h2>
      <p class="card-meta">${r.cuisine || ''}</p>
      <p class="card-about">Tags: ${r.tags || ''}</p>
      <button class="btn open-recipe" data-index="${i}">View instructions</button>
    </div>
  `).join('');

  // Attach listeners to newly rendered buttons
  container.querySelectorAll('.open-recipe').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      showRecipeModal(recipes[idx]);
    });
  });
}

function escapeQuotes(s){ return String(s).replace(/'/g,"\\'").replace(/"/g,'\\"'); }

/* Modal for showing recipe details */
function showRecipeModal(recipe) {
  if (!recipe) return;
  const modal = document.getElementById('recipeModal');
  if (!modal) return;
  const body = modal.querySelector('.modal-body');
  body.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = recipe.title;
  body.appendChild(title);

  const ingHeading = document.createElement('h3');
  ingHeading.textContent = 'Ingredients';
  body.appendChild(ingHeading);

  const ulIng = document.createElement('ul');
  (recipe.ingredients || '').split(',').map(s=>s.trim()).filter(Boolean).forEach(i => {
    const li = document.createElement('li'); li.textContent = i; ulIng.appendChild(li);
  });
  body.appendChild(ulIng);

  const methodHeading = document.createElement('h3');
  methodHeading.textContent = 'Method';
  body.appendChild(methodHeading);

  const ulMethod = document.createElement('ul');
  // Split instructions by newlines or sentences
  (recipe.instructions || '').split(/\n|\.\s+/).map(s=>s.trim()).filter(Boolean).forEach(step => {
    const li = document.createElement('li'); li.textContent = step.replace(/\.$/, ''); ulMethod.appendChild(li);
  });
  body.appendChild(ulMethod);

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function hideRecipeModal() {
  const modal = document.getElementById('recipeModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

// Close modal on overlay click, close button, or ESC
document.addEventListener('click', (e) => {
  const modal = document.getElementById('recipeModal');
  if (!modal) return;
  if (e.target.matches('.modal-overlay') || e.target.matches('.modal-close')) hideRecipeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideRecipeModal(); });

async function search() {
  const query = qInput ? qInput.value.trim() : '';
  const cuisine = cuisineSelect ? cuisineSelect.value.trim() : '';
  const url = new URL('/api/recipes', window.location.origin);
  if (query) url.searchParams.set('query', query);
  if (cuisine) url.searchParams.set('cuisine', cuisine);
  try {
    const res = await fetch(url.toString());
    const data = await res.json();
    render(data);
  } catch (err) {
    console.error('Failed to fetch recipes:', err);
  }
}

if (searchBtn) searchBtn.addEventListener('click', search);
if (qInput) qInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') search(); });

// Initial load
search();
