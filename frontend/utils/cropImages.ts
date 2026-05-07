export const cropImages: Record<string, string> = {
  // Cereals
  'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
  'Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
  'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600',
  'Bajra': 'https://images.unsplash.com/photo-1628151834165-2769c84918e7?auto=format&fit=crop&q=80&w=600',
  'Jowar': 'https://images.unsplash.com/photo-1615833239614-2f2b2f15b532?auto=format&fit=crop&q=80&w=600',
  'Barley': 'https://images.unsplash.com/photo-1560007889-73a3ee46bc1b?auto=format&fit=crop&q=80&w=600',

  // Vegetables
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f02bad675?auto=format&fit=crop&q=80&w=600',
  'Onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&q=80&w=600',
  'Tomato': 'https://images.unsplash.com/photo-1546473427-e140d4d1c3e2?auto=format&fit=crop&q=80&w=600',
  'Garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
  'Ginger': 'https://images.unsplash.com/photo-1615485247078-478401c5140c?auto=format&fit=crop&q=80&w=600',
  'Chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119f70dc?auto=format&fit=crop&q=80&w=600',
  'Brinjal': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600',
  'Eggplant': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=600',
  'Cabbage': 'https://images.unsplash.com/photo-1561131245-79d678bb5f07?auto=format&fit=crop&q=80&w=600',
  'Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?auto=format&fit=crop&q=80&w=600',
  'Lemon': 'https://images.unsplash.com/photo-1590502593452-325d3558702c?auto=format&fit=crop&q=80&w=600',
  'Peas': 'https://images.unsplash.com/photo-1592394533824-9440e5d68530?auto=format&fit=crop&q=80&w=600',
  'Okra': 'https://images.unsplash.com/photo-1627916607164-fa9869677594?auto=format&fit=crop&q=80&w=600',
  'Bhindi': 'https://images.unsplash.com/photo-1627916607164-fa9869677594?auto=format&fit=crop&q=80&w=600',

  // Fruits
  'Apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&q=80&w=600',
  'Banana': 'https://images.unsplash.com/photo-1603833665858-381a1c790b2b?auto=format&fit=crop&q=80&w=600',
  'Grapes': 'https://images.unsplash.com/photo-1533604133580-6070a5979dbe?auto=format&fit=crop&q=80&w=600',
  'Pomegranate': 'https://images.unsplash.com/photo-1615485500704-8e990f3900f7?auto=format&fit=crop&q=80&w=600',
  'Mango': 'https://images.unsplash.com/photo-1553334820-552ee0420588?auto=format&fit=crop&q=80&w=600',
  'Orange': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=600',
  'Watermelon': 'https://images.unsplash.com/photo-1587049352861-81000bc17f2d?auto=format&fit=crop&q=80&w=600',

  // Pulses & Oilseeds
  'Gram': 'https://images.unsplash.com/photo-1615833239614-2f2b2f15b532?auto=format&fit=crop&q=80&w=600',
  'Chana': 'https://images.unsplash.com/photo-1615833239614-2f2b2f15b532?auto=format&fit=crop&q=80&w=600',
  'Moong': 'https://images.unsplash.com/photo-1615833239614-2f2b2f15b532?auto=format&fit=crop&q=80&w=600',
  'Mustard': 'https://images.unsplash.com/photo-1628151834165-2769c84918e7?auto=format&fit=crop&q=80&w=600',
  'Soyabean': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=600',
  'Groundnut': 'https://images.unsplash.com/photo-1536620948427-f938699942f2?auto=format&fit=crop&q=80&w=600',
  'Sunflower': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=600',

  // Others
  'Cotton': 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=600',
  'Sugarcane': 'https://images.unsplash.com/photo-1592832122594-c0c6bad718b1?auto=format&fit=crop&q=80&w=600',
  'Jute': 'https://images.unsplash.com/photo-1590234193433-28669910d9f4?auto=format&fit=crop&q=80&w=600',
};

export const getCropImage = (name: string) => {
  if (!name) return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600';
  
  const searchName = name.toLowerCase();
  for (const key in cropImages) {
    if (searchName.includes(key.toLowerCase())) {
      return cropImages[key];
    }
  }
  return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600';
};
