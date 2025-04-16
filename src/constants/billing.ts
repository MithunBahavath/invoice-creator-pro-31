export interface Buyer {
  name: string;
  address: string;
  gstin: string;
  state: string;
  stateCode: string;
}

export interface PresetItem {
  description: string;
  hsnSac: string;
  defaultRate: number;
  gstRate: number;
  usageType: "Domestic" | "Commercial";
  category: "Cylinder" | "Bottle";
  size?: string;
}

export let BUYERS: Buyer[] = [
  {
    name: "Sample Customer 1",
    address: "123 Main Street, City, State - 612001",
    gstin: "33AAAAA0000A1Z5",
    state: "Tamil Nadu",
    stateCode: "33"
  },
  {
    name: "Sample Customer 2",
    address: "456 Park Avenue, Town, State - 612002",
    gstin: "33BBBBB0000B1Z5",
    state: "Tamil Nadu",
    stateCode: "33"
  }
];

export const PRESET_ITEMS: PresetItem[] = [
  {
    description: "8KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 800,
    gstRate: 5,
    usageType: "Domestic",
    category: "Cylinder",
    size: "8KG"
  },
  {
    description: "12KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 1200,
    gstRate: 5,
    usageType: "Domestic",
    category: "Cylinder",
    size: "12KG"
  },
  {
    description: "17KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 1700,
    gstRate: 5,
    usageType: "Domestic",
    category: "Cylinder",
    size: "17KG"
  },
  {
    description: "21KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 2100,
    gstRate: 5,
    usageType: "Domestic",
    category: "Cylinder",
    size: "21KG"
  },
  {
    description: "33KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 3300,
    gstRate: 18,
    usageType: "Commercial",
    category: "Cylinder",
    size: "33KG"
  },
  {
    description: "1L BOTTLE",
    hsnSac: "27111900",
    defaultRate: 100,
    gstRate: 5,
    usageType: "Domestic",
    category: "Bottle",
    size: "1L"
  },
  {
    description: "2L BOTTLE",
    hsnSac: "27111900",
    defaultRate: 190,
    gstRate: 5,
    usageType: "Domestic",
    category: "Bottle",
    size: "2L"
  }
];

export const getItemsByCategory = (category: PresetItem['category']) => 
  PRESET_ITEMS.filter(item => item.category === category);
