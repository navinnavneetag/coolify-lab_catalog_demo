import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { colors } from "@/lib/colors";

const BarChartCard = ({ entries, name }) => {
  const generateConfig = () => {
    const config = {};
    return config;
  };

  const config = generateConfig(entries);

  if (!entries?.length) {
    return <div>No data available</div>;
  }
  return (
    <Card className="border border-border ">
      <CardHeader>
        <CardTitle>
          {name}
        </CardTitle>
        <CardDescription>{name === "Lab Scope Percentage" ? "Scope Percentage of Labs catering to Parameters" : "Parameter Accredited for Testing"}</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer
          className="max-h-[400px]"
          entriesAmt={entries.length}
          config={config}
        >
          <BarChart
            accessibilityLayer
            data={entries}
            margin={{
              top: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 15 ? `${value.slice(0, 15)}...` : value
              }
            />
            <YAxis  />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="entry_count" radius={8}>
              {entries.reduce((acc, entry, index) => {
                return acc.concat(
                  <LabelList
                    key={`label-${entry.name}-${index}`}
                    position="top"
                    offset={4}
                    fontSize={12}
                  />,
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={colors[index % colors.length]}
                  />
                );
              }, [])}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

BarChartCard.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      lab_name: PropTypes.string,
      test_sub_category: PropTypes.string,
      entry_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  name: PropTypes.string,
};

export default BarChartCard;
