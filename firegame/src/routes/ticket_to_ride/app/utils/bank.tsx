export enum City {
  vancouver,
  seattle,
  portland,
  san_francisco,
  los_angeles,
  calgary,
  helena,
  salt_lake_city,
  las_vegas,
  phoenix,
  el_paso,
  santa_fe,
  denver,
  winnipeg,
  duluth,
  omaha,
  kansas_city,
  oklahoma_city,
  dallas,
  houston,
  new_orleans,
  little_rock,
  saint_louis,
  chicago,
  toronto,
  sault_st_marie,
  pittsburgh,
  nashville,
  raleigh,
  atlanta,
  charleston,
  miami,
  washington,
  new_york,
  boston,
  montreal,
}

export const Map: {
  src: string;
  refs: { [c in City]?: { top: number; left: number } };
} = {
  src: "https://raw.githubusercontent.com/dcep93/firegame/master/firegame/src/routes/ticket_to_ride/assets/usa.jpeg",
  refs: {
    [City.san_francisco]: { top: 224, left: 68 },
    [City.seattle]: { top: 53, left: 117 },
    [City.el_paso]: { top: 371, left: 273 },
    [City.kansas_city]: { top: 250, left: 450 },
    [City.new_orleans]: { top: 410, left: 523 },
    [City.saint_louis]: { top: 257, left: 510 },
    [City.chicago]: { top: 196, left: 541 },
    [City.miami]: { top: 466, left: 685 },
    [City.boston]: { top: 150, left: 753 },
    [City.new_york]: { top: 185, left: 724 },
  },
};

export type CityType = { name: string; latitude: number; longitude: number };

export const Cities: {
  [c in City]: CityType;
} = {
  [City.vancouver]: {
    name: "Vancouver",
    latitude: 49.15,
    longitude: -123.1,
  },
  [City.seattle]: {
    name: "Seattle",
    latitude: 47.45,
    longitude: -122.3,
  },
  [City.portland]: {
    name: "Portland",
    latitude: 45.6,
    longitude: -122.6,
  },
  [City.san_francisco]: {
    name: "San Francisco",
    latitude: 37.75,
    longitude: -122.68,
  },
  [City.los_angeles]: {
    name: "Los Angeles",
    latitude: 33.93,
    longitude: -118.4,
  },
  [City.calgary]: {
    name: "Calgary",
    latitude: 51.0,
    longitude: -114.1,
  },
  [City.helena]: {
    name: "Helena",
    latitude: 46.6,
    longitude: -112.0,
  },
  [City.salt_lake_city]: {
    name: "Salt Lake City",
    latitude: 40.78,
    longitude: -111.97,
  },
  [City.las_vegas]: {
    name: "Las Vegas",
    latitude: 36.08,
    longitude: -115.17,
  },
  [City.phoenix]: {
    name: "Phoenix",
    latitude: 33.43,
    longitude: -112.02,
  },
  [City.el_paso]: {
    name: "El Paso",
    latitude: 31.8,
    longitude: -106.4,
  },
  [City.santa_fe]: {
    name: "Santa Fe",
    latitude: 35.62,
    longitude: -106.08,
  },
  [City.denver]: {
    name: "Denver",
    latitude: 39.75,
    longitude: -104.87,
  },
  [City.winnipeg]: {
    name: "Winnipeg",
    latitude: 50.38,
    longitude: -96.19,
  },
  [City.duluth]: {
    name: "Duluth",
    latitude: 46.83,
    longitude: -92.18,
  },
  [City.omaha]: {
    name: "Omaha",
    latitude: 41.37,
    longitude: -96.02,
  },
  [City.kansas_city]: {
    name: "Kansas City",
    latitude: 39.32,
    longitude: -94.72,
  },
  [City.oklahoma_city]: {
    name: "Oklahoma City",
    latitude: 35.4,
    longitude: -97.6,
  },
  [City.dallas]: {
    name: "Dallas",
    latitude: 32.85,
    longitude: -96.85,
  },
  [City.houston]: {
    name: "Houston",
    latitude: 29.65,
    longitude: -95.28,
  },
  [City.new_orleans]: {
    name: "New Orleans",
    latitude: 30.03,
    longitude: -90.03,
  },
  [City.little_rock]: {
    name: "Little Rock",
    latitude: 35.22,
    longitude: -92.38,
  },
  [City.saint_louis]: {
    name: "Saint Louis",
    latitude: 38.75,
    longitude: -90.37,
  },
  [City.chicago]: {
    name: "Chicago",
    latitude: 41.9,
    longitude: -87.65,
  },
  [City.toronto]: {
    name: "Toronto",
    latitude: 43.39,
    longitude: -79.2,
  },
  [City.sault_st_marie]: {
    name: "Sault St Marie",
    latitude: 46.47,
    longitude: -84.37,
  },
  [City.pittsburgh]: {
    name: "Pittsburgh",
    latitude: 40.5,
    longitude: -80.22,
  },
  [City.nashville]: {
    name: "Nashville",
    latitude: 36.12,
    longitude: -86.68,
  },
  [City.raleigh]: {
    name: "Raleigh",
    latitude: 35.87,
    longitude: -78.78,
  },
  [City.atlanta]: {
    name: "Atlanta",
    latitude: 33.65,
    longitude: -84.42,
  },
  [City.charleston]: {
    name: "Charleston",
    latitude: 32.9,
    longitude: -80.03,
  },
  [City.miami]: {
    name: "Miami",
    latitude: 25.82,
    longitude: -80.28,
  },
  [City.washington]: {
    name: "Washington",
    latitude: 38.95,
    longitude: -77.46,
  },
  [City.new_york]: {
    name: "New York",
    latitude: 40.77,
    longitude: -73.98,
  },
  [City.boston]: {
    name: "Boston",
    latitude: 42.37,
    longitude: -71.03,
  },
  [City.montreal]: {
    name: "Montreal",
    latitude: 47.14,
    longitude: 84.39,
  },
};

