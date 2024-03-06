export interface categoryData {
  answer: string[];
  message: string;
  status: boolean;
}
export interface DropdownChangeEvent {
  value: { year: string };
}
export interface monthData {
  [index: number]: number | string | number[];
}
export interface yearsDataForMonth {
  [index: number]: monthData;
}
export interface YearData {
  [year: number]: {
    [month: number]: {
      [date: number]: number[];
    };
  };
}

export interface yearsAllDataFormonth {
  [index: number]: yearsDataForMonth;
}

export interface allYearsData {
  [index: number | string]: number[];
}
export interface yearsData {
  [index: number]: Array<number | string>;
}
export interface yearsAllData {
  [index: number]: yearsData;
}

export interface yearsArray {
  year: string;
}

export interface Review {
  id: string;
  date: string;
  country: string;
  traveler_type: string;
  review: string;
  rating: string;
  sentiment_score: number | string;
  categories: { [key: string]: number };
}
export interface dataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string;
  borderWidth: number;
  lineTension: number;
}

export interface graphData {
  labels: Array<string | number>;
  datasets: dataset[];
}
export interface TickOptions {
  stepSize: number;
  callback: (value: number, index: number, values: number) => string;
}

export interface YScaleOptions {
  min: number;
  max: number;
  ticks: TickOptions;
}

export interface XScaleOptions {
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
  labels: LegendLabelsOptions;
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
