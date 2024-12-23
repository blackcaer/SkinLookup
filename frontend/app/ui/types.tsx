export interface ItemInfo {
    appId: number;
    itemType: string;               //
    itemCollection: string;         //
    name: string;                   //
    nameId: number;
    previewUrl: string;
    supplyTotalEstimated: number;   //
    timeAccepted: string;           //
    storePrice: number;             //
}

export interface PItem {    // Portfolio Item
    item: ItemInfo;
    count: number;
  }