import React, { useState } from "react";

// constatants for generating XML (can be extended as needed)
export default function PurchaseOrderForm({ context, onSubmitSuccess }) {
  const [form, setForm] = useState({
    orderId: "",
    issueDate: "",
    currency: "EUR",
    buyerName: "",
    supplierName: "",
    itemName: "",
    quantity: 1,
    price: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // XML structure with placeholders for form values
  const buildXML = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Order>
  <ID>${form.orderId}</ID>
  <IssueDate>${form.issueDate}</IssueDate>
  <Currency>${form.currency}</Currency>
  <Buyer>${form.buyerName}</Buyer>
  <Supplier>${form.supplierName}</Supplier>
  <Item>
    <Name>${form.itemName}</Name>
    <Quantity>${form.quantity}</Quantity>
    <Price>${form.price}</Price>
  </Item>
</Order>`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const xml = buildXML();

    // API send new xml file based on context
    if (context?.mode === "new") {
      // Create new thread + order
      await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xml })
      });
    } else if (context?.mode === "counter") {
      // Add order to existing thread
      await fetch(`/api/threads/${context.threadId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xml })
      });
    }

    if (onSubmitSuccess) onSubmitSuccess();
  };

  // Example placeholder purchase order form
  return (
    <div className="purchase-form">
      <h2>
        {context?.mode === "counter"
          ? "Counter Proposal"
          : "New Purchase Order"}
      </h2>

      {context?.mode === "counter" && (
        <p>Thread ID: {context.threadId}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="orderId"
          placeholder="Order ID"
          value={form.orderId}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="issueDate"
          value={form.issueDate}
          onChange={handleChange}
          required
        />

        <input
          name="buyerName"
          placeholder="Buyer name"
          value={form.buyerName}
          onChange={handleChange}
          required
        />

        <input
          name="supplierName"
          placeholder="Supplier name"
          value={form.supplierName}
          onChange={handleChange}
          required
        />

        <input
          name="itemName"
          placeholder="Item"
          value={form.itemName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Unit price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {context?.mode === "counter"
            ? "Send Counter Proposal"
            : "Create Purchase Order"}
        </button>
      </form>
    </div>
  );
}
