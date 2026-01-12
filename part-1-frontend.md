# Part 1 – Frontend (React / Next.js)

## Q1: Three core HTML tags

The three core HTML tags present on all pages are:

```html
<html>
  <head></head>
  <body></body>
</html>
```

## Q2: Three core HTML tags

### Approach

I created a reusable React component called `SurveyResults` that:

- Accepts the survey results as a `results` prop
- Maps over the results to dynamically generate table rows
- Uses semantic HTML elements (`<table>`, `<thead>`, `<tbody>`, `<th>`, `<caption>`) for accessibility
- Safely handles null or empty results using a fallback empty array
- Provides a message if there are no results
- Applied Tailwind CSS for styling and responsiveness

This ensures the component is **accessible, responsive, and safe** to use in different scenarios.

### Code

```jsx
export default function SurveyResults({ results }) {
  const surveyResults = results || [];
  const surveyResultsElements = surveyResults.map((person, index) => {
    return (
      <tr key={index} className="border-t border-gray-200">
        <th scope="row">{person.name}</th>
        <td>{person.q1}</td>
        <td>{person.q2}</td>
        <td>{person.q3}</td>
      </tr>
    );
  });
  return (
    <div className="sm:overflow-x-auto">
      {surveyResults && surveyResults.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-center">
          <caption>Survey Results</caption>
          <thead className="bg-gray-500">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Question 1</th>
              <th scope="col">Question 2</th>
              <th scope="col">Question 3</th>
            </tr>
          </thead>
          <tbody>{surveyResultsElements}</tbody>
        </table>
      ) : (
        <p>No survey results yet.</p>
      )}
    </div>
  );
}
```

## Q3: Form Component with Validation, Fetch, and Chart.js

### Approach

I created a React component called `ItemForm` that handles adding a new item with the following considerations:

- **Controlled Form:**

  - All form fields (`item_id`, `item_name`, `item_date`, `item_order`) are managed via React state
  - Hidden field for `item_id` included

- **Validation:**

  - Ensures `item_name` is at least 5 characters
  - Checks that `item_id` and `item_order` are numbers
  - Verifies that `item_date` is a valid date
  - Errors are tracked in state and prevent submission if validation fails

- **Server Interaction:**

  - On form submission, an async `fetch` request posts the item data to a Next.js API route (`/api/store_item`)
  - Response updates additional state variables: `createdBy`, `createdAt`, and `scoreDistribution`

- **Data Visualization:**
  - Used Chart.js to display a bar chart of `score_distribution`
  - Dynamically highlights the bar with the highest count

### Code

```jsx
"use client";

import { useState } from "react";

export default function ItemForm() {
  const [item, setItem] = useState({
    item_id: "",
    item_name: "",
    item_date: "",
    item_order: "",
  });
  const [createdBy, setCreatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [scoreDistribution, setScoreDistribution] = useState([]);
  const [errors, setErrors] = useState({});

  function handleFormData(e) {
    setItem({ ...item, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {
      isErrors: false,
      item_name: "",
      item_date: "",
      item_order: "",
    };

    if (item.item_name.length < 5) {
      newErrors.isErrors = true;
      newErrors.item_name = "Name too short.";
    }

    if (isNaN(item.item_id)) {
      newErrors.isErrors = true;
      newErrors.item_id = "ID must be a number.";
    }

    if (isNaN(item.item_order)) {
      newErrors.isErrors = true;
      newErrors.item_order = "Order must be a number.";
    }

    if (isNaN(new Date(item.item_date).getTime())) {
      newErrors.isErrors = true;
      newErrors.item_date = "Invalid date.";
    }
    setErrors(newErrors);
    if (newErrors.isErrors) {
      return true;
    }

    return false;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const isValidationErrors = validate();
    if (isValidationErrors) return;

    try {
      const response = await fetch("/api/store_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const data = await response.json();
      setCreatedAt(data.createdAt);
      setCreatedBy(data.createdBy);
      setScoreDistribution(data.score_distribution);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-3/4 flex flex-col">
      <fieldset className="flex flex-col border border-[#b388ff] rounded-lg p-3 mb-2">
        <legend>Add Item</legend>
        <input type="number" hidden value={item.item_id} />
        <label htmlFor="item_name"></label>
        <input
          type="text"
          name="item_name"
          value={item.item_name}
          onChange={handleFormData}
          className="bg-[#2a2a3c] text-[#ededed] border border-[#b388ff] rounded-lg p-2"
        />
        <label htmlFor="item_date"></label>
        <input
          type="date"
          name="item_date"
          value={item.item_date}
          onChange={handleFormData}
          className="bg-[#2a2a3c] text-[#ededed] border border-[#b388ff] rounded-lg p-2"
        />
        <label htmlFor="item_order"></label>
        <input
          type="number"
          name="item_order"
          value={item.item_order}
          onChange={handleFormData}
          className="bg-[#2a2a3c] text-[#ededed] border border-[#b388ff] rounded-lg p-2"
        />
        <button type="submit">Submit</button>
      </fieldset>
    </form>
  );
}


import { Bar } from "react-chartjs-2";

export default function ScoreDistributionChart({ scoreDistribution }) {
  const countsArray = scoreDistribution.map((item) => {
    return item.count;
  });
  const highestCount = Math.max(...countsArray);

  const data = {
    labels: scoreDistribution.map((item) => {
      return `Score ${item.score}`;
    }),
    datasets: [
      {
        label: "Dataset",
        data: countsArray,
        backgroundColor: countsArray.map((item) => {
          return item === highestCount ? "#FF007F" : "#99004C";
        }),
      },
    ],
  };

  return <Bar data={data} />;
}
```
