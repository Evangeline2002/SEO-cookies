const orderPayload = {
    customer_name: "Test",
    phone: "9999999999",
    address: "Test Addr",
    payment_method: "Cash on Delivery",
    total_amount: 500,
    subtotal: 500,
    delivery_charge: 0,
    discount: 0,
    tax: 0,
    grand_total: 500,
    items: [{ name: "Cookie", quantity: 1, price: 500 }]
};

fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
}).then(r => r.json()).then(console.log).catch(console.error);
