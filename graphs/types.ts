type UIBaseGraph = {
  title: string;
  description?: string;
  type: "bar" | "line" | "pie";
};

type BaseAxis = {
  type: "categorical" | "numeric";
};

type CategoricalAxis = BaseAxis & {
  type: "categorical";
  categories: string[];
};

type NumericAxis = BaseAxis & {
  type: "numeric";
  min: number;
  max: number;
  step?: number;
};

type UIBarGraph<T extends string = string> = UIBaseGraph & {
  type: "bar";
  xAxis: CategoricalAxis | NumericAxis;
  yAxis: NumericAxis;
  series: Array<{
    label: T;
    color?: string;
    data: Array<{
      x: string | number;
      y: number;
    }>;
  }>;
};

type LineGraph<T extends string = string> = UIBaseGraph & {
  type: "line";
  xAxis: CategoricalAxis | NumericAxis;
  yAxis: NumericAxis;
  series: Array<{
    label: T;
    color?: string;
    data: Array<{
      x: string | number;
      y: number;
    }>;
  }>;
};

type PieGraph<T extends string = string> = UIBaseGraph & {
  type: "pie";
  series: Array<{
    label: T;
    color?: string;
    value: number;
  }>;
};

export type UIGraph<T extends string = string> =
  | UIBarGraph<T>
  | LineGraph<T>
  | PieGraph<T>;
