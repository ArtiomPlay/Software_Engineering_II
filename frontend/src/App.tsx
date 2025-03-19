import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import {Nav} from './components/Nav/nav'
import {Home} from './pages/Home'
import { Leaderboard } from './pages/Leaderboard'

function App() {
  /*
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching API:", error))
  }, [])*/

  return (
    <div className='page'>
      <BrowserRouter>
        <Nav/>
        <div className='main_body'>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/leaderboard" element={<Leaderboard/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
