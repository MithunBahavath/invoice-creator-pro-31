
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
    defaultRate: 800
  },
  {
    description: "12KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 1200
  },
  {
    description: "17KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 1700
  },
  {
    description: "21KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 2100
  },
  {
    description: "33KG CYLINDER",
    hsnSac: "27111900",
    defaultRate: 3300
  }
];
