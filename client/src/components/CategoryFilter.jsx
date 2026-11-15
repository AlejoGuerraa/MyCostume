import './css/CategoryFilter.css'

function CategoryFilter({ categories, selectedCategoryId, onSelect }) {
  return (
    <nav className="category-nav" aria-label="Item categories">
      <ul className="category-list">
        <li>
          <button
            className={`category-chip${selectedCategoryId === '' ? ' is-selected' : ''}`}
            type="button"
            aria-pressed={selectedCategoryId === ''}
            onClick={() => onSelect('')}
          >
            All Items
          </button>
        </li>
        {categories.map((category) => {
          const categoryId = String(category.categoryId)
          const isSelected = selectedCategoryId === categoryId

          return (
            <li key={category.categoryId}>
              <button
                className={`category-chip${isSelected ? ' is-selected' : ''}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(categoryId)}
              >
                {category.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default CategoryFilter
