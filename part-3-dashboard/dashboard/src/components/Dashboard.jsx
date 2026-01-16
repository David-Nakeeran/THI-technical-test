"use client";
import data from "@/data/data.json";
import { useState } from "react";
import NumericalTable from "./NumericalTable";
import CommentsAccordion from "./CommentsAccordion";
import NumericalBarChart from "./NumericalBarChart";

export default function Dashboard({
  parentQuestions,
  deptArray,
  locationArray,
}) {
  const [activeParent, setActiveParent] = useState(null);
  const [activeDept, setActiveDept] = useState(null);
  const [activeLocation, setActiveLocation] = useState(null);
  const [openIndexes, setOpenIndexes] = useState([]);

  function toggleAccordion(index) {
    if (openIndexes.includes(index)) {
      const indexes = openIndexes.filter((i) => {
        return i !== index;
      });
      setOpenIndexes([...indexes]);
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  }

  const parentButtonElements = parentQuestions.map((item, index) => {
    return (
      <button
        key={index}
        className={`cursor-pointer px-3 py-1 rounded font-semibold hover:scale-105 transform transition-colors duration-200
    ${
      activeParent === item
        ? "bg-gray-900 text-yellow-300"
        : "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
    }`}
        onClick={() => handleParentClick(item)}
      >
        {item}
      </button>
    );
  });

  const deptButtonElements = deptArray.map((item, index) => {
    return (
      <button
        key={index}
        className={`cursor-pointer px-3 py-1 rounded font-semibold hover:scale-105 transform transition-colors duration-200
    ${
      activeDept === item
        ? "bg-gray-900 text-yellow-300"
        : "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
    }`}
        onClick={() => handleDeptClick(item)}
      >
        {item}
      </button>
    );
  });

  const locationButtonElements = locationArray.map((item, index) => {
    return (
      <button
        key={index}
        className={`cursor-pointer px-3 py-1 rounded font-semibold hover:scale-105 transform transition-colors duration-200
    ${
      activeLocation === item
        ? "bg-gray-900 text-yellow-300"
        : "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
    }`}
        onClick={() => handleLocationClick(item)}
      >
        {item}
      </button>
    );
  });

  function handleClearFilters() {
    setActiveParent(null);
    setActiveDept(null);
    setActiveLocation(null);
    setOpenIndexes([]);
  }

  function handleParentClick(parent) {
    setActiveDept(null);
    setActiveLocation(null);
    setOpenIndexes([]);
    setActiveParent(parent);
  }

  function handleDeptClick(dept) {
    setOpenIndexes([]);
    setActiveDept(dept);
  }

  function handleLocationClick(location) {
    setOpenIndexes([]);
    setActiveLocation(location);
  }

  function filterByDemographic(filteredData) {
    if (activeDept) {
      filteredData = filteredData.filter((item) => {
        return item.Dept === activeDept;
      });
    }

    if (activeLocation) {
      filteredData = filteredData.filter((item) => {
        return item.Location === activeLocation;
      });
    }
    return filteredData;
  }

  function getTableNumericalData() {
    let filteredData = data;

    if (!activeParent) {
      return [];
    }

    filteredData = data.filter((item) => {
      return (
        item.parent_question === activeParent &&
        item.score !== "" &&
        item.is_parent === "No"
      );
    });

    filteredData = filterByDemographic(filteredData);

    const summary = filteredData.reduce((acc, currentValue) => {
      let score = Number(currentValue.score);

      let existingObj = acc.find((item) => {
        return item.question === currentValue.question_text;
      });

      if (existingObj) {
        existingObj.totalScore += Number(currentValue.score);
        existingObj.count += 1;
        existingObj.minScore = Math.min(
          existingObj.minScore,
          currentValue.score
        );
        existingObj.maxScore = Math.max(
          existingObj.maxScore,
          currentValue.score
        );
      } else {
        acc.push({
          question: currentValue.question_text,
          totalScore: score,
          count: 1,
          minScore: score,
          maxScore: score,
        });
      }
      return acc;
    }, []);

    return summary.map((obj) => {
      return {
        ...obj,
        averageScore: (obj.totalScore / obj.count).toFixed(1),
      };
    });
  }

  function getTableCommentsData() {
    let filteredData = data;

    if (!activeParent) {
      return [];
    }

    filteredData = data.filter((item) => {
      const hasComment = item.comments !== "";
      return (
        (item.parent_question === activeParent && hasComment) ||
        (item.question_text === activeParent && hasComment)
      );
    });

    filteredData = filterByDemographic(filteredData);

    const summary = filteredData.reduce((acc, currentValue) => {
      let existingObj = acc.find((item) => {
        return item.question === currentValue.question_text;
      });

      if (existingObj) {
        existingObj.comments.push(currentValue.comments);
      } else {
        acc.push({
          question: currentValue.question_text,
          comments: [currentValue.comments],
        });
      }
      return acc;
    }, []);
    return summary;
  }

  const tableNumericalData = getTableNumericalData();
  const commentsData = getTableCommentsData();

  return (
    <section>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Question Topic</h2>
        <div className="flex flex-wrap gap-2">{parentButtonElements}</div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-semibold mb-2">Filter by Department</h2>
        <div className="flex flex-wrap gap-2">{deptButtonElements}</div>
      </div>
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Filter by Location</h2>
        <div className="flex flex-wrap gap-2">{locationButtonElements}</div>
      </div>

      <div className="mb-6">
        <button
          className="cursor-pointer px-4 py-2 rounded font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105 transform transition-colors duration-200"
          onClick={() => handleClearFilters()}
        >
          Clear Filters
        </button>
      </div>
      {tableNumericalData && (
        <div>
          <div>
            <NumericalTable
              tableNumericalData={tableNumericalData}
              activeParent={activeParent}
            />
            <NumericalBarChart data={tableNumericalData} />
          </div>
          <CommentsAccordion
            commentsData={commentsData}
            onToggle={toggleAccordion}
            openIndexes={openIndexes}
          />
        </div>
      )}
    </section>
  );
}
