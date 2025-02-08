import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css';
import './assets/style/index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import Learn from './learn/Learn.jsx';
import Detail from './learn/[slug].jsx';
import NotFound from './NotFound.jsx';
import PreScan from './PreScan.jsx';
import Quiz from './quiz/Quiz.jsx';
import AddQuestion from './quiz/AddQuestion.jsx';

const LoadingScreen = () => (
  <div className="loading-container">
    <div className="spinner"></div>
    <p>Memuat aplikasi...</p>
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<LoadingScreen />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/prescan" element={<PreScan />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/add" element={<AddQuestion />} />
          <Route path="/learn/:slug" element={<Detail />} />
          <Route path='*' element={<NotFound />}/>
          {/* <Route path="dashboard" element={<Dashboard />}>
            <Route index element={<RecentActivity />} />
            <Route path="project/:id" element={<Project />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
