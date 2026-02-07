import { useState } from 'react';
import InBox from './InBox.jsx';
import Exchange from './Exchange.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'exchange'>('inbox');

  return (
    <div className="app-container">
      <header className="top-bar">
          
         <button className="compose-button">
            New Purchase Order
          </button>

        <div className="nav-buttons">          

          <button
            className={activeTab === 'inbox' ? 'active' : ''}
            onClick={() => setActiveTab('inbox')}
          >
            Inbox
          </button>

          <button
            className={activeTab === 'exchange' ? 'active' : ''}
            onClick={() => setActiveTab('exchange')}
          >
            Exchanges
          </button>
        </div>

      </header>

      <main>
        <h2 className="section-title">
          {activeTab === 'inbox' ? 'Finalized Exchanges' : 'Active Exchanges'}
        </h2>

        {activeTab === 'inbox' && <InBox />}
        {activeTab === 'exchange' && <Exchange />}
      </main>
    </div>
  );
}

export default App;
