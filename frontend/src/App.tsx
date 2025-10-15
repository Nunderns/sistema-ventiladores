import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import ChatPage from "./pages/Chat";
import Ventiladores from "./pages/Ventiladores";
import Funcionarios from "./pages/Funcionarios";
import ProducaoPage from "./pages/Producao";
import EstoquePage from "./pages/Estoque";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      {/* Navbar fixa no topo */}
      <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / título */}
            <div className="text-2xl font-bold tracking-wide">
              🧭 Fábrica de Ventiladores
            </div>

            {/* Links de navegação */}
            <ul className="flex space-x-4">
              <li>
                <NavLink
                  to="/ventiladores"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-700 shadow"
                        : "hover:bg-blue-600 hover:text-white"
                    }`
                  }
                >
                  Ventiladores
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/funcionarios"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-700 shadow"
                        : "hover:bg-blue-600 hover:text-white"
                    }`
                  }
                >
                  Funcionários
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/producao"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-700 shadow"
                        : "hover:bg-blue-600 hover:text-white"
                    }`
                  }
                >
                  Produção
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/estoque"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-white text-blue-700 shadow"
                        : "hover:bg-blue-600 hover:text-white"
                    }`
                  }
                >
                  Estoque
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <div className="min-h-[calc(100vh-4rem)] bg-gray-100 flex justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/ventiladores" element={<Ventiladores />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/producao" element={<ProducaoPage />} />
            <Route path="/estoque" element={<EstoquePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
