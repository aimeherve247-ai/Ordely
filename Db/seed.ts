import { getDb } from "../api/queries/connection";
import { products, orders, staff, categories, activityLog } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // ─── Categories ───
  await db.insert(categories).values([
    { name: "Tous", sortOrder: 0, isVisible: true },
    { name: "Vins", sortOrder: 1, isVisible: true },
    { name: "Plats Africains", sortOrder: 2, isVisible: true },
    { name: "Grillades", sortOrder: 3, isVisible: true },
    { name: "Cocktails", sortOrder: 4, isVisible: true },
    { name: "Desserts", sortOrder: 5, isVisible: true },
  ]);
  console.log("✓ Categories seeded");

  // ─── Products ───
  await db.insert(products).values([
    {
      name: "Thiéboudienne Royal",
      description: "Poisson grillé accompagné de riz aux légumes, sauce tomate épicée",
      price: 12000,
      category: "Plats Africains",
      image: "/assets/product-1.jpg",
      badge: "Populaire",
      stockQuantity: 15,
      minStockLevel: 5,
      isAvailable: true,
    },
    {
      name: "Cocktail Signature Ambre",
      description: "Cocktail maison à base de rhum ambré, fruit de la passion et citron vert",
      price: 8000,
      category: "Cocktails",
      image: "/assets/product-2.jpg",
      badge: null,
      stockQuantity: 50,
      minStockLevel: 10,
      isAvailable: true,
    },
    {
      name: "Assiette Grillades Mixtes",
      description: "Brochettes de bœuf, côtelettes d'agneau et poulet grillé avec légumes",
      price: 18000,
      category: "Grillades",
      image: "/assets/product-3.jpg",
      badge: "Populaire",
      stockQuantity: 8,
      minStockLevel: 5,
      isAvailable: true,
    },
    {
      name: "Vin Rouge Château 2019",
      description: "Bouteille de vin rouge premium, cépage Cabernet Sauvignon",
      price: 25000,
      category: "Vins",
      image: "/assets/product-4.jpg",
      badge: null,
      stockQuantity: 12,
      minStockLevel: 3,
      isAvailable: true,
    },
    {
      name: "Tarte Mango Passion",
      description: "Tarte aux mangues fraîches et fruit de la passion sur sablé breton",
      price: 6000,
      category: "Desserts",
      image: "/assets/product-5.jpg",
      badge: null,
      stockQuantity: 10,
      minStockLevel: 3,
      isAvailable: true,
    },
    {
      name: "Mafé Traditionnel",
      description: "Ragoût de bœuf au beurre de cacahuète, servi avec riz blanc",
      price: 10000,
      category: "Plats Africains",
      image: "/assets/product-6.jpg",
      badge: "Pimenté",
      stockQuantity: 20,
      minStockLevel: 5,
      isAvailable: true,
    },
  ]);
  console.log("✓ Products seeded");

  // ─── Staff ───
  await db.insert(staff).values([
    {
      name: "Kofi Mensah",
      email: "kofi@ordely.com",
      phone: "+225 01 23 45 67",
      role: "manager",
      avatar: "/assets/avatar-1.jpg",
      isActive: true,
    },
    {
      name: "Aminata Diallo",
      email: "aminata@ordely.com",
      phone: "+225 07 89 01 23",
      role: "server",
      avatar: "/assets/avatar-2.jpg",
      isActive: true,
    },
    {
      name: "Jean-Baptiste Kouamé",
      email: "jb@ordely.com",
      phone: "+225 05 67 89 01",
      role: "chef",
      avatar: "/assets/avatar-3.jpg",
      isActive: true,
    },
  ]);
  console.log("✓ Staff seeded");

  // ─── Orders ───
  await db.insert(orders).values([
    {
      tableNumber: 4,
      customerName: "Jean D.",
      status: "pending",
      totalAmount: 35000,
      paymentMethod: null,
      items: [
        { productId: 1, name: 'Grand Format "Ambre"', quantity: 1, price: 25000 },
        { productId: 2, name: "Cocktails Signature", quantity: 2, price: 5000 },
      ],
    },
    {
      tableNumber: 2,
      customerName: "Marie K.",
      status: "preparing",
      totalAmount: 42000,
      paymentMethod: null,
      items: [
        { productId: 3, name: "Plats du jour", quantity: 3, price: 10000 },
        { productId: 4, name: "Vin rouge", quantity: 1, price: 12000 },
      ],
    },
    {
      tableNumber: 8,
      customerName: "Paul M.",
      status: "ready",
      totalAmount: 18000,
      paymentMethod: null,
      items: [
        { productId: 2, name: "Bières", quantity: 2, price: 5000 },
        { productId: 3, name: "Assiette grillades", quantity: 1, price: 8000 },
      ],
    },
    {
      tableNumber: 1,
      customerName: "Sophie L.",
      status: "pending",
      totalAmount: 65000,
      paymentMethod: null,
      items: [
        { productId: 1, name: "Menu dégustation", quantity: 1, price: 65000 },
      ],
    },
  ]);
  console.log("✓ Orders seeded");

  // ─── Activity Log ───
  await db.insert(activityLog).values([
    {
      type: "order",
      message: "Nouvelle commande — Table 04 (Jean D.)",
      metadata: { table: 4, amount: 35000 },
    },
    {
      type: "payment",
      message: "Paiement reçu — 42 000 FCFA (Table 02)",
      metadata: { table: 2, amount: 42000 },
    },
    {
      type: "stock_alert",
      message: "Alerte stock — Vodka Grey Goose (2 restantes)",
      metadata: { product: "Vodka Grey Goose", remaining: 2 },
    },
    {
      type: "order_ready",
      message: "Commande prête — Table 08 (Paul M.)",
      metadata: { table: 8 },
    },
    {
      type: "order",
      message: "Nouvelle commande — Table 01 (Sophie L.)",
      metadata: { table: 1, amount: 65000 },
    },
  ]);
  console.log("✓ Activity log seeded");

  console.log("\nSeed complete!");
}

seed().catch(console.error);
