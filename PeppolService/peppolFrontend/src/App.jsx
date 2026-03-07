import { useState } from 'react';
import InBox from './inBox.jsx';
import Exchange from './Exchange.jsx';
import PurchaseOrderForm from './PurchaseOrderForm.jsx';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [showForm, setShowForm] = useState(false);
  const [formContext, setFormContext] = useState(null);

  return (
    <div className="app-container">
      {/* Top navigation bar */}
      <header className="top-bar">
        <button
          className="compose-button"
          onClick={() => {
            setFormContext({ mode: "new", threadId: null });
            setShowForm(true);
          }}
        >
          New Purchase Order
        </button>
        <div className="nav-buttons">
          <div className="nav-label">
            
          </div>
          <button
            className={activeTab === 'inbox' ? 'active' : ''}
            onClick={() => { setActiveTab('inbox'); setShowForm(false); }}
          >
            Inbox
          </button>
          <button
            className={activeTab === 'exchange' ? 'active' : ''}
            onClick={() => { setActiveTab('exchange'); setShowForm(false); }}
          >
            Exchanges
          </button>
        </div>
      </header>

      {/* Main content area  can be either: P.O, InBox, Exchange */}
      <main className="main-content">
        {showForm ? (
          <PurchaseOrderForm
            context={formContext}
            onSubmitSuccess={() => setShowForm(false)}
          />
        ) : (
          <>
            <h2 className="section-title">
              {activeTab === 'inbox' ? 'Finalized Exchanges' : 'Active Exchanges'}
            </h2>

            {activeTab === 'inbox' && <InBox />}
            {activeTab === 'exchange' && (
              <Exchange
                onNewOffer={(threadId) => {
                  setFormContext({ mode: "counter", threadId });
                  setShowForm(true);
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;