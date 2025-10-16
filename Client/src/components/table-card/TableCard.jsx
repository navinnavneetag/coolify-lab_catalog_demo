import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PropTypes from "prop-types";

export function TableCard({ entries, name }) {
  const ColumnHeaders =
    name === "Lab Scope Percentage"
      ? Object.keys(entries?.[0] || {}).slice(1)
      : [
          ...new Set(
            entries.flatMap((entry) =>
              entry.main_food_category.map((food) => food.category)
            )
          ),
        ];

  if (!entries || Object.keys(entries).length === 0) {
    return <div>No data available</div>;
  }
  return (
    <div className="rounded border text-card-foreground shadow p-4 bg-background">
      <div className="p-2 space-y-1.5 flex flex-col mb-4">
        <div className="font-semibold leading-none tracking-tight">
          {name === "Lab Scope Percentage" ? "Lab Scope Percentage" : "Lab Table"}
        </div>
        <div className="text-sm text-muted-foreground">
          {name === "Lab Scope Percentage" ? "Percentage of Total Parameters Each Lab is Accredited to Test" : "Main Food Categories"}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Lab Name</TableHead>
            {name === "Lab Scope Percentage" ? (
              <>
                <TableHead className="w-[300px]">Parameter Count</TableHead>
                <TableHead className="w-[300px]">Total Count</TableHead>
                <TableHead className="w-[300px]">Scope Percentage</TableHead>
              </>
            ) : (
              ColumnHeaders.map((columnHeader) => (
                <TableHead key={columnHeader} className="w-[200px]">
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger className="">
                      {columnHeader.length > 20 ? columnHeader.slice(0, 20) + "..." : columnHeader}
                      </TooltipTrigger>
                      <TooltipContent className="grid min-w-[8rem] items-start gap-1.5 rounded border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl text-muted-foreground">
                        {columnHeader}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              ))
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {name === "Lab Scope Percentage"
            ? entries.map((entry) => (
                <TableRow key={entry.name}>
                  <TableCell className="font-medium w-[400px]">
                    {entry.name}
                  </TableCell>
                  {ColumnHeaders.map((columnHeader) => (
                    <TableCell
                      key={`${entry.name}-${columnHeader}`}
                      className="bg-muted m-1 rounded hover:cursor-pointer hover:bg-card hover:text-card-foreground w-[292px]"
                    >
                      <span className="text-muted-foreground ml-1">
                        {columnHeader === "entry_count"
                          ? `${entry[columnHeader]} %`
                          : entry[columnHeader]}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : entries.map((entry) => (
                <TableRow key={entry.lab_name}>
                  <TableCell className="font-medium w-[400px]">
                    {entry.lab_name}
                  </TableCell>
                  {ColumnHeaders.map((columnHeader) => {
                    const foundCategory = entry.main_food_category.find(
                      (food) => food.category === columnHeader
                    );
                    return (
                      <TableCell
                        key={`${entry.lab_name}-${columnHeader}`}
                        className="bg-muted m-1 rounded hover:cursor-pointer hover:bg-card hover:text-card-foreground w-[192px]"
                      >
                        <span className="text-muted-foreground ml-1">
                          {foundCategory ? foundCategory.entry_count : "-"}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}

TableCard.propTypes = {
  entries: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

export default TableCard;
