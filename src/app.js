import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Layout from './pages/layout';
import ErrorBoudary from './errorBoundary.jsx';
import './lib/extensions';

const App = () => (
    <ErrorBoudary>
        <Router>
            <Route component={Layout} />
        </Router>
    </ErrorBoudary>
)

export default App;