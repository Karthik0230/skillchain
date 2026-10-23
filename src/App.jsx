import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './context/Web3Context'
import Navbar from './components/layout/Navbar'
import HomePage        from './pages/HomePage'
import TasksPage       from './pages/TasksPage'
import DAOPage         from './pages/DAOPage'
import ProfilePage     from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import CreateTaskPage  from './pages/CreateTaskPage'

export default function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <div className="min-h-screen bg-bg-primary text-white font-body">
          {/* Ambient background blobs */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 left-1/3 w-[600px] h-[300px] bg-cyan-600/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <Navbar />
            <main>
              <Routes>
                <Route path="/"            element={<HomePage />} />
                <Route path="/tasks"       element={<TasksPage />} />
                <Route path="/tasks/new"   element={<CreateTaskPage />} />
                <Route path="/dao"         element={<DAOPage />} />
                <Route path="/profile"     element={<ProfilePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </Web3Provider>
  )
}
