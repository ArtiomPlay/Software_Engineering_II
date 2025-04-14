import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import {Nav} from './components/Nav/nav'
import {Home} from './pages/main/Home'
import {Leaderboard} from './pages/main/Leaderboard'
import {Account} from './pages/main/Account'
import {AimTrainer} from './pages/games/AimTrainer'
import {MathGame} from './pages/games/MathGame'
import {Seeker} from './pages/games/Seeker'
import {Sequence} from './pages/games/Sequence'
import {Typing} from './pages/games/Typing'

function App() {
  return (
    <div className='page'>
      <BrowserRouter>
        <Nav/>
        <div className='main_body'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
            <Route path="/account" element={<Account/>}/>
            <Route path="/aimtrainer" element={<AimTrainer/>}/>
            <Route path="/mathgame" element={<MathGame/>}/>
            <Route path="/seeker" element={<Seeker/>}/>
            <Route path="/sequence" element={<Sequence/>}/>
            <Route path="/typing" element={<Typing/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
