const createFilterBody = (toggleValue) => {
  const filterBody = {};

  if (localStorage.getItem("Lab Name") != null) {
    filterBody.lab_name = JSON.parse(localStorage.getItem("Lab Name"));
  }
  if (localStorage.getItem("Main Food Category") != null) {
    filterBody.main_food_category = JSON.parse(
      localStorage.getItem("Main Food Category")
    );
  }
  if (localStorage.getItem("Test Sub Category") != null) {
    filterBody.test_sub_category = JSON.parse(
      localStorage.getItem("Test Sub Category")
    );
  }
  if (toggleValue == "Chemical") {
    filterBody.test_category = ["Chemical"];
  } else if (toggleValue == "Biological") {
    filterBody.test_category = ["Biological"];
  }
  if (localStorage.getItem("Parameter") != null) {
    filterBody.parameter = JSON.parse(localStorage.getItem("Parameter"));
  }
  if (localStorage.getItem("Product") != null) {
    filterBody.product = JSON.parse(localStorage.getItem("Product"));
  }
  if (localStorage.getItem("Region") != null) {
    filterBody.region = JSON.parse(localStorage.getItem("Region"));
  }
  if (localStorage.getItem("State") != null) {
    filterBody.state = JSON.parse(localStorage.getItem("State"));
  }

  return filterBody;
};

export default createFilterBody;

    