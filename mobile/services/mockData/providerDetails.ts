import { ProviderDetail } from '@/types/providerDetail';

/**
 * Mock Provider Details
 *
 * Rich detail data (description, services, reviews) for each mock
 * provider, keyed by provider id. Spread the base provider fields from
 * MOCK_PROVIDERS at lookup time (see getProviderDetail helper below)
 * rather than duplicating businessName/rating/etc. here — this file only
 * holds the *extra* fields the Profile screen needs.
 *
 * TODO: Phase 12 — replace with a Supabase query joining providers,
 * services, and reviews tables.
 */
type ProviderDetailExtra = Pick<ProviderDetail, 'description' | 'services' | 'reviews'>;

export const MOCK_PROVIDER_DETAILS: Record<string, ProviderDetailExtra> = {
  'prov-01': {
    description:
      "Ade's Plumbing Services has been serving Lagos homes and businesses for over 8 years. We specialize in residential and commercial plumbing, from emergency leak repairs to full bathroom installations. Licensed, insured, and available for same-day callouts across Ikeja and surrounding areas.",
    services: [
      { id: 'svc-01-1', name: 'Pipe Installation', price: 15000 },
      { id: 'svc-01-2', name: 'Leak Repair', price: 8000 },
      { id: 'svc-01-3', name: 'Drainage Cleaning', price: 12000 },
      { id: 'svc-01-4', name: 'Water Heater Installation', price: 25000 },
    ],
    reviews: [
      { id: 'rev-01-1', reviewerName: 'Chidi O.', rating: 5, comment: 'Great service, very professional and arrived on time.', createdAt: '2026-06-10T09:00:00Z' },
      { id: 'rev-01-2', reviewerName: 'Funke A.', rating: 4, comment: 'Fixed the leak quickly. Would book again.', createdAt: '2026-06-02T09:00:00Z' },
      { id: 'rev-01-3', reviewerName: 'Tunde B.', rating: 5, comment: 'Excellent work on my bathroom pipes. Highly recommend.', createdAt: '2026-05-20T09:00:00Z' },
    ],
  },
  'prov-02': {
    description:
      'BrightSpark Electricals provides certified electrical installation and repair services across Abuja. From wiring new builds to fixing faulty circuits, our licensed electricians prioritize safety and code compliance on every job.',
    services: [
      { id: 'svc-02-1', name: 'Wiring Inspection', price: 10000 },
      { id: 'svc-02-2', name: 'Socket & Switch Installation', price: 6000 },
      { id: 'svc-02-3', name: 'Circuit Breaker Repair', price: 18000 },
    ],
    reviews: [
      { id: 'rev-02-1', reviewerName: 'Amaka N.', rating: 5, comment: 'Very knowledgeable, explained everything clearly.', createdAt: '2026-06-08T09:00:00Z' },
      { id: 'rev-02-2', reviewerName: 'Ibrahim S.', rating: 4, comment: 'Solid work, slightly delayed arrival.', createdAt: '2026-05-28T09:00:00Z' },
    ],
  },
  'prov-03': {
    description:
      'SparkleClean Services offers thorough residential and office cleaning across Lekki and Victoria Island. Our trained team handles everything from routine cleans to deep post-construction cleanups, using eco-friendly products.',
    services: [
      { id: 'svc-03-1', name: 'Standard Home Cleaning', price: 10000 },
      { id: 'svc-03-2', name: 'Deep Cleaning', price: 20000 },
      { id: 'svc-03-3', name: 'Office Cleaning (per visit)', price: 15000 },
    ],
    reviews: [
      { id: 'rev-03-1', reviewerName: 'Bisi T.', rating: 5, comment: 'My apartment has never looked this good. Thank you!', createdAt: '2026-06-12T09:00:00Z' },
      { id: 'rev-03-2', reviewerName: 'Emeka P.', rating: 5, comment: 'Very thorough and punctual team.', createdAt: '2026-06-05T09:00:00Z' },
      { id: 'rev-03-3', reviewerName: 'Grace O.', rating: 4, comment: 'Good service, will use again for deep cleaning.', createdAt: '2026-05-15T09:00:00Z' },
    ],
  },
  'prov-04': {
    description:
      'Bright Minds Tutorial Centre offers personalized tutoring for primary and secondary school students in Ibadan, covering Mathematics, English, and the sciences. Small group and one-on-one sessions available.',
    services: [
      { id: 'svc-04-1', name: 'One-on-One Tutoring (per hour)', price: 5000 },
      { id: 'svc-04-2', name: 'Group Tutoring (per session)', price: 3000 },
      { id: 'svc-04-3', name: 'WAEC/JAMB Prep Package', price: 35000 },
    ],
    reviews: [
      { id: 'rev-04-1', reviewerName: 'Mrs. Adeyemi', rating: 5, comment: "My son's grades improved significantly within a month.", createdAt: '2026-06-09T09:00:00Z' },
      { id: 'rev-04-2', reviewerName: 'Kemi F.', rating: 4, comment: 'Patient tutors, good communication with parents.', createdAt: '2026-05-30T09:00:00Z' },
    ],
  },
  'prov-05': {
    description:
      'Lens & Light Photography captures weddings, portraits, and corporate events across Port Harcourt and beyond. Our award-winning team blends documentary and editorial styles for timeless images.',
    services: [
      { id: 'svc-05-1', name: 'Portrait Session', price: 20000 },
      { id: 'svc-05-2', name: 'Wedding Package (full day)', price: 150000 },
      { id: 'svc-05-3', name: 'Corporate Event Coverage', price: 60000 },
    ],
    reviews: [
      { id: 'rev-05-1', reviewerName: 'Chioma K.', rating: 5, comment: 'Captured our wedding beautifully, true professionals.', createdAt: '2026-06-11T09:00:00Z' },
      { id: 'rev-05-2', reviewerName: 'David O.', rating: 5, comment: 'Amazing portraits, very creative direction.', createdAt: '2026-05-22T09:00:00Z' },
    ],
  },
  'prov-06': {
    description:
      'Taste of Naija Catering brings authentic Nigerian cuisine to weddings, parties, and corporate functions across Lagos. From jollof rice to small chops, we cater events of all sizes.',
    services: [
      { id: 'svc-06-1', name: 'Per Plate (Standard Menu)', price: 3500 },
      { id: 'svc-06-2', name: 'Small Chops Package (per 50 pcs)', price: 12000 },
      { id: 'svc-06-3', name: 'Full Event Catering (per 100 guests)', price: 350000 },
    ],
    reviews: [
      { id: 'rev-06-1', reviewerName: 'Folake A.', rating: 4, comment: 'Food was delicious, guests loved it.', createdAt: '2026-06-07T09:00:00Z' },
      { id: 'rev-06-2', reviewerName: 'Segun W.', rating: 5, comment: 'Best jollof rice I have had at an event, period.', createdAt: '2026-05-18T09:00:00Z' },
    ],
  },
  'prov-07': {
    description:
      'Glow Hair & Beauty Studio offers hairstyling, makeup, and skincare services in Abeokuta. Whether for a special occasion or routine self-care, our stylists tailor each session to you.',
    services: [
      { id: 'svc-07-1', name: 'Hairstyling Session', price: 7000 },
      { id: 'svc-07-2', name: 'Makeup Application', price: 10000 },
      { id: 'svc-07-3', name: 'Facial Treatment', price: 8000 },
    ],
    reviews: [
      { id: 'rev-07-1', reviewerName: 'Ngozi E.', rating: 4, comment: 'Loved my hairstyle for the event!', createdAt: '2026-06-03T09:00:00Z' },
      { id: 'rev-07-2', reviewerName: 'Hauwa M.', rating: 5, comment: 'Best makeup artist in Abeokuta, hands down.', createdAt: '2026-05-25T09:00:00Z' },
    ],
  },
  'prov-08': {
    description:
      'QuickFix Auto Garage handles general auto repairs, diagnostics, and routine maintenance for all vehicle makes in Kano. Walk-ins welcome; same-day service on most repairs.',
    services: [
      { id: 'svc-08-1', name: 'Engine Diagnostics', price: 5000 },
      { id: 'svc-08-2', name: 'Oil Change', price: 8000 },
      { id: 'svc-08-3', name: 'Brake Pad Replacement', price: 15000 },
    ],
    reviews: [
      { id: 'rev-08-1', reviewerName: 'Musa A.', rating: 4, comment: 'Fixed my car quickly and fairly priced.', createdAt: '2026-06-01T09:00:00Z' },
      { id: 'rev-08-2', reviewerName: 'Fatima Y.', rating: 4, comment: 'Good honest mechanics, no upselling.', createdAt: '2026-05-12T09:00:00Z' },
    ],
  },
  'prov-09': {
    description:
      'TechFix Computer Repairs offers laptop, desktop, and phone repair services in Yaba, Lagos — Nigeria\'s tech hub. We handle hardware repairs, data recovery, and software troubleshooting.',
    services: [
      { id: 'svc-09-1', name: 'Screen Replacement', price: 18000 },
      { id: 'svc-09-2', name: 'Data Recovery', price: 10000 },
      { id: 'svc-09-3', name: 'Virus Removal & OS Reinstall', price: 7000 },
    ],
    reviews: [
      { id: 'rev-09-1', reviewerName: 'Tobi L.', rating: 5, comment: 'Recovered all my files after a crash. Lifesavers.', createdAt: '2026-06-13T09:00:00Z' },
      { id: 'rev-09-2', reviewerName: 'Yetunde R.', rating: 4, comment: 'Quick screen replacement, good price.', createdAt: '2026-06-04T09:00:00Z' },
      { id: 'rev-09-3', reviewerName: 'Chuka I.', rating: 5, comment: 'Fixed my laptop same day. Very reliable.', createdAt: '2026-05-29T09:00:00Z' },
    ],
  },
  'prov-10': {
    description:
      'CodeCraft Studios is a freelance web and software development team based in Abuja, building websites, mobile apps, and custom business software for clients across Nigeria.',
    services: [
      { id: 'svc-10-1', name: 'Business Website (5 pages)', price: 150000 },
      { id: 'svc-10-2', name: 'Mobile App MVP', price: 500000 },
      { id: 'svc-10-3', name: 'Website Maintenance (monthly)', price: 25000 },
    ],
    reviews: [
      { id: 'rev-10-1', reviewerName: 'Olumide T.', rating: 5, comment: 'Delivered our app ahead of schedule, great communication.', createdAt: '2026-06-14T09:00:00Z' },
      { id: 'rev-10-2', reviewerName: 'Aisha B.', rating: 5, comment: 'Professional team, exceeded expectations.', createdAt: '2026-06-06T09:00:00Z' },
    ],
  },
  'prov-11': {
    description:
      'Royal Stitches Tailoring crafts custom-made outfits for men and women in Onitsha — from native attire to corporate wear. Precise measurements, quality fabric sourcing, and timely delivery.',
    services: [
      { id: 'svc-11-1', name: "Men's Native Attire", price: 20000 },
      { id: 'svc-11-2', name: "Women's Gown (custom)", price: 25000 },
      { id: 'svc-11-3', name: 'Corporate Suit', price: 35000 },
    ],
    reviews: [
      { id: 'rev-11-1', reviewerName: 'Patrick N.', rating: 5, comment: 'Perfect fit, delivered on time for my wedding.', createdAt: '2026-06-02T09:00:00Z' },
      { id: 'rev-11-2', reviewerName: 'Ijeoma C.', rating: 4, comment: 'Beautiful gown, minor adjustment needed but fixed quickly.', createdAt: '2026-05-19T09:00:00Z' },
    ],
  },
  'prov-12': {
    description:
      'Elite Events & Decor plans and decorates weddings, birthdays, and corporate events across Lagos. From concept to execution, we handle decor, logistics, and vendor coordination.',
    services: [
      { id: 'svc-12-1', name: 'Birthday Decor Package', price: 80000 },
      { id: 'svc-12-2', name: 'Wedding Decor & Planning', price: 400000 },
      { id: 'svc-12-3', name: 'Corporate Event Setup', price: 150000 },
    ],
    reviews: [
      { id: 'rev-12-1', reviewerName: 'Temi A.', rating: 5, comment: 'Our wedding decor was stunning, exactly as envisioned.', createdAt: '2026-06-10T09:00:00Z' },
      { id: 'rev-12-2', reviewerName: 'Nneka U.', rating: 5, comment: 'Stress-free planning experience from start to finish.', createdAt: '2026-05-27T09:00:00Z' },
    ],
  },
  'prov-13': {
    description:
      'SteadyPower Generator Services installs, repairs, and maintains generators and solar power systems in Warri. Keep your home or business running with reliable backup power solutions.',
    services: [
      { id: 'svc-13-1', name: 'Generator Repair', price: 12000 },
      { id: 'svc-13-2', name: 'Routine Maintenance Service', price: 8000 },
      { id: 'svc-13-3', name: 'Solar Panel Installation (per kW)', price: 250000 },
    ],
    reviews: [
      { id: 'rev-13-1', reviewerName: 'Godwin E.', rating: 5, comment: 'Fixed my generator same day, very responsive.', createdAt: '2026-06-05T09:00:00Z' },
      { id: 'rev-13-2', reviewerName: 'Blessing O.', rating: 4, comment: 'Good service on solar installation, slightly pricey.', createdAt: '2026-05-21T09:00:00Z' },
    ],
  },
  'prov-14': {
    description:
      'Master Craft Carpentry builds and repairs custom furniture in Enugu — wardrobes, cabinets, doors, and more. Skilled craftsmanship with attention to detail on every piece.',
    services: [
      { id: 'svc-14-1', name: 'Custom Wardrobe', price: 60000 },
      { id: 'svc-14-2', name: 'Door Installation', price: 15000 },
      { id: 'svc-14-3', name: 'Furniture Repair', price: 8000 },
    ],
    reviews: [
      { id: 'rev-14-1', reviewerName: 'Obinna F.', rating: 4, comment: 'Solid craftsmanship, took a bit longer than quoted.', createdAt: '2026-05-31T09:00:00Z' },
      { id: 'rev-14-2', reviewerName: 'Adaeze G.', rating: 5, comment: 'Beautiful wardrobe, exactly what I wanted.', createdAt: '2026-05-14T09:00:00Z' },
    ],
  },
  'prov-15': {
    description:
      'SwiftMove Logistics provides home and office moving, packing, and delivery services across Lagos. Reliable trucks, careful handling, and transparent pricing for every move.',
    services: [
      { id: 'svc-15-1', name: 'Local Move (1-bedroom)', price: 30000 },
      { id: 'svc-15-2', name: 'Office Relocation', price: 80000 },
      { id: 'svc-15-3', name: 'Packing Service', price: 15000 },
    ],
    reviews: [
      { id: 'rev-15-1', reviewerName: 'Uche M.', rating: 5, comment: 'Careful with my furniture, arrived on time.', createdAt: '2026-06-09T09:00:00Z' },
      { id: 'rev-15-2', reviewerName: 'Halima D.', rating: 4, comment: 'Smooth office move, professional crew.', createdAt: '2026-05-26T09:00:00Z' },
    ],
  },
};