import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'

import {Nav} from './components/Nav/nav'
import {Home} from './pages/Home'

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
    <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
