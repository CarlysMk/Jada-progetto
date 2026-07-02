import { Link, Route, Routes } from "react-router"
import GraficoUtenti from "./pages/grafico"
import  Home from "./pages/home"
import TabellaUtenti from "./pages/tabella"

export default function App() {

  return (
   <main>
    <div className="bg-gray-800">
      <Home />
        <Routes>
          <Route path="/" element={<Link to="/tabella" replace />} />
          <Route path="/tabella" element = {<TabellaUtenti />} />
          <Route path="/grafico" element = {<GraficoUtenti />} />
        </Routes>
    </div>
   </main>
  )
}
