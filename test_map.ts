const raw = {
  "id": "54ca3709-5e71-4010-bb0b-d51902da9e3e",
  "createdAt": "2026-06-16T06:03:00.282Z",
  "customer": { "email": "krishna@gmail.com", "name": "Krishnaa", "phone": "+919335389594" },
  "deliveryAddress": "Noida, Noida, near Noida, Noida, Up, 123456",
  "address": {
    "city": "Noida",
    "flat": "Noida",
    "fullName": "Satyam ",
    "id": "35c641d2-5b91-4e0e-a588-c9ae90eac83e",
    "landmark": "Noida",
    "latitude": 28.5747,
    "longitude": 77.3242,
    "mobile": "8318456136",
    "pincode": "123456",
    "state": "Up",
    "street": "Noida",
    "type": "home"
  },
  "items": [
    {
      "image": "/uploads/products/1781502970943-26b1791c-115b-41c2-bf7b-7eedaf125c4f.jpg",
      "name": "Amul Fresh Paneer 200g",
      "price": 200,
      "productId": "857ff8ca-2216-402c-bbba-e259cf8e5d7d",
      "quantity": 1
    }
  ],
  "paymentMethod": "COD",
  "paymentStatus": "Pending",
  "status": "Pending",
  "subtotal": 200,
  "deliveryCharge": 40,
  "taxes": 10,
  "discount": 0,
  "totalAmount": 250,
  "timeline": [
    { "status": "Pending", "timestamp": "2026-06-16T06:03:00.282Z" }
  ],
  "availableStatusUpdates": ["confirmed", "processing", "cancelled"],
  "payment": null
};

const mapOrder = (raw: any): any => ({
  id: raw.id,
  customerName: raw.customer?.name ?? raw.customerName ?? "Unknown",
  customerPhone: raw.customer?.phone ?? raw.customerPhone ?? "",
  customerEmail: raw.customer?.email ?? raw.customerEmail ?? "",
  orderDate: raw.orderDate ?? raw.createdAt ?? new Date().toISOString(),
  status: raw.status,
  address: {
    flatNo: raw.deliveryAddress?.flatNo ?? raw.address?.flatNo ?? raw.address?.flat ?? "",
    area: raw.deliveryAddress?.area ?? raw.address?.area ?? raw.address?.street ?? "",
    city: raw.deliveryAddress?.city ?? raw.address?.city ?? "",
    pincode: raw.deliveryAddress?.pincode ?? raw.address?.pincode ?? "",
    state: raw.deliveryAddress?.state ?? raw.address?.state ?? "",
  },
  items: (raw.items ?? []).map((item: any) => ({
    productId: item.productId ?? item.product?.id ?? "",
    productName: item.productName ?? item.product?.name ?? item.name ?? "Unknown",
    quantity: item.quantity ?? 1,
    unitPrice: item.unitPrice ?? item.price ?? 0,
    image: item.image,
  })),
  payment: {
    method: (raw.paymentMethod ?? raw.payment?.method ?? "UPI"),
    status: (raw.paymentStatus ?? raw.payment?.status ?? "Pending"),
    transactionId: raw.payment?.transactionId,
  },
  timeline: (raw.timeline ?? []).map((entry: any) => ({
    status: entry.status,
    timestamp: entry.timestamp,
    note: entry.note,
  })),
  subtotal: raw.subtotal ?? 0,
  deliveryFee: raw.deliveryFee ?? raw.deliveryCharge ?? 0,
  tax: raw.tax ?? raw.taxes ?? 0,
  total: raw.totalAmount ?? raw.total ?? raw.grandTotal ?? 0,
  availableStatusUpdates: raw.availableStatusUpdates,
});

try {
  console.log(mapOrder(raw));
} catch (e) {
  console.error("Caught error:", e);
}
