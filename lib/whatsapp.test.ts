import { describe, expect, it } from "vitest";

import { messages, telLink, waLink } from "./whatsapp";

function decoded(href: string): string {
  const text = new URL(href).searchParams.get("text");
  if (text === null) throw new Error("wa.me link has no text parameter");
  return text;
}

describe("waLink", () => {
  it("uses the site WhatsApp number and the approved general message", () => {
    const href = waLink(messages.general);

    expect(href.startsWith("https://wa.me/2348139027180?text=")).toBe(true);
    expect(decoded(href)).toBe(
      "Hello KGICL, I'd like to make an enquiry.",
    );
  });

  it("encodes apostrophes, ampersands, accents and the naira sign", () => {
    const href = waLink("I'd say R&D costs ₦5,000 café");
    const query = href.slice(href.indexOf("?text=") + 6);

    expect(query).toContain("%27");
    expect(query).toContain("%26");
    expect(query).toContain("%C3%A9");
    expect(query).toContain("%E2%82%A6");
    expect(query).not.toContain("+");
    expect(query).not.toContain("&");

    expect(decoded(href)).toBe("I'd say R&D costs ₦5,000 café");
  });

  it("encodes the product template with a model code", () => {
    const message = messages.product({
      name: "120W Solar Street Light",
      modelCode: "KG-SL-120W",
      url: "https://kgiclsolar.com/solar-lighting/120w",
    });

    expect(message).toBe(
      "Hello KGICL, I'm interested in the 120W Solar Street Light (KG-SL-120W). https://kgiclsolar.com/solar-lighting/120w",
    );
    expect(decoded(waLink(message))).toBe(message);
  });

  it("omits an empty model code and the brackets", () => {
    const withoutCode = messages.product({
      name: "120W Solar Street Light",
      url: "https://kgiclsolar.com/solar-lighting/120w",
    });
    const blankCode = messages.product({
      name: "120W Solar Street Light",
      modelCode: "   ",
      url: "https://kgiclsolar.com/solar-lighting/120w",
    });

    expect(withoutCode).toBe(
      "Hello KGICL, I'm interested in the 120W Solar Street Light. https://kgiclsolar.com/solar-lighting/120w",
    );
    expect(blankCode).toBe(withoutCode);
    expect(withoutCode).not.toContain("()");
  });

  it("builds the industrial quote template", () => {
    const message = messages.industrial({
      name: "Safety Helmet",
      url: "https://kgiclsolar.com/industrial-supply",
    });

    expect(message).toBe(
      "Hello KGICL, I'd like a quote for: Safety Helmet. https://kgiclsolar.com/industrial-supply",
    );
    expect(decoded(waLink(message))).toBe(message);
  });
});

describe("telLink", () => {
  it("converts local Nigerian numbers", () => {
    expect(telLink("0803 613 6883")).toBe("tel:+2348036136883");
    expect(telLink("0805-420-7519")).toBe("tel:+2348054207519");
    expect(telLink("08139027180")).toBe("tel:+2348139027180");
  });

  it("accepts international forms without doubling the country code", () => {
    expect(telLink("+2348036136883")).toBe("tel:+2348036136883");
    expect(telLink("2348036136883")).toBe("tel:+2348036136883");
    expect(telLink(" +234 803 613 6883 ")).toBe("tel:+2348036136883");
  });
});
