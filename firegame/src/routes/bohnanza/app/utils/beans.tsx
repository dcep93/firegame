export type Bean = {
  name: string;
  index: number;
  quantity: number;
  earnings: number[];
  pic: string;
};

const beans: Bean[] = [
  {
    pic: "https://media.hswstatic.com/eyJidWNrZXQiOiJjb250ZW50Lmhzd3N0YXRpYy5jb20iLCJrZXkiOiJnaWZcL2Nob2NvbGF0ZS0zLmpwZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6ODI4fX19",
    name: "Cocoa Bean",
    quantity: 4,
    earnings: [NaN, 2, 3, 4],
  },
  {
    pic: "https://m.media-amazon.com/images/I/510KSRM8SoL._AC_SS450_.jpg",
    name: "Garden Bean",
    quantity: 6,
    earnings: [NaN, 2, 3, NaN],
  },
  {
    pic: "https://www.chinasichuanfood.com/wp-content/uploads/2019/03/sweetened-red-beans.jpg",
    name: "Red Bean",
    quantity: 8,
    earnings: [2, 3, 4, 5],
  },
  {
    pic: "https://images-na.ssl-images-amazon.com/images/I/61E6hkjSoeL._SL1160_.jpg",
    name: "Black-Eyed Bean",
    quantity: 10,
    earnings: [2, 4, 5, 6],
  },
  {
    pic: "https://d12oja0ew7x0i8.cloudfront.net/images/Article_Images/ImageForArticle_17355(1).jpg",
    name: "Soy Bean",
    quantity: 12,
    earnings: [2, 4, 6, 7],
  },
  {
    pic: "https://solidstarts.com/wp-content/uploads/Green-Bean-scaled.jpg",
    name: "Green Bean",
    quantity: 14,
    earnings: [3, 5, 6, 7],
  },
  {
    pic: "https://t4.ftcdn.net/jpg/03/66/98/45/360_F_366984595_Rz7k8J155dPP4hxsgQHri4COsQqPUd5l.jpg",
    name: "Stink Bean",
    quantity: 16,
    earnings: [3, 5, 7, 8],
  },
  {
    pic: "https://blog.fatfreevegan.com/wp-content/uploads/2007/01/pinto-bean-chili-600.jpg",
    name: "Chili Bean",
    quantity: 18,
    earnings: [3, 6, 8, 9],
  },
  {
    pic: "https://i.pinimg.com/originals/95/71/97/9571975d07d73b9543ff46a947590a86.jpg",
    name: "Blue Bean",
    quantity: 20,
    earnings: [4, 6, 8, 10],
  },
  {
    pic: "https://cdn.shopify.com/s/files/1/1698/1675/products/Bean_Golden_Top_Notch_Wax.jpg?v=1536767913",
    name: "Wax Bean",
    quantity: 22,
    earnings: [4, 5, 9, 11],
  },
  {
    pic: "https://www.thespruceeats.com/thmb/rp9gGaQi2jxQx4k6BuQ0uV7Jwmw=/1417x1417/smart/filters:no_upscale()/Coffee-beans-581b95643df78cc2e873e234.jpg",
    name: "Coffee Bean",
    quantity: 24,
    earnings: [4, 7, 10, 12],
  },
].map((b, i) => ({ ...b, index: i }));

export default beans;
