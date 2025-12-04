import { getLabData, postLabData } from "@/services/data.service.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useToast } from "../use-toast";

export const useLabData = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["labData"],
    queryFn: () => getLabData(),
    retry: 2,
    onError: (error) => {
      console.error("Failed to fetch lab data:", error);
    },
  });

  const mutation = useMutation({
    mutationFn: postLabData,
    onSuccess: (data) => {
      if (data.total_labs == "0") {
        queryClient.invalidateQueries(["labData"]);
        toast({
          variant: "destructive",
          title: "No data found!!",
          description: "There are no labs with the selected filters",
        });

        localStorage.getItem("Lab Name") && localStorage.removeItem("Lab Name");
        localStorage.getItem("Main Food Category") &&
          localStorage.removeItem("Main Food Category");
        localStorage.getItem("Test Sub Category") &&
          localStorage.removeItem("Test Sub Category");
        localStorage.getItem("Product") && localStorage.removeItem("Product");
        localStorage.getItem("Parameter") &&
          localStorage.removeItem("Parameter");
        localStorage.getItem("Region") && localStorage.removeItem("Region");
        localStorage.getItem("State") && localStorage.removeItem("State");
      } else {
        queryClient.setQueryData(["labData"], data);
      }
    },
  });

  const DownloadLabs = useMemo(() => {
    if (!data) return [];

    return data?.downloadLabData?.map((lab) => lab.labs);
  }, [data]);

  const option = useMemo(() => {
    if (!data?.categories) return [];

    return [
      {
        name: "Main Food Category",
        options:
          data?.categories.food_categories?.[0] === null
            ? []
            : data?.categories.food_categories,
      },
      {
        name: "Product",
        options:
          data?.categories.product?.[0] === null
            ? []
            : data?.categories.product,
      },
      {
        name: "Parameter",
        options:
          data?.categories.parameter?.[0] === null
            ? []
            : data?.categories.parameter,
      },
      {
        name: "Lab Name",
        options:
          data?.categories.lab_names?.[0] === null
            ? []
            : data?.categories.lab_names,
      },
      {
        name: "Test Sub Category",
        options:
          data?.categories.test_categories?.[0] === null
            ? []
            : data?.categories.test_categories,
      },
      {
        name: "Region",
        options:
          data?.categories.region?.[0] === null ? [] : data?.categories.region,
      },
      {
        name: "State",
        options:
          data?.categories.state?.[0] === null ? [] : data?.categories.state,
      },
    ];
  }, [data]);

  const advancedFilterOptions = useMemo(() => {
    if (!option) return [];

    return [
      { id: 0, name: "Main Food Category", options: option[0]?.options },
      { id: 1, name: "Product", options: option[1]?.options },
      { id: 2, name: "Parameter", options: option[2]?.options },
      { id: 3, name: "Lab Name", options: option[3]?.options },
      { id: 4, name: "Test Sub Category", options: option[4]?.options },
      { id: 5, name: "Region", options: option[5]?.options },
      { id: 6, name: "State", options: option[6]?.options },
    ];
  }, [option]);

  const gridItems = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        name: "Total Labs",
        value: data?.total_labs,
      },
      {
        id: 2,
        name: "Total Unique Parameters",
        value: data?.categories?.parameter?.length || 0,
      },
      {
        id: 3,
        name: "Main Food Categories",
        value: data?.total_food_categories,
      },
      {
        id: 4,
        name: "Test Sub Categories",
        value: data?.total_test_categories,
      },
    ];
  }, [data]);

  const dropdownOptions = useMemo(() => {
    if (!option) return [];

    return [
      { id: 0, name: "Main Food Category", options: option[0]?.options },
      { id: 1, name: "Product", options: option[1]?.options },
      { id: 2, name: "Parameter", options: option[2]?.options },
    ];
  }, [option]);

  return {
    data,
    isPending,
    isError,
    error,
    gridItems,
    dropdownOptions,
    advancedFilterOptions,
    mutation,
    DownloadLabs,
  };
};
