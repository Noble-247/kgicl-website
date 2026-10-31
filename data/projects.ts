export type ProjectImage = {
  /** Cloudinary public ID. Never a full URL. */
  publicId: string;
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  client?: string;
  location?: string;
  type: string;
  description: string;
  image: ProjectImage;
};

/**
 * The five projects from PRD Appendix B, already cleaned of private contacts.
 * The public IDs keep the client's original spellings. Do not "correct" them,
 * or the images will stop loading.
 */
export const PROJECTS = [
  {
    id: "transformer-ikoyi",
    title: "300 kVA Transformer Procurement and Installation",
    client: "Mr Biggs",
    location: "Ikoyi, Lagos",
    type: "Procurement and installation",
    description:
      "Procurement and installation of a 300 kVA transformer at Mr Biggs, Ikoyi, Lagos.",
    image: {
      publicId:
        "Procure-and-installation-of-300kva-transformer-at-Mr-Biggs-koyi-Lagos",
      alt: "300 kVA Transformer Procurement and Installation, Ikoyi, Lagos",
    },
  },
  {
    id: "foodco-ikotun",
    title: "Installation at Foodco Eateries",
    client: "Foodco Eateries",
    location: "Ikotun, Lagos",
    type: "Installation",
    description: "Completed installation at Foodco Eateries, Ikotun, Lagos.",
    image: {
      publicId: "Completed-installation-of-Foodco-Eatries-Ikotun-Lagos",
      alt: "Installation at Foodco Eateries, Ikotun, Lagos",
    },
  },
  {
    id: "solar-lights-ph-residence",
    title: "KGICL Solar Lights at a Port Harcourt Residence",
    location: "Port Harcourt",
    type: "Solar lighting installation",
    description:
      "Completed installation of KGICL solar lights in a new site at a Port Harcourt residence.",
    image: {
      publicId:
        "Completed-installation-of-KGICL-solar-lightd-in-a-new-site-at-a-Port-Harcourt-residence",
      alt: "KGICL Solar Lights at a Port Harcourt Residence, Port Harcourt",
    },
  },
  {
    id: "industrial-solar-street-lights",
    title: "Supply of Industrial All-in-One Solar Street Lights",
    type: "Supply",
    description:
      "Supply of industrial all-in-one solar street lights to a client.",
    image: {
      publicId:
        "Supply-of-industrial-solar-all-in-one-solar-street-lights-to-a-client",
      alt: "Supply of Industrial All-in-One Solar Street Lights",
    },
  },
  {
    id: "flexible-cables-lekki",
    title: "Industrial Flexible Cables for Air Conditioning",
    location: "Lekki, Lagos",
    type: "Procurement",
    description:
      "Procurement of industrial flexible cables for the installation of industrial air conditioning at Lekki, Lagos.",
    image: {
      publicId:
        "Procurement-of-industrial-flexible-cables-for-installation-of-industrial-air-condition-at-Lekki-Lagos",
      alt: "Industrial Flexible Cables for Air Conditioning, Lekki, Lagos",
    },
  },
] as const satisfies readonly Project[];