export enum Color {
  grey,
  yellow,
  blue,
  green,
  pink,
  white,
  black,
  orange,
  red,
}

export const Routes: {
  start: City;
  end: City;
  length: number;
  colors: Color[];
}[] = [
  {
    start: City.vancouver,
    end: City.seattle,
    length: 1,
    colors: [Color.grey, Color.grey],
  },
  {
    start: City.seattle,
    end: City.portland,
    length: 1,
    colors: [Color.grey, Color.grey],
  },
  {
    start: City.portland,
    end: City.san_francisco,
    length: 5,
    colors: [Color.pink, Color.green],
  },
  {
    start: City.san_francisco,
    end: City.los_angeles,
    length: 3,
    colors: [Color.yellow, Color.pink],
  },
  {
    start: City.los_angeles,
    end: City.el_paso,
    length: 6,
    colors: [Color.black],
  },
  {
    start: City.vancouver,
    end: City.calgary,
    length: 3,
    colors: [Color.grey],
  },
  {
    start: City.calgary,
    end: City.seattle,
    length: 4,
    colors: [Color.grey],
  },
  {
    start: City.helena,
    end: City.seattle,
    length: 6,
    colors: [Color.yellow],
  },
  {
    start: City.calgary,
    end: City.helena,
    length: 4,
    colors: [Color.grey],
  },
  {
    start: City.helena,
    end: City.salt_lake_city,
    length: 3,
    colors: [Color.pink],
  },
  {
    start: City.portland,
    end: City.salt_lake_city,
    length: 6,
    colors: [Color.blue],
  },
  {
    start: City.san_francisco,
    end: City.salt_lake_city,
    length: 5,
    colors: [Color.orange, Color.white],
  },
  {
    start: City.salt_lake_city,
    end: City.las_vegas,
    length: 3,
    colors: [Color.orange],
  },
  {
    start: City.las_vegas,
    end: City.los_angeles,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.los_angeles,
    end: City.phoenix,
    length: 3,
    colors: [Color.grey],
  },
  {
    start: City.phoenix,
    end: City.denver,
    length: 5,
    colors: [Color.white],
  },
  {
    start: City.denver,
    end: City.helena,
    length: 4,
    colors: [Color.green],
  },
  {
    start: City.helena,
    end: City.calgary,
    length: 4,
    colors: [Color.blue],
  },
  {
    start: City.winnipeg,
    end: City.duluth,
    length: 4,
    colors: [Color.black],
  },
  {
    start: City.winnipeg,
    end: City.sault_st_marie,
    length: 6,
    colors: [Color.grey],
  },
  {
    start: City.duluth,
    end: City.toronto,
    length: 6,
    colors: [Color.pink],
  },
  {
    start: City.sault_st_marie,
    end: City.montreal,
    length: 5,
    colors: [Color.black],
  },
  {
    start: City.montreal,
    end: City.new_york,
    length: 3,
    colors: [Color.blue],
  },
  {
    start: City.saint_louis,
    end: City.pittsburgh,
    length: 5,
    colors: [Color.green],
  },
  {
    start: City.denver,
    end: City.omaha,
    length: 4,
    colors: [Color.pink],
  },
  {
    start: City.helena,
    end: City.omaha,
    length: 5,
    colors: [Color.red],
  },
  {
    start: City.helena,
    end: City.duluth,
    length: 6,
    colors: [Color.orange],
  },
  {
    start: City.el_paso,
    end: City.oklahoma_city,
    length: 5,
    colors: [Color.yellow],
  },
  {
    start: City.el_paso,
    end: City.houston,
    length: 6,
    colors: [Color.green],
  },
  {
    start: City.houston,
    end: City.new_orleans,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.houston,
    end: City.miami,
    length: 6,
    colors: [Color.red],
  },
  {
    start: City.miami,
    end: City.atlanta,
    length: 5,
    colors: [Color.blue],
  },
  {
    start: City.miami,
    end: City.charleston,
    length: 4,
    colors: [Color.pink],
  },
  {
    start: City.atlanta,
    end: City.charleston,
    length: 2,
    colors: [Color.grey],
  },
  {
    start: City.el_paso,
    end: City.dallas,
    length: 4,
    colors: [Color.red],
  },
  {
    start: City.little_rock,
    end: City.nashville,
    length: 3,
    colors: [Color.white],
  },
];

export type TicketType = { start: City; end: City; points: number };

const e = {};
export default e;
