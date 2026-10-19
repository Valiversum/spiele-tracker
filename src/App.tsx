import { Route, Routes } from 'react-router-dom'
import { NavBar } from './components/NavBar'
import { Dashboard } from './pages/Dashboard'
import { Spiele } from './pages/Spiele'
import { GameDetail } from './pages/GameDetail'
import { Wertung } from './pages/Wertung'
import { Notizen } from './pages/Notizen'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/spiele" element={<Spiele />} />
          <Route path="/spiele/:id" element={<GameDetail />} />
          <Route path="/wertung" element={<Wertung />} />
          <Route path="/notizen" element={<Notizen />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
