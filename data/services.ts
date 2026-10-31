export type Service = {
  title: string;
  description: string;
  /** Short line shown under the description, where one is given. */
  note?: string;
};

/** The five main services, in the order set by PRD Appendix B. */
export const SERVICES = [
  {
    title: "Solar consultation and installation",
    description:
      "We advise on the right solar lighting for your site and install it.",
    note: "Free solar consultation for Port Harcourt clients.",
  },
  {
    title: "Electrical installation and wiring",
    description:
      "Electrical installation and wiring for homes, shops, offices and industrial sites.",
  },
  {
    title: "UPS supply",
    description: "Supply of UPS and power backup equipment.",
  },
  {
    title: "Procurement and logistics",
    description:
      "Sourcing and delivery of electrical, mechanical and industrial supplies.",
  },
  {
    title: "Civil and electrical installation of all types",
    description: "Civil and electrical installation works, large or small.",
  },
] as const satisfies readonly Service[];

/** Secondary list, from the client's earlier brochure. */
export const OTHER_SERVICES = [
  "Provision of skilled and semi-skilled personnel",
  // The 2019 brochure says "Oil Spill Control/Bioremediation"; the client's form said "well control".
  // confirm wording with client
  "Oil spill control and bioremediation",
  "Provision of marine equipment",
  "Welding and fabrication of flow-lines and steel structures",
  "Radio and telecommunications",
] as const;
