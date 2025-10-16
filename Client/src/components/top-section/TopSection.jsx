import { Suspense, lazy, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { useLabData } from "@/hooks/data/useLabData";
import createFilterBody from "@/lib/createFilterBody";
import { memo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { RiResetRightLine } from "react-icons/ri";
import { TbSearch } from "react-icons/tb";
import { useEffect } from "react";
import Toggle from "./toggle/Toggle";
import FilterSlider from "./filter-slider/FilterSlider";
import DownloadModal from "./download-modal/DownloadModal";

const LazyDropdownContainer = lazy(() =>
  import("@/components/dropdown-container/DropdownContainer")
);

const TopSection = memo(function TopSection({
  setIsFetchingFilteredData,
  initialData,
  dropdownOptions,
  Labs,
  advancedFilterOptions,
}) {
  const queryClient = useQueryClient();
  const mutation = useLabData().mutation;
  const [toggleValue, setToggleValue] = useState("");

  useEffect(() => {
    setToggleValue(localStorage.getItem("Test Category") || "Both");
  }, []);

  const handleSearch = async () => {
    if (
      localStorage.getItem("Lab Name") === null &&
      localStorage.getItem("Main Food Category") === null &&
      localStorage.getItem("Test Sub Category") === null &&
      localStorage.getItem("Product") === null &&
      localStorage.getItem("Parameter") === null &&
      localStorage.getItem("Region") === null &&
      localStorage.getItem("State") === null &&
      toggleValue == "Both"
    ) {
      queryClient.setQueryData(["labData"], initialData);
      return;
    }

    setIsFetchingFilteredData(true);
    const filterBody = createFilterBody(toggleValue);
    try {
      await mutation.mutateAsync(filterBody);
      setIsFetchingFilteredData(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
      setIsFetchingFilteredData(false);
    }
  };

  const handleReset = () => {
    localStorage.getItem("Lab Name") && localStorage.removeItem("Lab Name");
    localStorage.getItem("Main Food Category") && localStorage.removeItem("Main Food Category");
    localStorage.getItem("Test Sub Category") && localStorage.removeItem("Test Sub Category"); 
    localStorage.getItem("Product") && localStorage.removeItem("Product");
    localStorage.getItem("Parameter") && localStorage.removeItem("Parameter");
    localStorage.getItem("Region") && localStorage.removeItem("Region");
    localStorage.getItem("State") && localStorage.removeItem("State");
    
    window.dispatchEvent(new Event("filtersReset"));
    queryClient.setQueryData(["labData"], initialData);
  };

  return (
    <>
      <div className="flex items-center mb-1 gap-2 ">
        <div className="w-1/4">
          {dropdownOptions[0] && (
            <Suspense
              key={dropdownOptions[0].id}
              fallback={<Skeleton className="h-10 w-full" />}
            >
              <LazyDropdownContainer
                key={dropdownOptions[0].id}
                name={dropdownOptions[0].name}
                options={dropdownOptions[0].options}
              />
            </Suspense>
          )}
        </div>
        <div className="w-3/4 flex justify-between gap-2">
          {dropdownOptions[1] && (
            <Suspense
              key={dropdownOptions[1].id}
              fallback={<Skeleton className="h-10 w-full" />}
            >
              <LazyDropdownContainer
                key={dropdownOptions[1].id}
                name={dropdownOptions[1].name}
                options={dropdownOptions[1].options}
              />
            </Suspense>
          )}
          {dropdownOptions[2] && (
            <Suspense
              key={dropdownOptions[2].id}
              fallback={<Skeleton className="h-10 w-full" />}
            >
              <LazyDropdownContainer
                key={dropdownOptions[2].id}
                name={dropdownOptions[2].name}
                options={dropdownOptions[2].options}
              />
            </Suspense>
          )}
        </div>
      </div>
      <div className="flex items-center mb-2 justify-between">
        <Toggle toggleValue={toggleValue} setToggleValue={setToggleValue} />
        <div className="flex items-center gap-2">
          <DownloadModal toggleValue={toggleValue} Labs={Labs} />
          <Button
            onClick={handleReset}
            variant="destructive"
            size="sm"
            className=" text-sm font-normal"
          >
            <RiResetRightLine size={24} className="lg:block hidden" /> Reset
            Filters
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-normal text-sm"
            onClick={handleSearch}
            size="sm"
          >
            <TbSearch size={24} className="lg:block hidden" /> Search
          </Button>
          <FilterSlider
            advancedFilterOptions={advancedFilterOptions}
            toggleValue={toggleValue}
            setToggleValue={setToggleValue}
          />
        </div>
      </div>
    </>
  );
});

TopSection.propTypes = {
  setIsFetchingFilteredData: PropTypes.func,
  initialData: PropTypes.object,
  dropdownOptions: PropTypes.array,
  Labs: PropTypes.array,
  advancedFilterOptions: PropTypes.array,
};

export default TopSection;
