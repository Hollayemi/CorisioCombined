export const size: string[] = [
    "EU 39",
    "EU 40",
    "EU 41",
    "EU 42",
    "EU 43",
    "EU 44",
];
export const color: string[] = [
    "#2A347E",
    "#FDB415",
    "#EF5DA8",
    "#FF0C0C",
    "#424242",
];

export type Review = {
    id: number | string;
    comment: string;
    rating: number;
    image?: string,
    date: string;
    user?: string;
};

const review: Review[] = [
    {
        id: 1,
        comment:
            "I couldn't be happier with my purchase! The vendor provided exceptional customer service, answering all my queries promptly. The denim shoe fits perfectly and looks amazing.",
        rating: 4,
        date: "2 days ago",
    },
    {
        id: 2,
        comment:
            "Fantastic vendor! The denim shoe arrived promptly and in pristine condition. Excellent communication throughout the process. Highly satisfied.",
        rating: 3,
        date: "3 days ago",
    },
    {
        id: 3,
        comment:
            "Highly recommended vendor! The delivery was fast and hassle-free. The denim shoe itself is well-crafted and comfortable. Will definitely buy from this vendor again.",
        rating: 5,
        date: "3 days ago",
    },
    {
        id: 4,
        comment:
            "I couldn't be happier with my purchase! The vendor provided exceptional customer service, answering all my queries promptly. The denim shoe fits perfectly and looks amazing.",
        rating: 3,
        date: "3 days ago",
    },
];
export default review
export type Similar = {
    id: number | string;
    price: string;
    rating: number;
    description: string;
};

export const similar: Similar[] = [
    {
        id: 1,
        price: "27,000",
        rating: 4,
        description: "Men’s slip on walkabout sport shoes -blo2 -B.....",
    },
    {
        id: 2,
        price: "21,000",
        rating: 4,
        description: "Flame Rigidus Lace Up Sneakers.",
    },
    {
        id: 3,
        price: "16,000",
        rating: 4,
        description: "SHK Men Casual Sneakers - canvas Shoes-Blue",
    },
    {
        id: 4,
        price: "27,000",
        rating: 4,
        description: "Men’s slip on walkabout sport shoes -blo2 -B.....",
    },
    {
        id: 5,
        price: "27,000",
        rating: 4,
        description: "Men’s slip on walkabout sport shoes -blo2 -B.....",
    },
];

export const sampleSpecs: any = {
    sizes: [
        {
            size: "EU-35",
            colors: ["Black", "Brown"]
        },
        {
            size: "EU-36",
            colors: ["Black", "Brown", "Tan"]
        },
        
        {
            size: "EU-38",
            colors: ["Black"]
        }
    ],
    variations: {
        Gender: "Men's",
        Material: "Leather",
        Toe_Style: "Round Toe",
        Sole_Material: "Rubber",
        Closure_Type: "Lace-up"
    }
};