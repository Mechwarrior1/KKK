import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './components/UserPage';
import SummaryPage from './components/SummaryPage';
import DenseAppBar from './components/common/DenseAppBar'

function AppRouter() {
    console.log("haha")
    return (
        <Router>
          <DenseAppBar />
            <Routes>
                <Route path="/" element={<UserPage/>} />
                <Route path="/summary" element={<SummaryPage/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;