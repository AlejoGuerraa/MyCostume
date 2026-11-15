import './css/CategoryFilter.css'

const categories = [
  'All Items',
  'Accessories',
  'Pants',
  'T-shirts',
  'Shirts',
  'Jackets',
  'Coats',
  'Footwear',
  'Props',
]

function CategoryFilter() {
  return (
    <nav className="category-nav" aria-label="Item categories">
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={category}>
            <span
              className={index === 0 ? 'category-chip is-selected' : 'category-chip'}
              aria-current={index === 0 ? 'true' : undefined}
            >
              {category}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryFilter
