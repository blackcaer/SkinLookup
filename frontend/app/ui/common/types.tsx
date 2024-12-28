export interface ItemInfo {
    appId: number;
    itemType: string;               
    itemCollection: string;         
    name: string;                   
    nameId: number;
    previewUrl: string;
    supplyTotalEstimated: number;   
    timeAccepted: string;           
    storePrice: number;             
}

export interface PItem {    // Portfolio Item
    itemData: ItemData;
    count: number;
  }

  export interface PriceHistory {
    date: string;
    median: number;
    volume: number;
}

export interface ItemData {
    item: ItemInfo;
    timeRefreshed: string;
    priceWeekAgo: number | null;
    priceNow: number | null;
    phsm: PriceHistory[];
}