import './css/Footer.css'
import { Link } from 'react-router-dom'

const footerSections = [
  {
    title: 'Explore',
    links: ['Clothing', 'Accessories', 'Footwear', 'Props'],
  },
  {
    title: 'Discover',
    links: ['Costume ideas', 'Character matches', 'How it works'],
  },
  {
    title: 'About',
    links: ['Our story', 'Contact', 'Help center'],
  },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-main">
          <div className="footer-brand-block">
            <Link className="footer-brand" to="/" aria-label="MyCostume home">
              <img src="/logo.png" alt="MyCostume" />
            </Link>
            <p className="footer-description">
              MyCostume helps you discover costume ideas by combining everyday
              clothing, accessories, and props. Find your next character using
              what you already have.
            </p>
          </div>

          {footerSections.map((section) => (
            <div className="footer-column" key={section.title}>
              <h2>{section.title}</h2>
              <ul>
                {section.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <span>© 2026 MyCostume. All rights reserved.</span>
          <span>Made for the joy of becoming someone else.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
