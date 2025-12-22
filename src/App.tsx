import './App.css';
import TOTPGenerator from './components/TOTPGenerator/TOTPGenerator';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <ThemeProvider>
            <div className="App">
                <ThemeToggle />
                <header className="app-header">
                    <h1>TOTP Generator</h1>
                    <p>Generate Time-based One-Time Passwords</p>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<TOTPGenerator />} />
                        <Route path="/form" element={<TOTPGenerator />} />
                    </Routes>
                </main>
                <footer className="app-footer">
                    <p>&copy; 2024 TOTP Generator. Secure and reliable.</p>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default App;
