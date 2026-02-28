import bcrypt from "bcryptjs"
import { prisma } from "../src/lib/prisma"

async function main() {
  console.log("🌱 Seeding database...")

  // Clean up existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tag.deleteMany()

  // ==================== USERS ====================
  const hashedPassword = await bcrypt.hash("Admin123!", 12)
  const customerPassword = await bcrypt.hash("Customer123!", 12)

  const admin = await prisma.user.create({
    data: {
      name: "Admin LumiStore",
      email: "admin@lumistore.com",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  })

  const customers = await Promise.all([
    prisma.user.create({
      data: {
        name: "María García",
        email: "maria@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Rodríguez",
        email: "carlos@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Martínez",
        email: "ana@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Diego López",
        email: "diego@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        name: "Laura Sánchez",
        email: "laura@example.com",
        password: customerPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    }),
  ])

  console.log("✅ Users created")

  // ==================== CATEGORIES ====================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electrónica",
        slug: "electronica",
        description:
          "Descubre los últimos gadgets y dispositivos electrónicos de alta gama. Desde auriculares premium hasta smartwatches de última generación.",
        image:
          "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=85&fit=crop",
      },
    }),
    prisma.category.create({
      data: {
        name: "Moda",
        slug: "moda",
        description:
          "Colección curada de prendas y accesorios de moda con diseño contemporáneo y materiales de primera calidad.",
        image:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=85&fit=crop",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hogar",
        slug: "hogar",
        description:
          "Transforma tu espacio con nuestra selección de artículos para el hogar. Diseño funcional y estético para cada rincón.",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85&fit=crop",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accesorios",
        slug: "accesorios",
        description:
          "Complementa tu estilo con accesorios únicos. Desde bolsos artesanales hasta joyería minimalista.",
        image:
          "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=85&fit=crop",
      },
    }),
  ])

  const [electronica, moda, hogar, accesorios] = categories
  console.log("✅ Categories created")

  // ==================== TAGS ====================
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: "Nuevo", slug: "nuevo" } }),
    prisma.tag.create({ data: { name: "Oferta", slug: "oferta" } }),
    prisma.tag.create({ data: { name: "Bestseller", slug: "bestseller" } }),
    prisma.tag.create({ data: { name: "Sostenible", slug: "sostenible" } }),
  ])

  // ==================== PRODUCTS ====================
  // Electrónica products (5)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Auriculares Pro Wireless",
        slug: "auriculares-pro-wireless",
        description:
          "Experimenta un sonido inmersivo con nuestros auriculares premium de cancelación de ruido activa. Diseñados con drivers de 40mm de alta resolución, ofrecen hasta 30 horas de batería. Bluetooth 5.3 con codec LDAC para audio de alta resolución. Almohadillas de espuma viscoelástica con proteína de cuero para máxima comodidad durante largas sesiones de escucha.",
        shortDesc: "Cancelación de ruido activa, 30h batería, Bluetooth 5.3",
        price: 299.99,
        comparePrice: 399.99,
        cost: 120.0,
        sku: "AUR-PRO-001",
        stock: 45,
        weight: 0.25,
        featured: true,
        categoryId: electronica.id,
        tags: { connect: [{ id: tags[0].id }, { id: tags[2].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=85&fit=crop",
              alt: "Auriculares Pro Wireless vista frontal",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=85&fit=crop",
              alt: "Auriculares Pro Wireless detalle lateral",
              position: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=85&fit=crop",
              alt: "Auriculares Pro Wireless en uso",
              position: 2,
            },
          ],
        },
        variants: {
          create: [
            { name: "Negro", sku: "AUR-PRO-001-BLK", stock: 20, color: "Negro" },
            { name: "Blanco", sku: "AUR-PRO-001-WHT", stock: 15, color: "Blanco" },
            { name: "Azul Medianoche", sku: "AUR-PRO-001-BLU", stock: 10, color: "Azul" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Smartwatch Ultra Series",
        slug: "smartwatch-ultra-series",
        description:
          "El smartwatch definitivo para tu estilo de vida activo. Pantalla AMOLED de 1.9\" siempre encendida, GPS de doble frecuencia, resistencia al agua 100m, y más de 100 modos deportivos. Monitor de salud completo con ECG, SpO2, y seguimiento del sueño. Batería de 14 días.",
        shortDesc: "AMOLED 1.9\", GPS dual, 14 días batería, ECG y SpO2",
        price: 449.99,
        comparePrice: 549.99,
        cost: 180.0,
        sku: "SWT-ULT-001",
        stock: 30,
        weight: 0.06,
        featured: true,
        categoryId: electronica.id,
        tags: { connect: [{ id: tags[0].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=800&q=85&fit=crop",
              alt: "Smartwatch Ultra Series vista frontal",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=85&fit=crop",
              alt: "Smartwatch Ultra Series en muñeca",
              position: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Speaker Portátil 360",
        slug: "speaker-portatil-360",
        description:
          "Sonido envolvente 360° en un diseño compacto y resistente. IPX7 resistente al agua, 24 horas de reproducción continua. Emparéjalo con otro speaker para sonido estéreo. Perfecto para exteriores y aventuras.",
        shortDesc: "Sonido 360°, IPX7, 24h batería",
        price: 129.99,
        cost: 45.0,
        sku: "SPK-360-001",
        stock: 60,
        weight: 0.56,
        featured: false,
        categoryId: electronica.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=85&fit=crop",
              alt: "Speaker Portátil 360",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Cámara Mirrorless 4K",
        slug: "camara-mirrorless-4k",
        description:
          "Captura momentos en resolución cinematográfica con nuestra cámara mirrorless. Sensor full-frame de 61MP, grabación 4K a 120fps, estabilización de 5 ejes. Cuerpo de aleación de magnesio sellado contra el clima. Incluye objetivo 24-70mm f/2.8.",
        shortDesc: "Full-frame 61MP, 4K 120fps, estabilización 5 ejes",
        price: 2499.99,
        comparePrice: 2899.99,
        cost: 1200.0,
        sku: "CAM-MRL-001",
        stock: 12,
        weight: 0.68,
        featured: true,
        categoryId: electronica.id,
        tags: { connect: [{ id: tags[2].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=85&fit=crop",
              alt: "Cámara Mirrorless 4K",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=85&fit=crop",
              alt: "Cámara Mirrorless detalle",
              position: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Tablet Pro 12.9\"",
        slug: "tablet-pro-12",
        description:
          "La tablet más potente del mercado. Pantalla Liquid Retina XDR de 12.9\", chip M2, 16GB RAM, 256GB almacenamiento. Compatible con stylus de presión y teclado magnético. Ideal para creativos y profesionales.",
        shortDesc: "12.9\" Liquid Retina XDR, chip M2, 16GB RAM",
        price: 1199.99,
        cost: 550.0,
        sku: "TAB-PRO-001",
        stock: 25,
        weight: 0.68,
        featured: false,
        categoryId: electronica.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=85&fit=crop",
              alt: "Tablet Pro 12.9\"",
              position: 0,
            },
          ],
        },
      },
    }),

    // Moda products (5)
    prisma.product.create({
      data: {
        name: "Chaqueta Oversize Premium",
        slug: "chaqueta-oversize-premium",
        description:
          "Chaqueta oversize confeccionada en lana merino italiana de primera calidad. Corte contemporáneo con hombros caídos y silueta relajada. Forro interior de seda. Botones de nácar genuino. Una pieza atemporal para tu guardarropa.",
        shortDesc: "Lana merino italiana, corte oversize, forro de seda",
        price: 389.99,
        comparePrice: 499.99,
        cost: 150.0,
        sku: "CHQ-OVR-001",
        stock: 20,
        weight: 1.2,
        featured: true,
        categoryId: moda.id,
        tags: { connect: [{ id: tags[1].id }, { id: tags[3].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85&fit=crop",
              alt: "Chaqueta Oversize Premium vista frontal",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&fit=crop",
              alt: "Chaqueta Oversize Premium detalle",
              position: 1,
            },
          ],
        },
        variants: {
          create: [
            { name: "Negro / S", sku: "CHQ-OVR-001-BLK-S", stock: 5, color: "Negro", size: "S" },
            { name: "Negro / M", sku: "CHQ-OVR-001-BLK-M", stock: 5, color: "Negro", size: "M" },
            { name: "Negro / L", sku: "CHQ-OVR-001-BLK-L", stock: 3, color: "Negro", size: "L" },
            { name: "Camel / S", sku: "CHQ-OVR-001-CML-S", stock: 3, color: "Camel", size: "S" },
            { name: "Camel / M", sku: "CHQ-OVR-001-CML-M", stock: 2, color: "Camel", size: "M" },
            { name: "Camel / L", sku: "CHQ-OVR-001-CML-L", stock: 2, color: "Camel", size: "L" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Sneakers Minimal White",
        slug: "sneakers-minimal-white",
        description:
          "Zapatillas minimalistas en piel italiana de grano completo. Suela de goma natural flexible. Plantilla de memory foam para comodidad todo el día. Diseño atemporal que combina con cualquier outfit. Fabricación artesanal europea.",
        shortDesc: "Piel italiana, suela de goma natural, memory foam",
        price: 219.99,
        comparePrice: 279.99,
        cost: 85.0,
        sku: "SNK-MIN-001",
        stock: 35,
        weight: 0.7,
        featured: true,
        categoryId: moda.id,
        tags: { connect: [{ id: tags[2].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=85&fit=crop",
              alt: "Sneakers Minimal White",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=85&fit=crop",
              alt: "Sneakers Minimal White detalle",
              position: 1,
            },
          ],
        },
        variants: {
          create: [
            { name: "Blanco / 38", sku: "SNK-MIN-001-WHT-38", stock: 5, color: "Blanco", size: "38" },
            { name: "Blanco / 39", sku: "SNK-MIN-001-WHT-39", stock: 5, color: "Blanco", size: "39" },
            { name: "Blanco / 40", sku: "SNK-MIN-001-WHT-40", stock: 5, color: "Blanco", size: "40" },
            { name: "Blanco / 41", sku: "SNK-MIN-001-WHT-41", stock: 5, color: "Blanco", size: "41" },
            { name: "Blanco / 42", sku: "SNK-MIN-001-WHT-42", stock: 5, color: "Blanco", size: "42" },
            { name: "Blanco / 43", sku: "SNK-MIN-001-WHT-43", stock: 5, color: "Blanco", size: "43" },
            { name: "Negro / 40", sku: "SNK-MIN-001-BLK-40", stock: 5, color: "Negro", size: "40" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Camisa Lino Orgánico",
        slug: "camisa-lino-organico",
        description:
          "Camisa de lino orgánico certificado GOTS. Tejido ligero y transpirable perfecto para climas cálidos. Corte regular con cuello Mao. Botones de coco natural. Teñido con tintes vegetales libres de químicos.",
        shortDesc: "Lino orgánico GOTS, teñido vegetal, botones de coco",
        price: 89.99,
        cost: 30.0,
        sku: "CMS-LIN-001",
        stock: 50,
        weight: 0.2,
        featured: false,
        categoryId: moda.id,
        tags: { connect: [{ id: tags[3].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=85&fit=crop",
              alt: "Camisa Lino Orgánico",
              position: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: "Blanco / S", sku: "CMS-LIN-001-WHT-S", stock: 15, color: "Blanco", size: "S" },
            { name: "Blanco / M", sku: "CMS-LIN-001-WHT-M", stock: 15, color: "Blanco", size: "M" },
            { name: "Blanco / L", sku: "CMS-LIN-001-WHT-L", stock: 10, color: "Blanco", size: "L" },
            { name: "Azul Cielo / M", sku: "CMS-LIN-001-BLU-M", stock: 10, color: "Azul", size: "M" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Pantalón Chino Stretch",
        slug: "pantalon-chino-stretch",
        description:
          "Pantalón chino con mezcla de algodón premium y elastano para máximo confort. Corte slim-fit moderno. Cintura media con cierre de botón. Perfecto para ocasiones casuales y smart-casual. Lavado enzimático para suavidad máxima.",
        shortDesc: "Algodón premium con stretch, corte slim-fit",
        price: 79.99,
        cost: 28.0,
        sku: "PNT-CHN-001",
        stock: 40,
        weight: 0.4,
        featured: false,
        categoryId: moda.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85&fit=crop",
              alt: "Pantalón Chino Stretch",
              position: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: "Beige / 30", sku: "PNT-CHN-001-BEI-30", stock: 10, color: "Beige", size: "30" },
            { name: "Beige / 32", sku: "PNT-CHN-001-BEI-32", stock: 10, color: "Beige", size: "32" },
            { name: "Navy / 30", sku: "PNT-CHN-001-NVY-30", stock: 10, color: "Navy", size: "30" },
            { name: "Navy / 32", sku: "PNT-CHN-001-NVY-32", stock: 10, color: "Navy", size: "32" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Vestido Midi Satinado",
        slug: "vestido-midi-satinado",
        description:
          "Vestido midi en satén de seda con caída impecable. Escote en V con tirantes ajustables. Espalda descubierta elegante. Corte al bies que favorece cualquier silueta. Ideal para eventos especiales o cenas románticas.",
        shortDesc: "Satén de seda, corte al bies, espalda descubierta",
        price: 259.99,
        comparePrice: 329.99,
        cost: 95.0,
        sku: "VST-SAT-001",
        stock: 15,
        weight: 0.3,
        featured: true,
        categoryId: moda.id,
        tags: { connect: [{ id: tags[0].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=85&fit=crop",
              alt: "Vestido Midi Satinado",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=85&fit=crop",
              alt: "Vestido Midi Satinado detalle",
              position: 1,
            },
          ],
        },
        variants: {
          create: [
            { name: "Negro / XS", sku: "VST-SAT-001-BLK-XS", stock: 3, color: "Negro", size: "XS" },
            { name: "Negro / S", sku: "VST-SAT-001-BLK-S", stock: 4, color: "Negro", size: "S" },
            { name: "Negro / M", sku: "VST-SAT-001-BLK-M", stock: 4, color: "Negro", size: "M" },
            { name: "Champagne / S", sku: "VST-SAT-001-CHP-S", stock: 2, color: "Champagne", size: "S" },
            { name: "Champagne / M", sku: "VST-SAT-001-CHP-M", stock: 2, color: "Champagne", size: "M" },
          ],
        },
      },
    }),

    // Hogar products (5)
    prisma.product.create({
      data: {
        name: "Lámpara de Mesa Escultórica",
        slug: "lampara-mesa-escultorica",
        description:
          "Lámpara de mesa que es obra de arte y funcionalidad. Base de cerámica artesanal con acabado mate orgánico. Pantalla de lino natural. Luz cálida regulable con 3 intensidades táctiles. Cada pieza es única debido al proceso artesanal.",
        shortDesc: "Cerámica artesanal, pantalla de lino, luz regulable",
        price: 189.99,
        comparePrice: 239.99,
        cost: 65.0,
        sku: "LMP-ESC-001",
        stock: 18,
        weight: 2.1,
        featured: true,
        categoryId: hogar.id,
        tags: { connect: [{ id: tags[0].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1507473885765-e6ed057ab3fe?w=800&q=85&fit=crop",
              alt: "Lámpara de Mesa Escultórica",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=85&fit=crop",
              alt: "Lámpara de Mesa Escultórica detalle",
              position: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Set de Cojines Artesanales",
        slug: "set-cojines-artesanales",
        description:
          "Set de 3 cojines decorativos tejidos a mano en algodón orgánico. Patrones geométricos inspirados en el arte mudéjar. Relleno de fibra hipoalergénica. Cremallera invisible para fácil lavado. Transforma cualquier espacio con textura y calidez.",
        shortDesc: "Set de 3, algodón orgánico, tejido a mano",
        price: 119.99,
        cost: 40.0,
        sku: "COJ-ART-001",
        stock: 25,
        weight: 1.5,
        featured: false,
        categoryId: hogar.id,
        tags: { connect: [{ id: tags[3].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=85&fit=crop",
              alt: "Set de Cojines Artesanales",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Jarrón Minimalista Línea",
        slug: "jarron-minimalista-linea",
        description:
          "Jarrón de cerámica con diseño minimalista de líneas puras. Acabado esmaltado en tonos neutros. Perfecto para flores frescas o secas. Fabricado artesanalmente en taller local. Cada pieza presenta variaciones sutiles que la hacen única.",
        shortDesc: "Cerámica artesanal, diseño minimalista, acabado esmaltado",
        price: 69.99,
        cost: 22.0,
        sku: "JRN-MIN-001",
        stock: 40,
        weight: 0.8,
        featured: false,
        categoryId: hogar.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&q=85&fit=crop",
              alt: "Jarrón Minimalista Línea",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Manta Tejida Alpaca",
        slug: "manta-tejida-alpaca",
        description:
          "Manta de lana de baby alpaca, la fibra más suave y cálida del mundo. Tejida en telar tradicional por artesanos andinos. Libre de tintes químicos. Tamaño generous de 180x130cm. Un lujo para el sofá o la cama.",
        shortDesc: "Baby alpaca, tejido en telar, 180x130cm",
        price: 349.99,
        comparePrice: 429.99,
        cost: 140.0,
        sku: "MNT-ALP-001",
        stock: 8,
        weight: 1.0,
        featured: false,
        categoryId: hogar.id,
        tags: { connect: [{ id: tags[3].id }, { id: tags[1].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1580301762395-21ce6d555b43?w=800&q=85&fit=crop",
              alt: "Manta Tejida Alpaca",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Set de Vajilla Wabi-Sabi",
        slug: "set-vajilla-wabi-sabi",
        description:
          "Set de 16 piezas de vajilla cerámica con estética wabi-sabi. Incluye 4 platos llanos, 4 platos hondos, 4 platos de postre y 4 tazas. Cada pieza esmaltada a mano con variaciones únicas. Apta para lavavajillas y microondas.",
        shortDesc: "16 piezas, cerámica esmaltada a mano, estilo wabi-sabi",
        price: 199.99,
        cost: 75.0,
        sku: "VAJ-WAB-001",
        stock: 15,
        weight: 8.0,
        featured: false,
        categoryId: hogar.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=85&fit=crop",
              alt: "Set de Vajilla Wabi-Sabi",
              position: 0,
            },
          ],
        },
      },
    }),

    // Accesorios products (5)
    prisma.product.create({
      data: {
        name: "Bolso Tote de Cuero",
        slug: "bolso-tote-cuero",
        description:
          "Bolso tote confeccionado en cuero de curtido vegetal. Amplio compartimento principal con bolsillo interior con cremallera. Asas reforzadas con remaches de latón. El cuero desarrolla una pátina única con el uso. Capacidad para laptop de hasta 14\".",
        shortDesc: "Cuero curtido vegetal, cabe laptop 14\", remaches de latón",
        price: 279.99,
        comparePrice: 349.99,
        cost: 100.0,
        sku: "BLS-TOT-001",
        stock: 22,
        weight: 0.9,
        featured: true,
        categoryId: accesorios.id,
        tags: { connect: [{ id: tags[2].id }, { id: tags[3].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=85&fit=crop",
              alt: "Bolso Tote de Cuero",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85&fit=crop",
              alt: "Bolso Tote de Cuero detalle",
              position: 1,
            },
          ],
        },
        variants: {
          create: [
            { name: "Cognac", sku: "BLS-TOT-001-COG", stock: 10, color: "Cognac" },
            { name: "Negro", sku: "BLS-TOT-001-BLK", stock: 8, color: "Negro" },
            { name: "Chocolate", sku: "BLS-TOT-001-CHC", stock: 4, color: "Chocolate" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Gafas de Sol Titanio",
        slug: "gafas-sol-titanio",
        description:
          "Gafas de sol con montura ultraligera de titanio japonés. Lentes polarizadas con protección UV400 y tratamiento anti-reflejante. Patillas flexibles con terminal de acetato. Incluye estuche rígido de cuero y paño de microfibra.",
        shortDesc: "Titanio japonés, lentes polarizadas UV400",
        price: 199.99,
        cost: 70.0,
        sku: "GFS-TIT-001",
        stock: 30,
        weight: 0.03,
        featured: false,
        categoryId: accesorios.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=85&fit=crop",
              alt: "Gafas de Sol Titanio",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Cartera Slim RFID",
        slug: "cartera-slim-rfid",
        description:
          "Cartera ultradelgada con protección RFID integrada. Cuero nappa de primera calidad. Capacidad para 8 tarjetas y billetes. Diseño que cabe cómodamente en el bolsillo delantero. Bloqueo RFID certificado que protege tus datos.",
        shortDesc: "Cuero nappa, protección RFID, ultra slim",
        price: 79.99,
        cost: 25.0,
        sku: "CRT-SLM-001",
        stock: 50,
        weight: 0.05,
        featured: false,
        categoryId: accesorios.id,
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=85&fit=crop",
              alt: "Cartera Slim RFID",
              position: 0,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Reloj Automático Heritage",
        slug: "reloj-automatico-heritage",
        description:
          "Reloj automático con movimiento suizo elaborado. Caja de acero inoxidable 316L de 40mm. Cristal de zafiro antirreflectante. Correa de cuero de cocodrilo genuino. Reserva de marcha de 42 horas. Resistencia al agua 50m.",
        shortDesc: "Movimiento suizo, zafiro, correa cocodrilo, 42h reserva",
        price: 1899.99,
        comparePrice: 2199.99,
        cost: 750.0,
        sku: "RLJ-HRT-001",
        stock: 3,
        weight: 0.12,
        featured: true,
        categoryId: accesorios.id,
        tags: { connect: [{ id: tags[0].id }, { id: tags[2].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=85&fit=crop",
              alt: "Reloj Automático Heritage",
              position: 0,
            },
            {
              url: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=800&q=85&fit=crop",
              alt: "Reloj Automático Heritage detalle",
              position: 1,
            },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Bufanda Cashmere Premium",
        slug: "bufanda-cashmere-premium",
        description:
          "Bufanda de cachemira mongola de grado A, la más suave y exclusiva del mundo. Tejido twill diagonal de doble cara. Medidas generosas de 200x70cm con flecos tejidos. Libre de procesos químicos. Un accesorio de lujo atemporal.",
        shortDesc: "Cachemira mongola grado A, 200x70cm, doble cara",
        price: 159.99,
        cost: 55.0,
        sku: "BUF-CSH-001",
        stock: 20,
        weight: 0.2,
        featured: false,
        categoryId: accesorios.id,
        tags: { connect: [{ id: tags[3].id }] },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=85&fit=crop",
              alt: "Bufanda Cashmere Premium",
              position: 0,
            },
          ],
        },
        variants: {
          create: [
            { name: "Gris", sku: "BUF-CSH-001-GRY", stock: 7, color: "Gris" },
            { name: "Camel", sku: "BUF-CSH-001-CML", stock: 7, color: "Camel" },
            { name: "Negro", sku: "BUF-CSH-001-BLK", stock: 6, color: "Negro" },
          ],
        },
      },
    }),
  ])

  console.log("✅ Products created")

  // ==================== REVIEWS ====================
  const reviewsData = [
    { productIdx: 0, userIdx: 0, rating: 5, title: "Sonido increíble", body: "La cancelación de ruido es perfecta. Los uso diariamente en la oficina y son tremendamente cómodos incluso después de 8 horas." },
    { productIdx: 0, userIdx: 1, rating: 4, title: "Muy buenos", body: "Excelente calidad de sonido y construcción sólida. Le quito una estrella porque el estuche podría ser más compacto." },
    { productIdx: 0, userIdx: 2, rating: 5, title: "Los mejores que he tenido", body: "Después de probar muchas marcas, estos son los definitivos. El bluetooth no tiene latencia y la batería dura barbaridad." },
    { productIdx: 1, userIdx: 0, rating: 5, title: "Compañero perfecto", body: "El GPS es preciso y la pantalla se ve genial bajo el sol. La batería dura más de 2 semanas con uso normal." },
    { productIdx: 1, userIdx: 3, rating: 4, title: "Casi perfecto", body: "Muy buen smartwatch, las funciones de salud son muy completas. El único pero es que la app podría ser más intuitiva." },
    { productIdx: 3, userIdx: 1, rating: 5, title: "Calidad profesional", body: "Fotos espectaculares. La estabilización es impresionante incluso grabando en 4K. Imprescindible para fotógrafos serios." },
    { productIdx: 5, userIdx: 2, rating: 5, title: "Calidad excepcional", body: "La lana es suavísima y el corte es perfecto. Me encanta cómo queda tanto con jeans como con pantalón de vestir." },
    { productIdx: 5, userIdx: 4, rating: 4, title: "Muy buena chaqueta", body: "La calidad se nota desde que la sacas de la caja. El forro de seda es un detalle premium. Talla un poco grande." },
    { productIdx: 6, userIdx: 3, rating: 5, title: "Las zapatillas perfectas", body: "Cómodas desde el primer día, el cuero es precioso y se nota que van a durar años. El diseño es atemporal." },
    { productIdx: 6, userIdx: 0, rating: 4, title: "Muy cómodas", body: "Excelente calidad de materiales. La plantilla memory foam hace que parezca que caminas sobre nubes. Recomendadas." },
    { productIdx: 10, userIdx: 1, rating: 5, title: "Impresionante", body: "La lámpara es una verdadera obra de arte. La luz cálida crea un ambiente increíble. Cada pieza es única de verdad." },
    { productIdx: 15, userIdx: 4, rating: 5, title: "Bolso perfecto", body: "El cuero es de calidad excepcional y ya se nota cómo va cogiendo pátina. Cabe todo lo que necesito incluido el laptop. Compra acertadísima." },
    { productIdx: 15, userIdx: 2, rating: 4, title: "Muy práctico", body: "Diseño elegante y funcional. El cuero de curtido vegetal le da un olor fantástico. Las asas son súper resistentes." },
    { productIdx: 18, userIdx: 0, rating: 5, title: "Una joya", body: "El acabado del reloj es espectacular, el movimiento es preciso y la correa de cocodrilo es hermosa. Vale cada centavo." },
    { productIdx: 18, userIdx: 3, rating: 5, title: "Pieza excepcional", body: "Llevo un mes usándolo y no puedo estar más contento. La reserva de marcha funciona perfecto y el diseño recibe muchos cumplidos." },
    { productIdx: 9, userIdx: 4, rating: 3, title: "Bien pero mejorable", body: "El vestido es bonito y la tela tiene buena caída, pero para el precio esperaba un acabado más perfecto en las costuras." },
  ]

  for (const r of reviewsData) {
    await prisma.review.create({
      data: {
        rating: r.rating,
        title: r.title,
        body: r.body,
        verified: true,
        productId: products[r.productIdx].id,
        userId: customers[r.userIdx].id,
      },
    })
  }

  console.log("✅ Reviews created")

  // ==================== ORDERS ====================
  const orderStatuses = ["DELIVERED", "SHIPPED", "PROCESSING", "CONFIRMED", "PENDING"] as const

  for (let i = 0; i < 5; i++) {
    const customer = customers[i]
    const numOrders = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < numOrders; j++) {
      const numItems = Math.floor(Math.random() * 3) + 1
      const orderItems = []
      let subtotal = 0

      for (let k = 0; k < numItems; k++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 2) + 1
        const price = Number(product.price)
        subtotal += price * quantity
        orderItems.push({
          quantity,
          price,
          productId: product.id,
        })
      }

      const tax = subtotal * 0.08
      const shipping = subtotal > 50 ? 0 : 9.99
      const total = subtotal + tax + shipping

      await prisma.order.create({
        data: {
          orderNumber: `LS-${String(2024000 + i * 10 + j).padStart(7, "0")}`,
          status: orderStatuses[j % orderStatuses.length],
          subtotal,
          tax,
          shipping,
          total,
          paymentMethod: "credit_card",
          paymentStatus: j === 4 ? "UNPAID" : "PAID",
          userId: customer.id,
          shippingAddress: {
            firstName: customer.name?.split(" ")[0] || "Customer",
            lastName: customer.name?.split(" ")[1] || "User",
            address1: `Calle Principal ${100 + i}`,
            city: "Madrid",
            state: "Madrid",
            zip: "28001",
            country: "España",
            phone: `+34 600 ${String(100000 + i * 1000 + j).slice(0, 6)}`,
          },
          items: {
            create: orderItems,
          },
        },
      })
    }
  }

  console.log("✅ Orders created")
  console.log("🎉 Database seeded successfully!")
  console.log("\n📧 Admin credentials:")
  console.log("   Email: admin@lumistore.com")
  console.log("   Password: Admin123!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
