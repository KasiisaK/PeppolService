import React, { useState, useEffect } from 'react';

// Dummy data for testing
const dummyThreads = [
  {
    id: 1,
    company: 'Santa Clause Inc.',
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

function Exchange() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);

  useEffect(() => {
    setThreads(dummyThreads);
  }, []);

  return (
    <div className="inbox-container">
      {/* Sidebar with list of exchanges (threads) */}
      <div className="inbox-sidebar">
        <ul className="exchange-list">
          {threads.map((thread) => (
            <li
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`exchange-item ${
                selectedThread?.id === thread.id ? 'selected' : ''
              }`}
            >
              <strong>{thread.company}</strong>
              <br />
              <small>{thread.messages[0]?.date}</small>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Detail pane showing the negotiation thread for the selected exchange */}
      <div className="inbox-detail-pane">
          {selectedThread ? (
            <>
              <h2 className="detail-header">
                {selectedThread.company}
              </h2>

              {selectedThread.messages.map((msg, index) => (
                <div key={index} className="thread-message">
                  <strong>{msg.from}</strong> — <small>{msg.date}</small>
                  <pre className="xml-block">{msg.content}</pre>
                </div>
              ))}

              {/* Action buttons for agreeing/disagreing and making a counter proposal */}
              <div className="exchange-actions">
                <button
                  className="exchange-agree-button"
                  onClick={() => handleAgree(selectedThread.id)}
                >
                  Agree
                </button>

                <button
                  className="exchange-disagree-button"
                  onClick={() => handleDisagree(selectedThread.id)}
                >
                  Disagree
                </button>

                <button
                  className="exchange-new-offer-button"
                  onClick={() => handleNewOffer(selectedThread.id)}
                >
                  New Offer
                </button>
              </div>
            </>
          ) : (
            /* Placeholder for when no exchange is selected */
            <div className="no-selection">
              <p>Select an exchange to view the negotiation thread.</p>
            </div>
          )}
      </div>
    </div>
  );
}

export default Exchange;
