import React, { useState } from 'react';
import { generateOrderXml } from './utils/ublOrderXml'; // Path to the XML generation utility

// Can receive two modes via "context": "create" (default) or "counter" (for counter proposals)
export default function PurchaseOrderForm({ context, onSubmitSuccess }) {
  const isCounter = context?.mode === 'counter';

  // Form variables with defaults
  const [form, setForm] = useState({
    orderId: '',
    issueDate: new Date().toISOString().split('T')[0],
    currency: 'EUR',
    orderTypeCode: '220',
    buyerRef: '',
    validEnd: '',
    buyerName: '',
    buyerEndpoint: '',
    buyerVAT: '',
    buyerStreet: '',
    buyerCity: '',
    buyerZip: '',
    buyerCountry: 'SE',
    supplierName: '',
    supplierEndpoint: '',
    supplierVAT: '',
    supplierStreet: '',
    supplierCity: '',
    supplierZip: '',
    supplierCountry: 'SE',
    deliveryStreet: '',
    deliveryCity: '',
    deliveryZip: '',
    deliveryCountry: 'SE',
    perfStart: '',
    perfEnd: '',
    paymentNote: '',
    paymentMeansCode: '31',
    iban: '',
    bic: '',
  });

  // Lines of items in the order
  const [orderLines, setOrderLines] = useState([
    { name: '', desc: '', qty: '1', unit: 'EA', price: '0.00' },
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [previewXml, setPreviewXml] = useState('');

  // Updates field values in the form state when typing
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Updates a specific field in a specific order line
  const updateLine = (index, field, value) => {
    const newLines = [...orderLines];
    newLines[index][field] = value;
    setOrderLines(newLines);
  };

  // Adds a new empty line to the order
  const addLine = () => {
    setOrderLines([...orderLines, { name: '', desc: '', qty: '1', unit: 'EA', price: '0.00' }]);
  };

  // Removes a line from the order by index
  const removeLine = (index) => {
    if (orderLines.length > 1) setOrderLines(orderLines.filter((_, i) => i !== index));
  };

  // Shows a modal with the generated XML for preview before submission
  const handlePreview = () => {
    try {
      const xml = generateOrderXml({ ...form, orderLines });
      setPreviewXml(xml);
      setShowPreview(true);
    } catch (err) {
      alert('Cannot generate XML: ' + err.message);
    }
  };

  // Handles form submission, generates XML and shows in console (replace with actual send logic)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const xml = generateOrderXml({ ...form, orderLines });
      console.log('Generated XML:\n', xml);
      //TODO: Send XML to backend
      alert('Purchase Order created! (XML in console)');
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="po-container">
      <header>
        <div>
          <h1 className="po-header"> Purchase Order</h1>
          <strong className='counter-header'>{isCounter ? 'Counter Proposal' : 'New Order'}</strong>
        </div>
      </header>

      <form className="po-form" onSubmit={handleSubmit}>
        {/* Document details */}
        <section className="form-section card">
          <h2>Document</h2>
          <div className="form-grid-3">
            <div className="form-group">
              <label>Order ID *</label>
              <input name="orderId" value={form.orderId} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Issue Date *</label>
              <input type="date" name="issueDate" value={form.issueDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Currency *</label>
              <select name="currency" value={form.currency} onChange={handleChange} required>
                <option value="EUR">EUR</option>
                <option value="SEK">SEK</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Order Type</label>
              <select name="orderTypeCode" value={form.orderTypeCode} onChange={handleChange}>
                <option value="220">220 — Purchase order</option>
                <option value="227">227 — Service order</option>
              </select>
            </div>
            <div className="form-group">
              <label>Buyer Reference</label>
              <input name="buyerRef" value={form.buyerRef} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Validity End (optional)</label>
              <input type="date" name="validEnd" value={form.validEnd} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* Buyer details */}
        <div className="form-grid-2">
          <section className="form-section card">
            <h2>Buyer</h2>
            <div className="form-stack">
              <input name="buyerName" placeholder="Name *" value={form.buyerName} onChange={handleChange} required />
              <input name="buyerEndpoint" placeholder="Endpoint ID *" value={form.buyerEndpoint} onChange={handleChange} required />
              <input name="buyerVAT" placeholder="VAT Number (optional)" value={form.buyerVAT} onChange={handleChange} />
              <input name="buyerStreet" placeholder="Street *" value={form.buyerStreet} onChange={handleChange} required />
              <div className="form-grid-2">
                <input name="buyerCity" placeholder="City *" value={form.buyerCity} onChange={handleChange} required />
                <input name="buyerZip" placeholder="Postal Code *" value={form.buyerZip} onChange={handleChange} required />
              </div>
              <select name="buyerCountry" value={form.buyerCountry} onChange={handleChange}>
                <option value="SE">SE — Sweden</option>
                <option value="NO">NO — Norway</option>
                <option value="FI">FI — Finland</option>
              </select>
            </div>
          </section>

          {/* Supplier details */}
          <section className="form-section card">
            <h2>Supplier</h2>
            <div className="form-stack">
              <input name="supplierName" placeholder="Name *" value={form.supplierName} onChange={handleChange} required />
              <input name="supplierEndpoint" placeholder="Endpoint ID *" value={form.supplierEndpoint} onChange={handleChange} required />
              <input name="supplierVAT" placeholder="VAT Number (optional)" value={form.supplierVAT} onChange={handleChange} />
              <input name="supplierStreet" placeholder="Street *" value={form.supplierStreet} onChange={handleChange} required />
              <div className="form-grid-2">
                <input name="supplierCity" placeholder="City *" value={form.supplierCity} onChange={handleChange} required />
                <input name="supplierZip" placeholder="Postal Code *" value={form.supplierZip} onChange={handleChange} required />
              </div>
              <select name="supplierCountry" value={form.supplierCountry} onChange={handleChange}>
                <option value="SE">SE — Sweden</option>
                <option value="NO">NO — Norway</option>
                <option value="FI">FI — Finland</option>
              </select>
            </div>
          </section>
        </div>

        {/* Delivery & Payment details */}
        <section className="form-section card">
          <h2>Delivery & Payment Terms</h2>
          <div className="form-grid-2">
            <div>
              <h3>Delivery Location</h3>
              <div className="form-stack">
                <input name="deliveryStreet" placeholder="Street" value={form.deliveryStreet} onChange={handleChange} />
                <div className="form-grid-2">
                  <input name="deliveryCity" placeholder="City" value={form.deliveryCity} onChange={handleChange} />
                  <input name="deliveryZip" placeholder="Postal Code" value={form.deliveryZip} onChange={handleChange} />
                </div>
                <select name="deliveryCountry" value={form.deliveryCountry} onChange={handleChange}>
                  <option value="SE">SE — Sweden</option>
                </select>
              </div>
            </div>

            <div>
              <h3>Payment Terms</h3>
              <div className="form-stack">
                <input name="paymentNote" placeholder="Net 30 days..." value={form.paymentNote} onChange={handleChange} />
                <input name="iban" placeholder="Supplier IBAN" value={form.iban} onChange={handleChange} />
                <input name="bic" placeholder="Supplier BIC" value={form.bic} onChange={handleChange} />
              </div>
            </div>
          </div>
        </section>

        {/* Order lines */}
        <section className="form-section card">
          <div className="section-header">
            <h2>Order Lines</h2>
            <button type="button" className="btn btn-primary" onClick={addLine}>
              + Add Line
            </button>
          </div>

          {orderLines.map((line, i) => (
            <div key={i} className="order-line-row">
              <input
                className="line-name"
                placeholder="Item name *"
                value={line.name}
                onChange={(e) => updateLine(i, 'name', e.target.value)}
                required
              />
              <input
                className="line-desc"
                placeholder="Description"
                value={line.desc}
                onChange={(e) => updateLine(i, 'desc', e.target.value)}
              />
              <input
                type="number"
                className="line-qty"
                value={line.qty}
                onChange={(e) => updateLine(i, 'qty', e.target.value)}
                required
              />
              <select
                className="line-unit"
                value={line.unit}
                onChange={(e) => updateLine(i, 'unit', e.target.value)}
              >
                <option value="EA">EA</option>
                <option value="HUR">HUR</option>
                <option value="DAY">DAY</option>
              </select>
              <input
                type="number"
                step="0.01"
                className="line-price"
                value={line.price}
                onChange={(e) => updateLine(i, 'price', e.target.value)}
                required
              />
              <button type="button" className="btn btn-danger" onClick={() => removeLine(i)}>
                Remove
              </button>
            </div>
          ))}
        </section>

        {/* Action buttons */}
        <div className="actions-row">
          <button type="button" className="btn btn-secondary" onClick={() => onSubmitSuccess?.()}>
            Cancel
          </button>
          <button type="button" className="btn btn-outline" onClick={handlePreview}>
            Preview XML
          </button>
          <button type="submit" className="btn btn-primary">
            {isCounter ? 'Send Counter Proposal' : 'Create & Send Purchase Order'}
          </button>
        </div>
      </form>

      {/* XML preview */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>UBL XML Preview</h3>
              <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            </div>
            <pre className="xml-preview">{previewXml}</pre>
          </div>
        </div>
      )}
    </div>
  );
}