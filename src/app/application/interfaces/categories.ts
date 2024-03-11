export interface ReviewData {
  id: string;
  date: Date;
  country: string;
  traveler_type: string;
  review: string;
  rating: string;
  sentiment_score: number | string;
  categories: { [key: string]: string };
}
export interface DataForAllYears {
  [year: number]: {
    [month: number]: {
      year: number;
      month: number;
      categories: { [category: string]: number }[];
    };
  };
}

export interface avgDataForCategories {
  categories: { [category: string]: number };
  month: string;
  year: number;
}
export interface LastThreeMonthsForReview {
  month: number;
  negativeReviewData: number;
  positiveReviewData: number;
  [key: string]: number;
}
export interface ResponseData {
  status: string | number | boolean;
  answer: string;
  recommendation: Recommendation[];
  summary: string;
}

export interface Recommendation {
  point: string;
}
export interface summaryEvent {
  value: string;
}
export interface categoryResponce {
  answer: string[];
  message: string;
  status: boolean;
}

export interface yearDataForSentimentGraph {
  value: {
    year: string;
  };
}
export interface categorieMonthwise {
  month: string | number;
  categories: any[];
  avgValue: number;
  label: string;
}
export interface DropdownChangeEvent {
  value: { year: string };
}
export interface datasetData {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string;
  borderWidth?: number;
  lineTension?: number;
  type?: string;
  fill?: boolean;
  tension?: number;
  worstReviews?: any;
  bestReviews?: any;
}
export interface graphData {
  labels: Array<string | number>;
  datasets: datasetData[];
  worstReviews?: any;
  bestReviews?: any;
}

export interface yearsData {
  [index: number]: allYearData;
}
export interface allYearData {
  [index: number]: {
    bestReview: any;
    worstReview: any;
    positiveReview: number;
    negativeReview: number;
  };
}

export interface years {
  year: string;
}
export interface recommendation {
  point: string;
}

export interface summaryRecomendations {
  summary: string;
  recomendation: recommendation[];
}

export interface year {
  possitiveReviewData: number[];
  negativeReviewData: number[];
  LeastReview: number[];
  BestReview: number[];
}

export interface yearData {
  [index: string]: year;
}

export interface TickOptions {
  stepSize: number;
  callback: (value: any, index: number, values: any) => string;
}

export interface YScaleOptions {
  min?: number;
  max?: number;
  ticks?: TickOptions;
  stacked?: boolean;
}

export interface XScaleOptions {
  stacked?: boolean;
  grid: {
    display: boolean;
  };
}

export interface LegendLabelsOptions {
  font: {
    family: string;
  };
}

export interface LegendOptions {
  labels?: LegendLabelsOptions;
  display?: boolean;
}

export interface ScalesOptions {
  y: YScaleOptions;
  x: XScaleOptions;
}

export interface PluginsOptions {
  legend: LegendOptions;
  tooltip?: any;
}

export interface Options {
  scales: ScalesOptions;
  plugins: PluginsOptions;
}
