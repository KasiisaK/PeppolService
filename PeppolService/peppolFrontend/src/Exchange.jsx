import React, { useState, useEffect } from 'react';

// Dummy data for testing
const dummyThreads = [
  {
    id: 1,
    company: 'Santa Clause Inc.',
    status: 'Done',
    messages: [
      {
        from: 'You',
        date: '2025-12-22',
        content: `<PurchaseOrder>
<Items>
  <Item>Toy Car - 10 units</Item>
  <Item>Doll - 15 units</Item>
</Items>
<Amount>900.00</Amount>
</PurchaseOrder>`,
      },
      {
        from: 'Santa Clause Inc.',
        date: '2025-11-23',
        content: `<PurchaseOrder>
<Items>
  <Item>Toy Car - 10 units</Item>
  <Item>Doll - 15 units</Item>
</Items>
<Amount>1100.00</Amount>
</PurchaseOrder>`,
      },
      {
        from: 'You',
        date: '2025-11-24',
        content: `<PurchaseOrder>
<Items>
  <Item>Toy Car - 10 units</Item>
  <Item>Doll - 15 units</Item>
</Items>
<Amount>1000.00</Amount>
</PurchaseOrder>`,
      },
    ],
  },
];

function Exchange({ onNewOffer }) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);

  useEffect(() => {
    setThreads(dummyThreads);
  }, []);

  const handleNewOffer = (threadId) => {
    if (onNewOffer) onNewOffer(threadId);
  };

  const handleAgree = (threadId) => {
    alert(`Agreed on thread ${threadId}`);
  };

  const handleDisagree = (threadId) => {
    alert(`Disagreed on thread ${threadId}`);
  };

  return (
    <div className="master-detail-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul className="list">
          {threads.map((thread) => (
            <li
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`list-item ${selectedThread?.id === thread.id ? 'selected' : ''}`}
            >
              <strong>{thread.company}</strong>
              <br />
              <small className="thread-status">{"status: " + thread.status}</small>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail pane */}
      <div className="detail-pane">
        {selectedThread ? (
          <>
            <h2 className="detail-header">{selectedThread.company}</h2>

            {selectedThread.messages.map((msg, index) => (
              <div key={index} className="thread-message">
                <strong>{msg.from}</strong> — {msg.date}
                <pre className="xml-block">{msg.content}</pre>
              </div>
            ))}

            <div className="actions-row">
              <button className="btn btn-success" onClick={() => handleAgree(selectedThread.id)}>
                Agree
              </button>
              <button className="btn btn-danger" onClick={() => handleDisagree(selectedThread.id)}>
                Disagree
              </button>
              <button className="btn btn-primary" onClick={() => handleNewOffer(selectedThread.id)}>
                New Offer
              </button>
            </div>
          </>
        ) : (
          <div className="no-selection">
            <p>Select an exchange to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exchange;