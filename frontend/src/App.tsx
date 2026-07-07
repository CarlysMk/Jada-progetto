import 'devextreme/dist/css/dx.light.css';
import { Navigate, Route, Routes } from "react-router"
import GraficoUtenti from "./pages/grafico"
import  Banner from "./pages/Banner"
import TabellaUtenti from "./pages/tabella"

export default function App() {

  return (
   <main>
    <div className="bg-gray-800">
      <Banner />
        <Routes>
          <Route path="/" element={<Navigate to="/tabella" replace />} />
          <Route path="/tabella" element = {<TabellaUtenti />} />
          <Route path="/grafico" element = {<GraficoUtenti />} />
        </Routes>
    </div>
   </main>
  )
}
