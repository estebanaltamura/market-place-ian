export enum Entities {
  'rewards' = 'rewards',
  'purchases' = 'purchases',
}

export type EntityTypesMapReturnedValues = {
  [Entities.rewards]: IRewardEntity;
  [Entities.purchases]: IPurchaseEntity;
};

export type EntityTypesMapPayloadValues = {
  [Entities.rewards]: IReward;
  [Entities.purchases]: IPurchase;
};

export interface IRewardEntity extends IReward {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseEntity extends IPurchase {
  id: string;
  state: StateTypes;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchase {
  rewardId: string;
  title: string;
  description: string;
  price: number;
  rewardCategory: RewardCategoryTypes;
}

export interface IReward {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rewardCategory: RewardCategoryTypes;
}

export const EnumRewardTypes = {
  title: 'string',
  description: 'string',
  price: 'number',
  imageUrl: 'string',
  rewardCategory: 'RewardCategoryTypes',
};

export const EnumPurchaseTypes = {
  rewardId: 'string',
};

export const EntityEnumTypesMap = {
  rewards: EnumRewardTypes,
  purchases: EnumPurchaseTypes,
};

export enum RewardCategoryTypes {
  'food' = 'food',
  'videoGamesTime' = 'videoGamesTime',
  'toys' = 'toys',
  'screenTime' = 'screenTime',
  'mpCredit' = 'mpCredit',
}

export enum StateTypes {
  'active' = 'active',
  'inactive' = 'inactive',
}
