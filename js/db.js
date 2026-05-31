// Database management using localStorage
const DB_KEYS = {
  ITEMS: 'item_comparator_items',
  CONFIG: 'item_comparator_config'
};

const DEFAULT_CONFIG = {
  maxCompareItems: 3,
  adminPassword: 'alperen09'
};

const SEED_ITEMS = [
  // Category: Smartphones
  {
    id: 'phone-1',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    category: 'Smartphones',
    price: 1199,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=60',
    description: 'The ultimate iPhone featuring a strong and lightweight titanium design, new Action button, and A17 Pro chip.',
    features: {
      'Processor': 'A17 Pro (3nm)',
      'RAM': '8 GB LPDDR5',
      'Storage': '256 GB NVMe',
      'Battery': '4441 mAh',
      'Camera': '48 MP Main + 12 MP Ultra Wide + 12 MP 5x Telephoto',
      'Screen Size': '6.7 inches OLED Super Retina XDR, 120Hz',
      'OS': 'iOS 17',
      'Weight': '221g'
    }
  },
  {
    id: 'phone-2',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 1299,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=60',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.',
    features: {
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12 GB LPDDR5X',
      'Storage': '256 GB UFS 4.0',
      'Battery': '5000 mAh',
      'Camera': '200 MP Main + 50 MP Telephoto + 12 MP Ultra Wide',
      'Screen Size': '6.8 inches Dynamic AMOLED 2X, 120Hz',
      'OS': 'Android 14 (One UI 6.1)',
      'Weight': '232g'
    }
  },
  {
    id: 'phone-3',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'Smartphones',
    price: 999,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60',
    description: 'The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera yet.',
    features: {
      'Processor': 'Google Tensor G3',
      'RAM': '12 GB LPDDR5X',
      'Storage': '128 GB UFS 3.1',
      'Battery': '5050 mAh',
      'Camera': '50 MP Main + 48 MP Ultra Wide + 48 MP 5x Telephoto',
      'Screen Size': '6.7 inches Super Actua Display, 120Hz',
      'OS': 'Android 14',
      'Weight': '213g'
    }
  },
  // Category: Laptops
  {
    id: 'laptop-1',
    name: 'MacBook Pro 14\" (M3)',
    brand: 'Apple',
    category: 'Laptops',
    price: 1599,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60',
    description: 'The 14-inch MacBook Pro blasts forward with M3, an incredibly advanced chip that brings serious speed and capability.',
    features: {
      'Processor': 'Apple M3 (8-core CPU, 10-core GPU)',
      'RAM': '8 GB Unified Memory',
      'Storage': '512 GB SSD',
      'Battery': 'Up to 22 hours',
      'Screen Size': '14.2 inches Liquid Retina XDR (120Hz)',
      'OS': 'macOS Sonoma',
      'Weight': '1.55 kg',
      'Ports': '2x Thunderbolt, HDMI, SDXC, MagSafe 3'
    }
  },
  {
    id: 'laptop-2',
    name: 'ROG Zephyrus G14',
    brand: 'ASUS',
    category: 'Laptops',
    price: 1499,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
    description: 'Compact but packing serious gaming power. Featuring an OLED display, premium metal chassis and top-tier specs.',
    features: {
      'Processor': 'AMD Ryzen 9 8945HS',
      'RAM': '16 GB LPDDR5X',
      'Storage': '1 TB PCIe 4.0 NVMe SSD',
      'Battery': 'Up to 10 hours',
      'Screen Size': '14.0 inches ROG Nebula OLED 3K (120Hz)',
      'OS': 'Windows 11 Home',
      'Weight': '1.50 kg',
      'Ports': '1x USB4, 1x USB-C, 2x USB-A, HDMI 2.1'
    }
  },
  {
    id: 'laptop-3',
    name: 'Dell XPS 13 Plus',
    brand: 'Dell',
    category: 'Laptops',
    price: 1399,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=60',
    description: 'Our most powerful 13-inch XPS laptop is up to twice as powerful as before in the same size. Features a seamless keyboard.',
    features: {
      'Processor': 'Intel Core Ultra 7 155H',
      'RAM': '16 GB LPDDR5',
      'Storage': '512 GB PCIe SSD',
      'Battery': 'Up to 13 hours',
      'Screen Size': '13.4 inches FHD+ InfinityEdge (120Hz)',
      'OS': 'Windows 11 Home',
      'Weight': '1.19 kg',
      'Ports': '2x Thunderbolt 4 (USB-C) with Power Delivery'
    }
  },
  // Category: Smartwatches
  {
    id: 'watch-1',
    name: 'Apple Watch Ultra 2',
    brand: 'Apple',
    category: 'Smartwatches',
    price: 799,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&auto=format&fit=crop&q=60',
    description: 'The most rugged and capable Apple Watch pushes the limits again. Featuring the all-new S9 SiP.',
    features: {
      'Display': 'Always-On Retina OLED, up to 3000 nits',
      'Battery': 'Up to 36 hours (72 hours in Low Power)',
      'Case Material': '49mm Titanium',
      'Water Resistance': '100 meters (Swimproof & Dive to 40m)',
      'Sensors': 'ECG, Heart Rate, Blood Oxygen, Temp, Depth',
      'OS': 'watchOS 10',
      'Weight': '61.4g'
    }
  },
  {
    id: 'watch-2',
    name: 'Galaxy Watch 6 Classic',
    brand: 'Samsung',
    category: 'Smartwatches',
    price: 399,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=60',
    description: 'Keep your goals on track with the return of our classic styling. Features a rotating bezel for easy navigation.',
    features: {
      'Display': 'Super AMOLED, up to 2000 nits',
      'Battery': 'Up to 40 hours',
      'Case Material': '47mm Stainless Steel',
      'Water Resistance': '50 meters (IP68 & 5ATM)',
      'Sensors': 'BioActive sensor (HR, ECG, BIA), Temp',
      'OS': 'Wear OS 4 (One UI 5 Watch)',
      'Weight': '59.0g'
    }
  },
  // Category: Tablets
  {
    id: 'tablet-1',
    name: 'iPad Pro 12.9"',
    brand: 'Apple',
    category: 'Tablets',
    price: 1099,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
    description: 'A powerful tablet with a large Liquid Retina XDR display, fast Apple silicon, and pro-level creative workflows.',
    features: {
      'Processor': 'Apple M2',
      'RAM': '8 GB',
      'Storage': '256 GB',
      'Display': '12.9 inches Liquid Retina XDR',
      'Battery': 'Up to 10 hours',
      'Camera': '12 MP Wide + 10 MP Ultra Wide',
      'OS': 'iPadOS',
      'Weight': '682g'
    }
  },
  // Category: Headphones
  {
    id: 'headphone-1',
    name: 'WH-1000XM5',
    brand: 'Sony',
    category: 'Headphones',
    price: 399,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60',
    description: 'Premium wireless headphones with industry-leading noise cancellation, rich audio, and long battery life.',
    features: {
      'Driver': '30mm dynamic driver',
      'Battery': 'Up to 30 hours',
      'Noise Cancellation': 'Adaptive ANC',
      'Connectivity': 'Bluetooth 5.2, USB-C',
      'Microphones': '8 microphones',
      'Weight': '250g',
      'Charging': '3 hours full charge'
    }
  },
  // Category: Cameras
  {
    id: 'camera-1',
    name: 'EOS R50',
    brand: 'Canon',
    category: 'Cameras',
    price: 679,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=60',
    description: 'A compact mirrorless camera designed for creators who need sharp photos, 4K video, and interchangeable lenses.',
    features: {
      'Sensor': '24.2 MP APS-C CMOS',
      'Video': '4K 30fps',
      'Autofocus': 'Dual Pixel CMOS AF II',
      'Lens Mount': 'Canon RF',
      'Connectivity': 'Wi-Fi, Bluetooth, USB-C',
      'Battery': 'LP-E17 rechargeable',
      'Weight': '375g'
    }
  },
  // Category: Monitors
  {
    id: 'monitor-1',
    name: 'UltraGear 27GP850-B',
    brand: 'LG',
    category: 'Monitors',
    price: 349,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
    description: 'A fast gaming monitor with a sharp QHD panel, high refresh rate, and excellent motion clarity.',
    features: {
      'Panel': '27 inches Nano IPS',
      'Resolution': '2560 x 1440 QHD',
      'Refresh Rate': '165Hz',
      'Response Time': '1ms GtG',
      'HDR': 'HDR10',
      'Ports': 'HDMI, DisplayPort, USB',
      'Adaptive Sync': 'G-SYNC Compatible, FreeSync Premium'
    }
  },
  // Category: Gaming Consoles
  {
    id: 'console-1',
    name: 'PlayStation 5',
    brand: 'Sony',
    category: 'Gaming Consoles',
    price: 499,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=60',
    description: 'A next-generation home console with fast SSD storage, immersive haptics, and high-performance gaming.',
    features: {
      'CPU': '8-core AMD Zen 2',
      'GPU': 'AMD RDNA 2',
      'Storage': '825 GB SSD',
      'Resolution': 'Up to 4K',
      'Frame Rate': 'Up to 120fps',
      'Controller': 'DualSense Wireless Controller',
      'Connectivity': 'Wi-Fi, Ethernet, Bluetooth'
    }
  },
  // Category: Speakers
  {
    id: 'speaker-1',
    name: 'SoundLink Revolve+ II',
    brand: 'Bose',
    category: 'Speakers',
    price: 329,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
    description: 'A portable Bluetooth speaker with deep sound, 360-degree coverage, and a durable water-resistant body.',
    features: {
      'Audio': '360-degree sound',
      'Battery': 'Up to 17 hours',
      'Water Resistance': 'IP55',
      'Connectivity': 'Bluetooth, AUX, Micro-B USB',
      'Microphone': 'Built-in speakerphone',
      'Weight': '0.9 kg',
      'Controls': 'On-device buttons and app support'
    }
  },
  // Category: Keyboards
  {
    id: 'keyboard-1',
    name: 'MX Mechanical',
    brand: 'Logitech',
    category: 'Keyboards',
    price: 169,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    description: 'A low-profile wireless mechanical keyboard built for productivity, precision typing, and multi-device workflows.',
    features: {
      'Switch Type': 'Low-profile mechanical tactile',
      'Connectivity': 'Bluetooth, Logi Bolt USB receiver',
      'Battery': 'Up to 15 days with backlight',
      'Backlight': 'Smart illumination',
      'Layout': 'Full-size',
      'Compatibility': 'Windows, macOS, Linux, ChromeOS',
      'Weight': '828g'
    }
  },
  // Category: Mice
  {
    id: 'mouse-1',
    name: 'DeathAdder V3 Pro',
    brand: 'Razer',
    category: 'Mice',
    price: 149,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop&q=60',
    description: 'An ultra-lightweight wireless gaming mouse with a high-precision sensor and esports-focused ergonomics.',
    features: {
      'Sensor': 'Focus Pro 30K Optical Sensor',
      'DPI': 'Up to 30000',
      'Connectivity': 'Razer HyperSpeed Wireless, USB-C',
      'Battery': 'Up to 90 hours',
      'Buttons': '5 programmable buttons',
      'Weight': '63g',
      'Switches': 'Optical Mouse Switches Gen-3'
    }
  },
  // Category: Routers
  {
    id: 'router-1',
    name: 'Archer AX73',
    brand: 'TP-Link',
    category: 'Routers',
    price: 179,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&auto=format&fit=crop&q=60',
    description: 'A Wi-Fi 6 router designed for faster home networking, wider coverage, and many connected devices.',
    features: {
      'Wi-Fi Standard': 'Wi-Fi 6',
      'Speed': 'Up to 5400 Mbps',
      'Bands': 'Dual-band',
      'Ports': '1x Gigabit WAN, 4x Gigabit LAN, USB 3.0',
      'Antennas': '6 external antennas',
      'Security': 'WPA3, HomeShield',
      'Coverage': 'Large homes'
    }
  },
  // Category: Drones
  {
    id: 'drone-1',
    name: 'Mini 4 Pro',
    brand: 'DJI',
    category: 'Drones',
    price: 759,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1506947411487-a56738267384?w=500&auto=format&fit=crop&q=60',
    description: 'A compact camera drone with advanced obstacle sensing, sharp 4K video, and lightweight travel-friendly design.',
    features: {
      'Camera': '48 MP, 1/1.3-inch CMOS',
      'Video': '4K 60fps HDR',
      'Flight Time': 'Up to 34 minutes',
      'Obstacle Sensing': 'Omnidirectional',
      'Transmission': 'DJI O4',
      'Weight': 'Under 249g',
      'Stabilization': '3-axis mechanical gimbal'
    }
  }
];

