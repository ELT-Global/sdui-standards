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

type UIBarGraph = UIBaseGraph & {
  type: "bar";
  xAxis: CategoricalAxis | NumericAxis;
  yAxis: NumericAxis;
  series: Array<{
    label: string;
    color?: string;
    data: Array<{
      x: string | number;
      y: number;
    }>;
  }>;
};

type LineGraph = UIBaseGraph & {
  type: "line";
  xAxis: CategoricalAxis | NumericAxis;
  yAxis: NumericAxis;
  series: Array<{
    label: string;
    color?: string;
    data: Array<{
      x: string | number;
      y: number;
    }>;
  }>;
};

type PieGraph = UIBaseGraph & {
  type: "pie";
  series: Array<{
    label: string;
    color?: string;
    value: number;
  }>;
};

export type UIGraph = UIBarGraph | LineGraph | PieGraph;
