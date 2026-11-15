import CategoryFilter from '../components/CategoryFilter.jsx'
import Footer from '../components/Footer.jsx'
import Header from '../components/Header.jsx'
import ProductCard from '../components/ProductCard.jsx'
import './css/HomePage.css'

const items = [
  {
    name: 'Black Leather Jacket',
    category: 'Jackets',
    description: 'A timeless layer for iconic, action-ready looks.',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Black leather jacket styled against a neutral background',
  },
  {
    name: 'Dark Sunglasses',
    category: 'Accessories',
    description: 'The finishing touch for a little mystery.',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Dark sunglasses photographed in soft natural light',
  },
  {
    name: 'White T-shirt',
    category: 'T-shirts',
    description: 'A clean essential that works with every character.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Classic white T-shirt',
  },
  {
    name: 'Black Combat Boots',
    category: 'Footwear',
    description: 'Ground your look with a bold, rugged finish.',
    image:
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Black leather boots',
  },
  {
    name: 'Fedora Hat',
    category: 'Accessories',
    description: 'A recognizable silhouette with instant attitude.',
    image:
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Dark fedora hat',
  },
  {
    name: 'Blue Denim Jeans',
    category: 'Pants',
    description: 'An everyday classic, ready for a new role.',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Blue denim jeans',
  },
  {
    name: 'Red Hoodie',
    category: 'Shirts',
    description: 'A vivid layer for a laid-back character look.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Red hooded sweatshirt',
  },
  {
    name: 'Long Black Coat',
    category: 'Coats',
    description: 'A dramatic outer layer with a cinematic feel.',
    image:
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Long dark coat styled for a city look',
  },
  {
    name: 'Classic Low-top Sneakers',
    category: 'Footwear',
    description: 'A relaxed finishing detail for modern characters.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Bright low-top sneaker',
  },
  {
    name: 'Retro Camera Prop',
    category: 'Props',
    description: 'A vintage-inspired detail for a character on the go.',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=960&q=80',
    imageAlt: 'Retro film camera',
  },
]

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <div className="page-container">
          <section className="hero-panel" aria-labelledby="hero-title">
            <img
              className="hero-image"
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=85"
              alt=""
              fetchPriority="high"
            />
            <div className="hero-shade" />
            <div className="hero-copy">
              <p className="hero-eyebrow">MAKE IT YOURS</p>
              <h1 id="hero-title">Your next costume starts here.</h1>
              <p className="hero-description">
                Mix and match clothing, accessories, and props to discover
                characters you can bring to life.
              </p>
            </div>
            <span className="hero-index" aria-hidden="true">
              STYLE YOUR STORY&nbsp; / &nbsp;01
            </span>
          </section>

          <section className="catalog-section" aria-labelledby="catalog-title">
            <div className="catalog-heading">
              <div>
                <p className="section-eyebrow">START WITH WHAT YOU HAVE</p>
                <h2 id="catalog-title">Find your next look</h2>
              </div>
              <p className="catalog-count">A FEW WAYS TO GET STARTED</p>
            </div>

            <CategoryFilter />

            <div className="product-grid">
              {items.map((item) => (
                <ProductCard item={item} key={item.name} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default HomePage
