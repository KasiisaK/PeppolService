import React, { useState, useEffect } from 'react';

const dummyThreads = [
  {
    id: 1,
    company: 'North Pole Supplies',
    subject: 'Purchase Order – Winter Equipment',
    messages: [
      {
        from: 'You',
        date: '2025-11-01',
        content: `<PurchaseOrder>
  <Item>Snow Plows - 5 units</Item>
  <Price>5000</Price>
</PurchaseOrder>`,
      },
      {
        from: 'North Pole Supplies',
        date: '2025-11-02',
        content: `<CounterProposal>
  <Item>Snow Plows - 5 units</Item>
  <Price>5500</Price>
</CounterProposal>`,
      },
    ],
  },
  {
    id: 2,
    company: 'Elf Logistics',
    subject: 'Bulk Wrapping Paper',
    messages: [
      {
        from: 'You',
        date: '2025-10-15',
        content: `<PurchaseOrder>
  <Item>Wrapping Paper - 10,000 rolls</Item>
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
              <small>{thread.subject}</small>
            </li>
          ))}
        </ul>
      </div>

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
          </>
        ) : (
          <div className="no-selection">
            <p>Select an exchange to view the negotiation thread.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exchange;
