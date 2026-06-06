const fs = require('fs');
const mockPath = 'src/constants/mock.json';
const data = JSON.parse(fs.readFileSync(mockPath, 'utf8'));

const newCategories = [
  { id: "cat-1", name: "Vegetables", description: "Fresh organic vegetables", productsCount: 45, createdAt: "12 May", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80" },
  { id: "cat-2", name: "Fruits", description: "Seasonal fresh fruits", productsCount: 32, createdAt: "15 May", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80" },
  { id: "cat-3", name: "Dairy Products", description: "Milk, Butter, Cheese", productsCount: 28, createdAt: "16 May", image: "" },
  { id: "cat-4", name: "Bakery & Bread", description: "Freshly baked breads, buns, and cakes", productsCount: 15, createdAt: "18 May", image: "" },
  { id: "cat-5", name: "Meat & Seafood", description: "Fresh cuts, poultry, and fish", productsCount: 40, createdAt: "19 May", image: "" },
  { id: "cat-6", name: "Snacks & Branded Foods", description: "Chips, biscuits, and namkeen", productsCount: 112, createdAt: "20 May", image: "" },
  { id: "cat-7", name: "Beverages", description: "Soft drinks, juices, tea, and coffee", productsCount: 85, createdAt: "22 May", image: "" },
  { id: "cat-8", name: "Personal Care", description: "Shampoos, soaps, and skincare", productsCount: 150, createdAt: "23 May", image: "" },
  { id: "cat-9", name: "Home Care", description: "Detergents, cleaners, and paper goods", productsCount: 65, createdAt: "24 May", image: "" },
  { id: "cat-10", name: "Baby Care", description: "Diapers, wipes, and baby food", productsCount: 34, createdAt: "25 May", image: "" },
  { id: "cat-11", name: "Pet Supplies", description: "Dog food, cat litter, and treats", productsCount: 22, createdAt: "26 May", image: "" },
  { id: "cat-12", name: "Spices & Masalas", description: "Whole and powdered Indian spices", productsCount: 78, createdAt: "28 May", image: "" },
  { id: "cat-13", name: "Pulses & Dals", description: "Lentils, beans, and chickpeas", productsCount: 42, createdAt: "29 May", image: "" },
  { id: "cat-14", name: "Rice & Grains", description: "Basmati, wheat, and millets", productsCount: 18, createdAt: "30 May", image: "" },
  { id: "cat-15", name: "Edible Oils & Ghee", description: "Cooking oils and pure ghee", productsCount: 250, createdAt: "1 Jun", image: "" },
  { id: "cat-16", name: "Frozen Foods", description: "Frozen peas, snacks, and ice cream", productsCount: 300, createdAt: "2 Jun", image: "" },
  { id: "cat-17", name: "Breakfast & Cereals", description: "Oats, cornflakes, and muesli", productsCount: 240, createdAt: "2 Jun", image: "" },
  { id: "cat-18", name: "Sweets & Chocolates", description: "Candies, gourmet chocolates, and traditional sweets", productsCount: 600, createdAt: "3 Jun", image: "" },
  { id: "cat-19", name: "Health & Wellness", description: "Supplements, protein powders, and vitamins", productsCount: 150, createdAt: "4 Jun", image: "" },
  { id: "cat-20", name: "Stationery", description: "Pens, notebooks, and office supplies", productsCount: 450, createdAt: "5 Jun", image: "" }
];

data.categories = newCategories;

fs.writeFileSync(mockPath, JSON.stringify(data, null, 2));
console.log("Mock data updated successfully.");
