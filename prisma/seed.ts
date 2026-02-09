
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    const menuData = [
        {
            category: "Maggi & Ramen",
            items: [
                { name: "Classic Maggi", price: 50 },
                { name: "Cheese Maggi", price: 70 },
                { name: "Schezwan Maggi", price: 60 },
                { name: "Korean Ramen", price: 120 },
            ]
        },
        {
            category: "Fries & Snacks",
            items: [
                { name: "Salted Fries", price: 80 },
                { name: "Peri Peri Fries", price: 90 },
                { name: "Cheese Loaded Fries", price: 110 },
                { name: "Chicken Nuggets", price: 120 },
            ]
        },
        {
            category: "Tea",
            items: [
                { name: "Masala Chai", price: 30 },
                { name: "Ginger Chai", price: 30 },
                { name: "Lemon Tea", price: 40 },
                { name: "Green Tea", price: 40 },
            ]
        },
        {
            category: "Hot Coffee",
            items: [
                { name: "Espresso", price: 60 },
                { name: "Cappuccino", price: 90 },
                { name: "Latte", price: 100 },
                { name: "Mocha", price: 110 },
            ]
        },
        {
            category: "Cold Coffee & Frappe",
            items: [
                { name: "Classic Cold Coffee", price: 100 },
                { name: "Hazelnut Frappe", price: 140 },
                { name: "Caramel Frappe", price: 140 },
                { name: "Oreo Shake", price: 130 },
            ]
        },
        {
            category: "Breads & Bun",
            items: [
                { name: "Bun Maska", price: 40 },
                { name: "Garlic Bread", price: 80 },
                { name: "Cheese Garlic Bread", price: 100 },
            ]
        },
        {
            category: "Puff",
            items: [
                { name: "Veg Puff", price: 30 },
                { name: "Paneer Puff", price: 40 },
            ]
        },
        {
            category: "Pasta",
            items: [
                { name: "Red Sauce Pasta", price: 150 },
                { name: "White Sauce Pasta", price: 160 },
                { name: "Mixed Sauce Pasta", price: 170 },
            ]
        },
        {
            category: "Nachos & Chips",
            items: [
                { name: "Cheese Nachos", price: 120 },
                { name: "Salsa Nachos", price: 100 },
            ]
        },
        {
            category: "Desserts & Waffles",
            items: [
                { name: "Chocolate Waffle", price: 100 },
                { name: "Nutella Waffle", price: 140 },
                { name: "Brownie with Ice Cream", price: 120 },
            ]
        },
        {
            category: "Full Meal Special",
            items: [
                { name: "Rajma Chawal", price: 120 },
                { name: "Chole Bhature", price: 120 },
            ]
        }
    ]

    for (const section of menuData) {
        const category = await prisma.category.upsert({
            where: { name: section.category },
            update: {},
            create: { name: section.category },
        })

        for (const item of section.items) {
            await prisma.menuItem.create({
                data: {
                    name: item.name,
                    price: item.price,
                    categoryId: category.id,
                },
            })
        }
    }

    // Seed Store Config
    const configs = [
        { key: "cafeName", value: "Sippin's Cafe" },
        { key: "logoUrl", value: "/logo.png" }, // Placeholder, admin can update
        { key: "parcelCharges", value: "10" },
        { key: "gstEnabled", value: "false" },
        { key: "gstPercentage", value: "5" },
    ]

    for (const config of configs) {
        await prisma.storeConfig.upsert({
            where: { key: config.key },
            update: {},
            create: { key: config.key, value: config.value },
        })
    }

    console.log('Seed data inserted successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
