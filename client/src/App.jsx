import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SelectionProvider } from './context/SelectionContext.jsx'
import HomePage from './pages/HomePage.jsx'
import CharacterDetailPage from './pages/CharacterDetailPage.jsx'
import SearchResultsPage from './pages/SearchResultsPage.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <SelectionProvider>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/characters/:costumeId" element={<CharacterDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SelectionProvider>
    </BrowserRouter>
  )
}

export default App
