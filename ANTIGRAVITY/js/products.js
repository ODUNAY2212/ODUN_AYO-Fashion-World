const products = [
  {
    id: "prod-1",
    name: "Royal Velvet Tuxedo",
    price: 450,
    rating: 4.9,
    category: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    description: "Exquisitely tailored slim-fit velvet tuxedo jacket in deep midnight black, featuring satin peak lapels, double back vents, and custom silk lining. Perfect for gala nights and black-tie affairs."
  },
  {
    id: "prod-2",
    name: "Classic Cashmere Trench Coat",
    price: 620,
    rating: 4.8,
    category: "Men's Fashion",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
    description: "A timeless outer layer crafted from 100% premium Mongolian cashmere. Tailored silhouette featuring double-breasted buttons, shoulder epaulets, and a belted waist."
  },
  {
    id: "prod-3",
    name: "Golden Hour Silk Gown",
    price: 580,
    rating: 5.0,
    category: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    description: "Floating silk-chiffon gown featuring an elegant halter neck, low back, and dramatic thigh slit. Painted in a gradient sun-kissed gold hue inspired by European runways."
  },
  {
    id: "prod-4",
    name: "Parisian Wool Tweed Blazer",
    price: 390,
    rating: 4.7,
    category: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1548624149-f7b31603317f?auto=format&fit=crop&w=600&q=80",
    description: "Chic structured blazer woven in France with gold metallic fibers and premium wool. Accentuated with gold dome buttons and frayed trim borders."
  },
  {
    id: "prod-5",
    name: "Little Prince Velvet Suit",
    price: 180,
    rating: 4.6,
    category: "Children's Fashion",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80",
    description: "A mini replica of our signature velvet tuxedo, meticulously crafted for young gentlemen. Composed of soft, breathable fabric with an adjustable waist trousers set."
  },
  {
    id: "prod-6",
    name: "Silk Rosebud Flower Dress",
    price: 160,
    rating: 4.8,
    category: "Children's Fashion",
    image: "https://images.unsplash.com/photo-1607453813894-22ec155f772d?auto=format&fit=crop&w=600&q=80",
    description: "An adorable luxury party gown made of soft silk tulle, featuring handmade rosebuds along the waistline and a premium satin sash."
  },
  {
    id: "prod-7",
    name: "Royal Golden Agbada Set",
    price: 550,
    rating: 5.0,
    category: "Native Wear",
    image: "https://images.unsplash.com/photo-1560074213-3cc10e4a742c?auto=format&fit=crop&w=600&q=80", // Premium native representation
    description: "A masterful 3-piece traditional Nigerian Agbada set. Hand-embroidered with intricate gold patterns on rich, heavy-grade Aso-Oke cotton. Set includes the outer gown, inner kaftan, trousers, and matching Fila (cap)."
  },
  {
    id: "prod-8",
    name: "Senator Kaftan Luxury Set",
    price: 320,
    rating: 4.9,
    category: "Native Wear",
    image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=600&q=80",
    description: "A tailored modern Senator style kaftan, made with high-grade Cashmere-blend fabric. Clean silhouette with subtle geometric patterns embroidered along the chest and cuffs."
  },
  {
    id: "prod-9",
    name: "Regal Aso-Oke Mermaid Dress",
    price: 480,
    rating: 4.9,
    category: "Native Wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    description: "Stunning Nigerian wedding guest attire. Structured mermaid-cut gown crafted using premium metallic thread Aso-Oke fabric, with matching Gele headpiece."
  },
  {
    id: "prod-10",
    name: "Handcrafted Double Monk Strap Oxfords",
    price: 290,
    rating: 4.8,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80",
    description: "Italian calfskin leather shoes hand-burnished for a rich patina finish. Features secure gold-finish double monk straps and Goodyear welted sole durability."
  },
  {
    id: "prod-11",
    name: "Aurelia Gold Stiletto Heels",
    price: 420,
    rating: 4.9,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
    description: "Spectacular strappy heels finished in high-shine metallic gold leather. Completed with a comfortable padded leather footbed and a sleek 105mm stiletto."
  },
  {
    id: "prod-12",
    name: "Classic Suede Tassel Loafers",
    price: 260,
    rating: 4.7,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80",
    description: "Slip-on casual luxury loafers constructed in soft Italian calf suede, highlighted with elegant hand-stitched tassels and lightweight leather soles."
  },
  {
    id: "prod-13",
    name: "Monarch Leather Crimson Handbag",
    price: 750,
    rating: 5.0,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    description: "Structured luxury tote bag made from grained Saffiano leather. Designed with a clean-cut divider, gold-toned padlock closure, and protective bottom studs."
  },
  {
    id: "prod-14",
    name: "Vesper Gold Chain Clutch",
    price: 380,
    rating: 4.8,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc15aef9?auto=format&fit=crop&w=600&q=80",
    description: "Chic envelope clutch draped in premium calfskin leather, complete with a detachable chunky gold link shoulder chain and magnetic flap."
  },
  {
    id: "prod-15",
    name: "Apex Gold Chronograph Watch",
    price: 1200,
    rating: 5.0,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    description: "A statement of luxury. 18k gold-plated stainless steel watch featuring automatic chronograph movement, scratch-resistant sapphire crystal, and black matte dial details."
  },
  {
    id: "prod-16",
    name: "Elysian Diamond Dial Watch",
    price: 950,
    rating: 4.9,
    category: "Watches",
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
    description: "Elegant feminine timekeeper, boasting 12 diamond indices on a mother-of-pearl dial face. Finished with an intricate gold-link mesh band."
  },
  {
    id: "prod-17",
    name: "Royal Heritage Silk Scarf",
    price: 120,
    rating: 4.6,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=600&q=80",
    description: "Luxurious, hand-rolled pure silk scarf, featuring our signature crown and OA monogram design motif. Drapes beautifully around the neck or bag straps."
  },
  {
    id: "prod-18",
    name: "Octagon Gold Cufflinks Set",
    price: 150,
    rating: 4.9,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1620138546344-7b2c08516edc?auto=format&fit=crop&w=600&q=80",
    description: "Modern octagonal cufflinks crafted from sterling silver base plated in 24k gold. Inset with natural black onyx stone panels."
  },
  {
    id: "prod-19",
    name: "Vanguard Aviator Sunglasses",
    price: 220,
    rating: 4.7,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    description: "Premium gold-toned metal frame aviators. Includes high-efficiency UV400 polarized lenses featuring a gradient bronze filter."
  },
  {
    id: "prod-20",
    name: "Signature OA Buckle Leather Belt",
    price: 180,
    rating: 4.8,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1624222247344-550fb8ec5b5d?auto=format&fit=crop&w=600&q=80",
    description: "Reversible belt structured in fine Italian smooth black leather on one side, and textured dark brown leather on the other. Adorned with our iconic solid brass OA monogram buckle."
  }
];
