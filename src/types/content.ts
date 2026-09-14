import { RegionEntity, RegionType } from './region';
import { WorkKeywordEntity, ServiceFamily } from './keyword';

export interface PageContext {
  region: RegionEntity;
  workKeyword: WorkKeywordEntity;
  serviceFamily: ServiceFamily;
  regionLevel: RegionType;
  seoDisplayName: string;
  dynamicKeyword: string;
  canonicalRoute: string;
  isIndexable: boolean;
}

export interface DecisionPoint {
  title: string;
  desc: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ContentOutput {
  h1: string;
  heroHook: string;
  heroDescription: string;
  serviceSectionTitle: string;
  serviceItems: string[];
  decisionTitle: string;
  decisionIntro: string;
  decisionPoints: DecisionPoint[];
  estimateTitle: string;
  estimateDescription: string;
  processTitle: string;
  faqItems: FaqItem[];
  finalCtaTitle: string;
  finalCtaDescription: string;
}