const DB = {
  // Initialize DB if not already initialized
  init() {
    if (!localStorage.getItem(DB_KEYS.ITEMS)) {
      localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
    } else {
      try {
        const storedItems = JSON.parse(localStorage.getItem(DB_KEYS.ITEMS));
        const storedIds = new Set(storedItems.map(item => item.id));
        const missingSeedItems = SEED_ITEMS.filter(item => !storedIds.has(item.id));

        if (missingSeedItems.length > 0) {
          localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify([...storedItems, ...missingSeedItems]));
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
      }
    }
    if (!localStorage.getItem(DB_KEYS.CONFIG)) {
      localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    } else {
      try {
        const storedConfig = JSON.parse(localStorage.getItem(DB_KEYS.CONFIG));

        if (storedConfig.adminPassword === 'admin123') {
          storedConfig.adminPassword = DEFAULT_CONFIG.adminPassword;
          localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(storedConfig));
        }
      } catch (e) {
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
      }
    }
  },

  // Get configuration
  getConfig() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.CONFIG)) || DEFAULT_CONFIG;
    } catch (e) {
      console.error("Error reading config, resetting to default", e);
      return DEFAULT_CONFIG;
    }
  },

  // Save configuration
  saveConfig(config) {
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(config));
    return config;
  },

  // Get all items
  getItems() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(DB_KEYS.ITEMS)) || SEED_ITEMS;
    } catch (e) {
      console.error("Error reading items, resetting to default seed data", e);
      return SEED_ITEMS;
    }
  },

  // Save or Update an item
  saveItem(item) {
    const items = this.getItems();
    
    if (!item.id) {
      // New item, generate random ID
      item.id = 'item-' + Date.now();
      items.push(item);
    } else {
      // Edit existing item
      const index = items.findIndex(i => i.id === item.id);
      if (index !== -1) {
        items[index] = item;
      } else {
        items.push(item);
      }
    }
    
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(items));
    return item;
  },

  // Delete an item
  deleteItem(id) {
    let items = this.getItems();
    items = items.filter(item => item.id !== id);
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(items));
    return true;
  },

  // Reset database to default
  resetDatabase() {
    localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(SEED_ITEMS));
    localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    return {
      items: SEED_ITEMS,
      config: DEFAULT_CONFIG
    };
  },

  // Export full DB to JSON
  exportDatabase() {
    const data = {
      config: this.getConfig(),
      items: this.getItems()
    };
    return JSON.stringify(data, null, 2);
  },

  // Import full DB from JSON string
  importDatabase(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (data && data.config && Array.isArray(data.items)) {
        localStorage.setItem(DB_KEYS.CONFIG, JSON.stringify(data.config));
        localStorage.setItem(DB_KEYS.ITEMS, JSON.stringify(data.items));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to parse imported JSON", e);
      return false;
    }
  }
};

// Auto initialize on script load
DB.init();

// Export to window object for access in other scripts
window.AppDB = DB;
