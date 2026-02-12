export interface FooterSectionLink {
  label: string;
  url: string;
}

export interface FooterSection {
  title: string;
  links: FooterSectionLink[];
}

export interface FooterAddress {
  company: string;
  line1: string;
  line2?: string;
  line3?: string;
  country?: string;
}

/**
 * DB Footer (complete object)
 */
export interface Footer {
  _id: string;
  sections: FooterSection[];
  bottomLinks: FooterSectionLink[];
  address: FooterAddress;
  copyrightText: string;
}

/**
 * Create / Update payload
 * (_id backend banata hai)
 */
export type FooterPayload = Omit<Footer, "_id">;
