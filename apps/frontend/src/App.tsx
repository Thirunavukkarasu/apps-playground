import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router'
import Login from './pages/Login'
import UnauthLayout from './layouts/UnauthLayout'
import Register from './pages/Register'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Assignments from './pages/AssignmentsList'
import AssignmentAttempts from './pages/AssignmentAttempts'
import AssignmentChallenge from './pages/AssignmentChallenge'

function App() {
    return (
        <Router>
            <Routes>
                <Route element={<UnauthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<AuthLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assignments/*" element={<Assignments />} />
                    <Route path="/assignments/:id" element={<AssignmentChallenge />} />
                    <Route path="/attempts/*" element={<AssignmentAttempts />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    )
}

export default App

