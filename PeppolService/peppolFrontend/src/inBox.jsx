import React, { useState, useEffect } from 'react';

// Dummy data for testing
const dummyDocumentPairs = [
  {
    id: 1,
    company: 'Santa Clause Inc.',
    date: '2025-12-24',
    po: `<PurchaseOrder>
<Items>
  <Item>Toy Car - 10 units</Item>
  <Item>Doll - 15 units</Item>
  </Items>
<Amount>1000.00</Amount>
</PurchaseOrder>`,
    invoice: `<Invoice>
  <Supplier>Santa Clause Inc.</Supplier>
  <Amount>1000.00</Amount>
</Invoice>`,
  },
  {
    id: 2,
    company: 'Pablo',
    date: '2000-01-01',
    po: `<PurchaseOrder>
  <OrderNumber>PO54321</OrderNumber>
  <Items>
    <Item>Shampoo 1000 units</Item>
  </Items>
</PurchaseOrder>`,
    invoice: `<Invoice>
  <InvoiceNumber>INV09876</InvoiceNumber>
  <Amount>1000.00</Amount>
</Invoice>`,
  },
];

function InBox() {
  const [documentPairs, setDocumentPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState(null);

  useEffect(() => {
    setDocumentPairs(dummyDocumentPairs);
  }, []);

  return (
    <div className="inbox-container">
      <div className="inbox-sidebar">
        <ul className="exchange-list">
          {documentPairs.map((docPair) => (
            <li
              key={docPair.id}
              onClick={() => setSelectedPair(docPair)}
              className={`exchange-item ${
                selectedPair?.id === docPair.id ? 'selected' : ''
              }`}
            >
              <strong>{docPair.company}</strong>
              <br />
              <small>{docPair.date}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="inbox-detail-pane">
        {selectedPair ? (
          <>
            <h2 className="detail-header">
              {selectedPair.company} | {selectedPair.date}
            </h2>

            <h3>Purchase Order</h3>
            <pre className="xml-block">{selectedPair.po}</pre>

            <h3>Invoice</h3>
            <pre className="xml-block">{selectedPair.invoice}</pre>
          </>
        ) : (
          <div className="no-selection">
            <p>Select a finalized exchange to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InBox;
