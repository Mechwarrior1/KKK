import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './components/UserPage';

function AppRouter() {
    console.log("haha")
    return (
        <Router>
            <Routes>
                <Route path="/" element={<UserPage/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;