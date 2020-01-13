import React from "react";
import { ResponsivePie } from "@nivo/pie";
// import { EntityType, EthnicityAcronymList } from "../../Constants";

/**
 * Main class component
 * @param {*} props
 */
function EthnicityChart(props) {
    const chartData = getGroupedEthnicData(
        props.schoolData,
        props.options,
        ethnicityAcronyms
    );
    const pieCharts = createPieCharts(chartData);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                height: "50%",
                width: "100%"
            }}
        >
            {pieCharts}
        </div>
    );
}

//
// Helper Functions
//

/**
 * return array->[schoolName, array[schoolData]]
 * ignoring zero values
 */
function getGroupedEthnicData(allData, options, ethnicityAcronymList) {
    let chartData = [];
    options.forEach(schoolName => {
        const schoolObj = allData[schoolName];

        let thisSchoolData = {};
        let schoolDataArray = [];
        // ethnicityAcronymList.forEach(ethnicityObj => {
        //     schoolDataArray.push({
        //         id: ethnicityObj.id,
        //         value: parseInt(schoolObj[ethnicityObj.id]),
        //         label: ethnicityObj.desc,
        //         chartColor: ethnicityObj.chartColor
        //     });
        // });

        schoolDataArray = schoolObj._ethnicity;

        // get percentage calculation out of total students that we consider
        let totalStudents = 0;
        schoolDataArray.forEach(element => (totalStudents += element.value));
        schoolDataArray.forEach(
            element =>
                (element.percentage = (
                    (element.value / totalStudents) *
                    100
                ).toFixed(2))
        );

        thisSchoolData.schoolName = schoolName;
        thisSchoolData.dataArray = schoolDataArray;
        chartData.push(thisSchoolData);
    });

    return chartData;
}

// const pieChartParentDivStyle = {
//     height: "300px",
//     width: "25%",
//     minWidth: "250px",
//     flexGrow: "1",
//     display: "flex",
//     flexDirection: "column"
// };

const styles = {
    root: {
        fontFamily: "consolas, sans-serif",
        textAlign: "center",
        position: "relative",
        width: 250,
        height: 300
    },

    totalLabel: {
        fontSize: 24
    }
};

function createPieCharts(chartData) {
    let pieCharts = [];
    const dataLength = chartData.length;
    chartData.forEach((row, index) => {
        pieCharts.push(
            <div key={row.schoolName} style={styles.root}>
                <div style={{ height: "90%", flexGrow: "1" }}>
                    <ResponsivePie
                        key={row.schoolName}
                        data={row.dataArray}
                        margin={{ top: 40, right: 60, bottom: 40, left: 40 }}
                        colors={d => d.chartColor}
                        sortByValue={true}
                        enableRadialLabels={false}
                        enableSlicesLabels={false}
                        innerRadius={0.5}
                        tooltip={data => {
                            return getTooltipHTML(data);
                        }}
                        legends={
                            index + 1 === dataLength
                                ? [
                                      {
                                          anchor: "top-right",
                                          direction: "column",
                                          itemWidth: 20,
                                          itemHeight: 20,
                                          translateY: 20,
                                          translateX: 30
                                          // symbolSize: 18,
                                          // symbolShape: "circle"
                                      }
                                  ]
                                : undefined
                        }
                    />
                </div>
                <div style={{ flexGrow: "1" }}>{row.schoolName}</div>
            </div>
        );
    });

    if (pieCharts && pieCharts.length > 0) {
        const heading = [];
        heading.push(<h3 key="ethnicityHeading">Ethnicity</h3>);
        pieCharts = heading.concat(pieCharts);
    }

    return pieCharts;
}

export default EthnicityChart;

const ethnicityAcronyms = [
    {
        id: "AA",
        desc: "African American",
        chartColor: "#f6d18a"
    },
    {
        id: "AS",
        desc: "Asian",
        chartColor: "blue"
    },
    {
        id: "HI",
        desc: "Hispanic",
        chartColor: "green"
    },
    {
        id: "MR",
        desc: "Multiracial",
        chartColor: "yellow"
    },
    {
        id: "NA",
        desc: "NA",
        chartColor: "pink"
    },
    {
        id: "NH_PI",
        desc: "Native Hawaiian and Pacific Islander",
        chartColor: "red"
    },
    {
        id: "WH",
        desc: "White",
        chartColor: "brown"
    }
];

function getTooltipHTML(data) {
    return (
        <div
            id={data.id}
            style={{ display: "flex", flexDirection: "column", color: "black" }}
        >
            <div>
                {data.desc}: {data.value}
            </div>
            <div>Percentage: {data.percentage}%</div>
        </div>
    );
}