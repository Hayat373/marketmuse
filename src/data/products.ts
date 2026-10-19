export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  color: string;
  image: string;
  position: [number, number, number];
  description: string;
  tag?: string;
  coord4D: [number, number, number, number]; // [X, Y, Z, W] in hyperspace
  chronoEpoch: string;
  geometryType: "coat" | "gem" | "sneaker" | "bag" | "sculpture" | "ring";
  materialFinish: string;
  specifications: string[];
};

export const products: Product[] = [
  {
    id: 1,
    name: "The Sculpted Coat",
    category: "Outerwear",
    price: 340,
    color: "Ethereal Camel",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=85",
    position: [-3.2, 1.8, 1.3],
    description:
      "A fluid 4D tailoring silhouette engineered with dynamic temporal drape and reactive thermal micro-structures.",
    tag: "4D CHRONO",
    coord4D: [0.82, 0.44, -0.61, 1.15],
    chronoEpoch: "EPOCH 01 // TEMPORAL DRAPE",
    geometryType: "coat",
    materialFinish: "Dynamic Memory Wool & Spacetime Weave",
    specifications: [
      "Reactive Chrono-drape geometry",
      "Liquid-repellent nano-coating",
      "Self-recovering structural memory",
      "Hyper-dimensional hidden magnetic seams"
    ]
  },
  {
    id: 2,
    name: "Everyday Form",
    category: "Essentials",
    price: 145,
    color: "Luminous Ivory",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
    position: [0, 1.8, 1.5],
    description:
      "A refined spatial essential woven with prismatic fibers that gently adjust reflectance under ambient lighting shifts.",
    tag: "NEW ARRIVAL",
    coord4D: [0.12, 0.95, 0.33, 0.74],
    chronoEpoch: "EPOCH 02 // ZERO-G MESH",
    geometryType: "gem",
    materialFinish: "Photonic Bamboo & Organic Titanium Core",
    specifications: [
      "Prismatic optical reflectance",
      "Zero-gravity breathable knit",
      "Seamless 4-way hyper-stretch",
      "Bioluminescent edge stitch"
    ]
  },
  {
    id: 3,
    name: "Soft Structure",
    category: "Tailoring",
    price: 280,
    color: "Obsidian Stone",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85",
    position: [3.2, 1.8, 1.3],
    description:
      "Modern hyper-tailoring meets anti-gravity kinetic comfort in this modular, architectural two-piece ensemble.",
    tag: "ICONIC",
    coord4D: [-0.67, 0.28, 0.89, -0.42],
    chronoEpoch: "EPOCH 03 // ARCHITECTONIC",
    geometryType: "sculpture",
    materialFinish: "Micro-Pleated Cashmere & Liquid Obsidian",
    specifications: [
      "Algorithmic kinetic pleats",
      "Concealed aerodynamic ventilation",
      "Uncreaseable hyper-matrix weave",
      "Matte titanium hardware closures"
    ]
  },
  {
    id: 4,
    name: "The Daily Carry",
    category: "Accessories",
    price: 220,
    color: "Espresso Chrome",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85",
    position: [-4.5, 1.7, -3.1],
    description:
      "An origami-folded geometric bag forged from flexible aerospace composite with magnetic levitation closures.",
    tag: "QUANTUM",
    coord4D: [0.49, -0.76, 0.52, 0.88],
    chronoEpoch: "EPOCH 04 // POLYTAL COMPOSITE",
    geometryType: "bag",
    materialFinish: "Aerospace Poly-Composite & Mag-Lock",
    specifications: [
      "Magnetic levitation seal",
      "Fold-flat non-Euclidean storage",
      "Waterproof chronometer compartment",
      "Liquid-metal finish hardware"
    ]
  },
  {
    id: 5,
    name: "Off-Duty Knit",
    category: "Knitwear",
    price: 195,
    color: "Oat Titanium",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85",
    position: [0, 1.7, -4],
    description:
      "A cloud-weight spatial knit with volumetric honeycomb chambers that trap warmth while floating seamlessly against skin.",
    tag: "EDITOR'S PICK",
    coord4D: [-0.34, 0.81, -0.45, -0.92],
    chronoEpoch: "EPOCH 05 // HONEYCOMB AURA",
    geometryType: "ring",
    materialFinish: "Volumetric Alpaca & Hyper-Filament",
    specifications: [
      "Honeycomb thermo-chambers",
      "Micro-filament seamless knitting",
      "Dual-spectrum interior lining",
      "Laser-trimmed scalloped cuffs"
    ]
  },
  {
    id: 6,
    name: "Weekend Classic",
    category: "Footwear",
    price: 260,
    color: "Prism Cream",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    position: [4.5, 1.7, -3.1],
    description:
      "A forward-thinking sneaker cast with a generative 4D-printed lattice midsole delivering supreme energy return and spatial poise.",
    tag: "BESTSELLER",
    coord4D: [0.73, -0.32, -0.84, 0.65],
    chronoEpoch: "EPOCH 06 // 4D LATTICE",
    geometryType: "sneaker",
    materialFinish: "4D Generative Polymer & Liquid Rubber",
    specifications: [
      "Generative 4D-printed hollow sole",
      "Kinetic stride energy absorption",
      "Recycled aerospace knit upper",
      "Reflective hyper-contrast accents"
    ]
  },
];
