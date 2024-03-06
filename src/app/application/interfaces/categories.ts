export interface categorieMonthwise {
  month: string;
  categories: number[];
  avgValue: number;
  label: string;
}
export interface DropdownChangeEvent {
  value: { year: string };
}
export interface datasetData {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string;
  borderWidth: number;
  lineTension: number;
}
export interface graphData {
  labels: Array<string | number>;
  datasets: datasetData[];
}

export interface yearsData {
  [index: number]: allYearData;
}
export interface allYearData {
  [index: number]: { positiveReview: number; negativeReview: number };
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
}

export interface Options {
  scales: ScalesOptions;
  plugins: PluginsOptions;
}
