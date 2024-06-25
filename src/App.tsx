import React, { useState, useEffect } from "react";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import ISelectionId = powerbi.visuals.ISelectionId;
import Dropdown from "./Components/Dropdown";
import "./App.css";
import { VisualFormattingSettingsModel } from "./settings";
import CalendarChart from "./Components/CalenderChart";
import WeeksInYearChart from "./Components/WeeksInYearChart";
import LicenseKeyValidator from "./Components/LicenseKeyValidator";

interface DataPoint {
  category: string;
  goal: number;
  values: number;
  selectionId: ISelectionId;
}

interface AppProps {
  options: any;
  target: any;
  host: any;
  dataView: DataView;
  formattingSettings: VisualFormattingSettingsModel;
}

const App: React.FC<AppProps> = ({
  options,
  target,
  host,
  dataView,
  formattingSettings,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [fullData, setFullData] = useState<DataPoint[]>([]);
  const [category, setCategory] = useState<{ [key: string]: any[] }>({});
  const [goal, setGoal] = useState<{ [key: string]: any[] }>({});
  const [values, setValues] = useState<{ [key: string]: any[] }>({});
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("");
  const [selectedGoalKey, setSelectedGoalKey] = useState<string>("");
  const [selectedValuesKey, setSelectedValuesKey] = useState<string>("");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("All");
  const [selectedTopN, setSelectedTopN] = useState<number>(0);
  const [isLicenseValid, setIsLicenseValid] = useState<boolean>(false);

  const transformData = (
    dataView: DataView,
    selectedCategoryKey: string,
    selectedGoalKey: string,
    selectedValuesKey: string
  ): DataPoint[] => {
    const transformedData: DataPoint[] = [];
    const categories = dataView.categorical.categories;
    const values = dataView.categorical.values;

    const categoryMapTemp: { [key: string]: any[] } = {};
    const valuesMapTemp: { [key: string]: any[] } = {};
    const goalMapTemp: { [key: string]: any[] } = {};

    categories.forEach((category: any) => {
      if (category.source.roles.category) {
        categoryMapTemp[category.source.displayName] = category.values;
      }
    });

    values.forEach((value: any) => {
      if (value.source.roles.goal) {
        goalMapTemp[value.source.displayName] = value.values;
      }
      if (value.source.roles.values) {
        valuesMapTemp[value.source.displayName] = value.values;
      }
    });

    setCategory(categoryMapTemp);
    setGoal(goalMapTemp);
    setValues(valuesMapTemp);

    const selectedCategoryValues = selectedCategoryKey
      ? categoryMapTemp[selectedCategoryKey] || []
      : categoryMapTemp[Object.keys(categoryMapTemp)[0]] || [];
    const selectedGoalValues = selectedGoalKey
      ? goalMapTemp[selectedGoalKey] || []
      : goalMapTemp[Object.keys(goalMapTemp)[0]] || [];
    const selectedValuesValues = selectedValuesKey
      ? valuesMapTemp[selectedValuesKey] || []
      : valuesMapTemp[Object.keys(valuesMapTemp)[0]] || [];

    const categoryLength = selectedCategoryValues.length;
    for (let i = 0; i < categoryLength; i++) {
      transformedData.push({
        goal: selectedGoalValues[i],
        category: selectedCategoryValues[i],
        values: selectedValuesValues[i],
        selectionId: host
          .createSelectionIdBuilder()
          .withCategory(dataView.categorical.categories[0], i)
          .createSelectionId(),
      });
    }
    return transformedData;
  };

  const filterDataByQuarter = (
    data: DataPoint[],
    quarter: string
  ): DataPoint[] => {
    if (quarter === "All") {
      return data;
    }
    const quarterMonths = {
      Q1: [0, 1, 2], // January, February, March
      Q2: [3, 4, 5], // April, May, June
      Q3: [6, 7, 8], // July, August, September
      Q4: [9, 10, 11], // October, November, December
    };

    return data.filter((dataPoint) => {
      const date = new Date(dataPoint.category);
      return quarterMonths[quarter].includes(date.getMonth());
    });
  };

  const filterDataByTopN = (data: DataPoint[], topN: number): DataPoint[] => {
    if (topN <= 0) {
      return data;
    }
    return data.sort((a, b) => b.values - a.values).slice(0, topN);
  };

  useEffect(() => {
    if (dataView) {
      const transformedData: DataPoint[] = transformData(
        dataView,
        selectedCategoryKey,
        selectedGoalKey,
        selectedValuesKey
      );
      setFullData(transformedData);
    }
  }, [dataView, selectedCategoryKey, selectedGoalKey, selectedValuesKey]);

  useEffect(() => {
    let filteredData = filterDataByQuarter(fullData, selectedQuarter);
    filteredData = filterDataByTopN(filteredData, selectedTopN);
    setData(filteredData);
  }, [selectedQuarter, selectedTopN, fullData]);

  const handleDropdownChange =
    (setter: React.Dispatch<React.SetStateAction<string | number>>) =>
    (value: string | number) => {
      setter(value);
    };

  return (
    <div className="App">
      <div className="container">
        <div className="dropdowns">
          <LicenseKeyValidator
            licenseKey={formattingSettings.licenseKey.licenseKey.value}
            onValidate={setIsLicenseValid}
          />
          {isLicenseValid && (
            <>
              {formattingSettings.calendarChartSettings.showCategory.value && (
                <Dropdown
                  label="Category"
                  options={Object.keys(category).map((key) => ({
                    key,
                    value: key,
                    text: key,
                  }))}
                  selectedValue={selectedCategoryKey}
                  onChange={handleDropdownChange(setSelectedCategoryKey)}
                />
              )}
              {formattingSettings.calendarChartSettings.showGoal.value && (
                <Dropdown
                  label="Goal"
                  options={Object.keys(goal).map((key) => ({
                    key,
                    value: key,
                    text: key,
                  }))}
                  selectedValue={selectedGoalKey}
                  onChange={handleDropdownChange(setSelectedGoalKey)}
                />
              )}
              {formattingSettings.calendarChartSettings.showValues.value && (
                <Dropdown
                  label="Actual"
                  options={Object.keys(values).map((key) => ({
                    key,
                    value: key,
                    text: key,
                  }))}
                  selectedValue={selectedValuesKey}
                  onChange={handleDropdownChange(setSelectedValuesKey)}
                />
              )}
              {formattingSettings.calendarChartSettings.showQuarter.value && (
                <Dropdown
                  label="Quarter"
                  options={[
                    { key: "All", value: "All", text: "All" },
                    { key: "Q1", value: "Q1", text: "Q1" },
                    { key: "Q2", value: "Q2", text: "Q2" },
                    { key: "Q3", value: "Q3", text: "Q3" },
                    { key: "Q4", value: "Q4", text: "Q4" },
                  ]}
                  selectedValue={selectedQuarter}
                  onChange={handleDropdownChange(setSelectedQuarter)}
                />
              )}
              {formattingSettings.calendarChartSettings.showTopN.value && (
                <Dropdown
                  label="Top N"
                  options={[
                    { key: "0", value: 0, text: "All" },
                    { key: "3", value: 3, text: "Top 3" },
                    { key: "5", value: 5, text: "Top 5" },
                    { key: "10", value: 10, text: "Top 10" },
                  ]}
                  selectedValue={selectedTopN}
                  onChange={handleDropdownChange(setSelectedTopN)}
                />
              )}
            </>
          )}
        </div>
      </div>
      <WeeksInYearChart
        data={data}
        selectedQuarter={selectedQuarter}
        options={options}
      />
      <CalendarChart
        options={options}
        target={target}
        host={host}
        data={data}
        selectedQuarter={selectedQuarter}
      />
    </div>
  );
};

export default App;
