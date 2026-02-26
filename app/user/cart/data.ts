export type prop = {
  id: number | string;
  title: string;
  price: string;
  size: string;
  color: string;
  store: string;
};


const cart: prop[] = [
  {
    id: 1,
    color: "#222023",
    price: "23,700",
    size: "EU-45",
    store: "Gourmet Stores",
    title: "BHKH New Shoes For Men 2022 Spring Denim Athletic Sneakers",
  },
  {
    id: 2,
    color: "#D9D8C4",
    price: "27,000",
    size: "xxl",
    store: "Gourmet Stores",
    title: "2023 Hawaii Shirts and Coconut Tree ",
  },
  {
    id: 3,
    color: "#64331D",
    price: "10,900",
    size: "eu-44",
    store: "Amoy Life",
    title: "Leather Men Ankle Boots Plus Size High",
  },
];

export default cart