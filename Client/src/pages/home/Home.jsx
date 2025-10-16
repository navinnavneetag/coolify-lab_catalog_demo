import { Skeleton } from "@/components/ui/skeleton";
import { useLabData } from "@/hooks/data/useLabData";
import Error from "@/components/error/Error";
import { Suspense, lazy } from "react";
import { useState } from "react";
import TextLoader from "@/components/text-loader/TextLoader";
import DashboardSkeleton from "@/components/dashboard-skeleton/DashboardSkeleton";
import GridSection from "@/components/grid-section/GridSection";
import TopSection from "@/components/top-section/TopSection";
import { useEffect } from "react";
import IndiaMap from "@/components/india-map/IndiaMap";

const LazyBarChartCard = lazy(() =>
  import("@/components/bar-chart-card/BarChartCard")
);
const LazyTableCard = lazy(() => import("@/components/table-card/TableCard"));

function Home() {
  const [initialData, setInitialData] = useState(null);
  const [isFetchingFilteredData, setIsFetchingFilteredData] = useState(false);
  const {
    data,
    isPending,
    isError,
    error,
    gridItems,
    dropdownOptions,
    DownloadLabs,
    advancedFilterOptions,
  } = useLabData();

  window.onload = () => {
    localStorage.getItem("Lab Name") && localStorage.removeItem("Lab Name");
    localStorage.getItem("Main Food Category") &&
      localStorage.removeItem("Main Food Category");
    localStorage.getItem("Test Sub Category") &&
      localStorage.removeItem("Test Sub Category");
    localStorage.getItem("Product") && localStorage.removeItem("Product");
    localStorage.getItem("Parameter") && localStorage.removeItem("Parameter");
    localStorage.getItem("Region") && localStorage.removeItem("Region");
    localStorage.getItem("State") && localStorage.removeItem("State");
  };

  useEffect(() => {
    if (!initialData && data) setInitialData(data);
  }, [data, initialData]);

  if (isFetchingFilteredData)
    return <TextLoader text="Fetching Filtered Data..." />;
  if (isError) return <Error error={error} />;
  if (isPending) return <DashboardSkeleton />;

  return (
    <main className="py-2 px-4 bg-muted">
      <div className="mb-2 motion-duration-[4s] motion-opacity-in-0 ">
        <TopSection
          setIsFetchingFilteredData={setIsFetchingFilteredData}
          initialData={initialData}
          dropdownOptions={dropdownOptions}
          Labs={DownloadLabs}
          advancedFilterOptions={advancedFilterOptions}
        />

        <GridSection gridItems={gridItems} />

        <div className="mt-2 flex flex-col gap-4">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <IndiaMap stateGroupedData={data.stateGroupedData} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyTableCard
              entries={data.labScopePercentage}
              name="Lab Scope Percentage"
            />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard
              entries={data.labGroupedEntries}
              name="Lab Entry Chart"
            />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyBarChartCard
              entries={data.testGroupedEntries}
              name="Sub Category Entry Chart"
            />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <LazyTableCard
              entries={data.crossTabMatrix}
              name="Cross Tab Matrix"
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default Home;
