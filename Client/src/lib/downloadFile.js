const downloadFile = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  const clickEvt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  a.dispatchEvent(clickEvt);
  a.remove();
};

// const exportToJson = (e) => {
//   e.preventDefault();
//   downloadFile({
//     data: JSON.stringify(usersData.users),
//     fileName: "users.json",
//     fileType: "text/json",
//   });
// };

const exportToCsv = (data) => {
  data.forEach((lab) => {
    const { lab_name, tests } = lab;

    const csvRows = [];

    const headers = [
      "Lab Name",
      "Main Food Category",
      "Test Sub Category",
      "Test Category",
      "Parameter",
      "Region",
      "State",
    ];
    csvRows.push(headers.join(","));

    tests.forEach((test) => {
      const row = [
        lab_name,
        test.main_food_category,
        test.test_sub_category,
        test.test_category,
        test.parameter,
        test.region,
        test.state,
      ]
        .map((value) => `"${value}"`)
        .join(",");

      csvRows.push(row);
    });

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    const fileName = `${lab_name.replace(/[^a-z0-9]/gi, "_")}_scope.csv`;

    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
};

export { exportToCsv };
