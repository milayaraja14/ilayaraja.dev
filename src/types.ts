export interface HeroData {
  name: string;
  title: string;
  tagline: string;
  ProfileID?: string;
}

export interface GenericItem {
  Title?: string;
  Description?: string;
  Date?: string;
  label?: string;
  ImageID?: string;
  Image?: string;
  URL?: string;
  Link?: string;
}

export interface SectionProps {
  label: string;
  title: string;
  items: GenericItem[];
  id: string;
}

export interface ExperienceItem {
  Title: string;
  Company: string;
  Location: string;
  Period: string;
  Description: string;
}
