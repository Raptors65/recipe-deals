type Breadcrumb = {
  categoryCode: string
  categoryType: string
  name: string
  url: string
};

type FilterGroupValue = {
  code: string
  count: number
  disabled: null
  selected: boolean
};

type FilterGroup = {
  code: string
  isDynamic: boolean
  multiSelect: boolean
  name: string
  values: FilterGroupValue[]
};

type OfferTypes = {
  OG: number
};

type Pagination = {
  pageNumber: number
  pageSize: number
  totalResults: number
};

type Aisle = {
  name: string
};

export type Badge = {
  expiryDate: string | null
  name: string
  promoType: null
  text: string | null
  type: string
};

type Badges = {
  dealBadge: Badge | null
  loyaltyBadge: Badge | null
  newItemBadge: Badge | null
  textBadge: Badge | null
};

type ImageAsset = {
  imageUrl: null
  largeRetinaUrl: string
  largeUrl: string
  mediumRetinaUrl: string
  mediumUrl: string
  smallRetinaUrl: string
  smallUrl: string
};

export type Price = {
  quantity: number
  reasonCode: number | null
  type: string | null
  unit: 'ea' | 'g' | 'ml'
  value: number
};

type Prices = {
  comparisonPrices: Price[]
  price: Price
  wasPrice: Price | null
};

type PricingUnits = {
  interval: number
  maxOrderQuantity: number
  minOrderQuantity: number
  type: string
  unit: string
  weighted: boolean
};

type Result = {
  aisle: Aisle
  articleNumber: string
  badges: Badges
  brand: string
  code: string
  description: string
  fees: null
  hasMultipleOffers: boolean
  imageAssets: ImageAsset[]
  isVariant: boolean
  link: string
  name: string
  offerType: string
  packageSize: string
  prices: Prices
  pricingUnits: PricingUnits
  sellerId: string
  sellerName: string
  shoppable: boolean
  sponsored: boolean
  stockStatus: string
  taxes: null
  uom: string
};

type Sort = {
  code: string
  name: string
  selected: boolean
};

export type LoblawsResponse = {
  breadcrumbs: Breadcrumb[]
  categoryName: string
  correctedQuery: null
  dym: []
  filterGroups: FilterGroup[]
  modelVersion: string
  offerTypes: OfferTypes
  pagination: Pagination
  query: null
  requestId: string
  results: Result[]
  searchVariation: string
  sorts: Sort[]
  sponsoredCarousels: []
};

// STORES

type Address = {
  country: string
  formattedAddress: string
  line1: string
  line2: string
  postalCode: string
  region: string
  town: string
};

type Department = {
  name: string
};

type GeoPoint = {
  latitude: number
  longitude: number
};

type OpenNowResponseData = {
  date: string
  hours: string
  openNow: boolean
};

export type Store = {
  address: Address
  bufferTimeInHours: number
  contactNumber: string
  departments: Department[]
  features: string[]
  geoPoint: GeoPoint
  id: string
  isShoppable: boolean
  locationDescription: string | null
  locationType: 'SPOKE' | 'STORE'
  name: string
  openNowResponseData: OpenNowResponseData
  ownerName: string
  partner: null
  pickupType: 'DELIVERY' | 'SELF_SERVE_LIGHT' | 'STORE'
  storeBannerId: 'loblaw'
  storeBannerName: 'Loblaws'
  storeId: string
  timeZone: string
  visible: boolean
};
