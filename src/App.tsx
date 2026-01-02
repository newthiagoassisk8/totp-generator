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
                    <h1>Gerador de TOTP</h1>

                    <p>Gere senhas de uso único baseadas em tempo</p>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={<TOTPGenerator />} />
                        <Route path="/form" element={<TOTPGenerator />} />
                        <Route path="/new" element={<TOTPGenerator />} />
                    </Routes>
                </main>
                <footer className="app-footer">
                    <p>&copy; 2024 Gerador de TOTP. Seguro e confiável.</p>
                </footer>
            </div>
        </ThemeProvider>
    );
}

export default App;
