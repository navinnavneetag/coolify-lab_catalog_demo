import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { lazy } from "react";
import { Suspense } from "react";
import { TbFilter } from "react-icons/tb";
import Toggle from "../toggle/Toggle";
import PropTypes from "prop-types";

const LazyDropdownContainer = lazy(() =>
  import("@/components/dropdown-container/DropdownContainer")
);

const FilterSlider = memo(function FilterSlider({
  advancedFilterOptions,
  toggleValue,
  setToggleValue,
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="h-7 px-3 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-green-500 hover:bg-green-500/90 text-green-50">
          <TbFilter size={24} className="lg:block hidden" /> Advanced Filters
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Advanced Filters</SheetTitle>
          <SheetDescription>
            Apply advanced filters and click on confirm
          </SheetDescription>
        </SheetHeader>
        <div className="my-4 flex flex-col gap-4">
          {advancedFilterOptions.map((option) => (
            <Suspense
              key={option.id}
              fallback={<Skeleton className="h-10 w-full" />}
            >
              <LazyDropdownContainer
                key={option.id}
                name={option.name}
                options={option.options}
              />
            </Suspense>
          ))}
        </div>
        <Toggle
          toggleValue={toggleValue}
          setToggleValue={setToggleValue}
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button>Confirm</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
});

FilterSlider.propTypes = {
  advancedFilterOptions: PropTypes.array.isRequired,
  toggleValue: PropTypes.string.isRequired,
  setToggleValue: PropTypes.func.isRequired,
};

export default FilterSlider;
