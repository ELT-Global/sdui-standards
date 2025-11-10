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
  periods: Record<
    string,
    {
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
    }
  >;
};

type LineGraph = UIBaseGraph & {
  type: "line";
  periods: Record<
    string,
    {
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
    }
  >;
};

type PieGraph = UIBaseGraph & {
  type: "pie";
  periods: Record<
    string,
    {
      series: Array<{
        label: string;
        color?: string;
        value: number;
      }>;
    }
  >;
};

export type UIGraph = UIBarGraph | LineGraph | PieGraph;
