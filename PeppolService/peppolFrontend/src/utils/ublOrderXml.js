// XML document generation for UBL Order (Peppol BIS Ordering 3 compatible)


// Helper function to escape XML special characters (otherwise can crash ): )
const escapeXml = (unsafe) => {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Form variables with defaults
export function generateOrderXml(data) {
  const {
    orderId,
    issueDate,
    currency = 'EUR',
    orderTypeCode = '220',
    buyerRef = '',
    validEnd = '',
    buyerName,
    buyerEndpoint,
    buyerVAT = '',
    buyerStreet,
    buyerCity,
    buyerZip,
    buyerCountry = 'SE',
    supplierName,
    supplierEndpoint,
    supplierVAT = '',
    supplierStreet,
    supplierCity,
    supplierZip,
    supplierCountry = 'SE',
    deliveryStreet = '',
    deliveryCity = '',
    deliveryZip = '',
    deliveryCountry = '',
    paymentNote = '',
    paymentMeansCode = '31',
    iban = '',
    bic = '',
    orderLines = [], // array of { name, desc, qty, unit, price }
  } = data;

  // Basic required check (add more as needed)
  if (!orderId || !issueDate || !buyerName || !buyerEndpoint || !supplierName || !supplierEndpoint || orderLines.length === 0) {
    throw new Error('Missing required fields or no order lines');
  }

  // Helper function to split endpoint (e.g. "0088:12345" → scheme="0088", value="12345")
  const parseEndpoint = (str) => {
    const parts = str.split(':');
    if (parts.length >= 2) return { scheme: parts[0], value: parts.slice(1).join(':') };
    return { scheme: '0088', value: str }; // default to 0088 if no scheme provided
  };

  const bEndpoint = parseEndpoint(buyerEndpoint);
  const sEndpoint = parseEndpoint(supplierEndpoint);

  // Build XML for each order line (loop over array)
  let orderLinesXml = '';
  orderLines.forEach((line, i) => {
    const { name, desc = '', qty = '1', unit = 'EA', price = '0' } = line;
    const amount = (parseFloat(qty) * parseFloat(price)).toFixed(2); // qty * price
    orderLinesXml += `
<cac:OrderLine>
  <cbc:ID>${i + 1}</cbc:ID>
  <cac:LineItem>
    <cbc:Quantity unitCode="${escapeXml(unit)}">${escapeXml(qty)}</cbc:Quantity>
    <cbc:LineExtensionAmount currencyID="${escapeXml(currency)}">${escapeXml(amount)}</cbc:LineExtensionAmount>
    <cac:Price>
      <cbc:PriceAmount currencyID="${escapeXml(currency)}">${escapeXml(parseFloat(price).toFixed(2))}</cbc:PriceAmount>
      <cbc:BaseQuantity unitCode="${escapeXml(unit)}">1</cbc:BaseQuantity>
    </cac:Price>
    <cac:Item>
      <cbc:Name>${escapeXml(name)}</cbc:Name>
      ${desc ? `<cbc:Description>${escapeXml(desc)}</cbc:Description>` : ''}
    </cac:Item>
  </cac:LineItem>
</cac:OrderLine>`;
  });

  // Optional sections (only include if data provided)
  const validityXml = validEnd ? `
<cac:ValidityPeriod>
  <cbc:EndDate>${escapeXml(validEnd)}</cbc:EndDate>
</cac:ValidityPeriod>` : '';

  const deliveryXml = (deliveryStreet || deliveryCity || deliveryZip || deliveryCountry) ? `
<cac:Delivery>
  <cac:DeliveryLocation>
    <cac:Address>
      ${deliveryStreet ? `<cbc:StreetName>${escapeXml(deliveryStreet)}</cbc:StreetName>` : ''}
      ${deliveryCity ? `<cbc:CityName>${escapeXml(deliveryCity)}</cbc:CityName>` : ''}
      ${deliveryZip ? `<cbc:PostalZone>${escapeXml(deliveryZip)}</cbc:PostalZone>` : ''}
      ${deliveryCountry ? `<cac:Country><cbc:IdentificationCode>${escapeXml(deliveryCountry)}</cbc:IdentificationCode></cac:Country>` : ''}
    </cac:Address>
  </cac:DeliveryLocation>
</cac:Delivery>` : '';

  const paymentXml = (paymentNote || iban) ? `
<cac:PaymentTerms>
  ${paymentNote ? `<cbc:Note>${escapeXml(paymentNote)}</cbc:Note>` : ''}
</cac:PaymentTerms>
${iban ? `
<cac:PaymentMeans>
  <cbc:PaymentMeansCode>${escapeXml(paymentMeansCode)}</cbc:PaymentMeansCode>
  <cac:PayeeFinancialAccount>
    <cbc:ID>${escapeXml(iban)}</cbc:ID>
    ${bic ? `<cac:FinancialInstitutionBranch><cac:FinancialInstitution><cbc:ID>${escapeXml(bic)}</cbc:ID></cac:FinancialInstitution></cac:FinancialInstitutionBranch>` : ''}
  </cac:PayeeFinancialAccount>
</cac:PaymentMeans>` : ''}` : '';

  // Full UBL XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<Order xmlns="urn:oasis:names:specification:ubl:schema:xsd:Order-2"
       xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
       xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:CustomizationID>urn:fdc:peppol.eu:poacc:trns:order:3</cbc:CustomizationID>
  <cbc:ProfileID>urn:fdc:peppol.eu:poacc:bis:ordering:3</cbc:ProfileID>
  <cbc:ID>${escapeXml(orderId)}</cbc:ID>
  <cbc:IssueDate>${escapeXml(issueDate)}</cbc:IssueDate>
  <cbc:OrderTypeCode>${escapeXml(orderTypeCode)}</cbc:OrderTypeCode>
  <cbc:DocumentCurrencyCode>${escapeXml(currency)}</cbc:DocumentCurrencyCode>
  ${buyerRef ? `<cbc:CustomerReference>${escapeXml(buyerRef)}</cbc:CustomerReference>` : ''}
  ${validityXml}
  <cac:BuyerCustomerParty>
    <cac:Party>
      <cbc:EndpointID schemeID="${escapeXml(bEndpoint.scheme)}">${escapeXml(bEndpoint.value)}</cbc:EndpointID>
      <cac:PartyName><cbc:Name>${escapeXml(buyerName)}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${escapeXml(buyerStreet)}</cbc:StreetName>
        <cbc:CityName>${escapeXml(buyerCity)}</cbc:CityName>
        <cbc:PostalZone>${escapeXml(buyerZip)}</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>${escapeXml(buyerCountry)}</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      ${buyerVAT ? `<cac:PartyTaxScheme><cbc:CompanyID>${escapeXml(buyerVAT)}</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>` : ''}
    </cac:Party>
  </cac:BuyerCustomerParty>
  <cac:SellerSupplierParty>
    <cac:Party>
      <cbc:EndpointID schemeID="${escapeXml(sEndpoint.scheme)}">${escapeXml(sEndpoint.value)}</cbc:EndpointID>
      <cac:PartyName><cbc:Name>${escapeXml(supplierName)}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${escapeXml(supplierStreet)}</cbc:StreetName>
        <cbc:CityName>${escapeXml(supplierCity)}</cbc:CityName>
        <cbc:PostalZone>${escapeXml(supplierZip)}</cbc:PostalZone>
        <cac:Country><cbc:IdentificationCode>${escapeXml(supplierCountry)}</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      ${supplierVAT ? `<cac:PartyTaxScheme><cbc:CompanyID>${escapeXml(supplierVAT)}</cbc:CompanyID><cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme></cac:PartyTaxScheme>` : ''}
    </cac:Party>
  </cac:SellerSupplierParty>
  ${deliveryXml}
  ${paymentXml}
  ${orderLinesXml}
</Order>`;
}