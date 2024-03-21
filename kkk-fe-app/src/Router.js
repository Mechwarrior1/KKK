import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPage from './components/UserPage';
import SummaryPage from './components/SummaryPage';
import DenseAppBar from './components/common/DenseAppBar'
import HomePage from "./components/HomePage"

function AppRouter() {
    console.log("haha")
    return (
        <Router>
            <Routes>
              <Route path="/" element={<HomePage/>} />
              <Route path="/user" element={
                <div>
                  <DenseAppBar />
                  <UserPage/>
                </div>
              } />
              <Route path="/summary" element={
                <div>
                  <DenseAppBar />
                  <SummaryPage/>
                </div>
              } />
            </Routes>
        </Router>
    );
}

export default AppRouter;