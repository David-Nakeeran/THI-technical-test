import Dashboard from "@/components/Dashboard";
import data from "@/data/data.json";
export default function Home() {
  const parentQuestions = data.reduce((acc, currentValue) => {
    if (
      !acc.includes(currentValue.parent_question) &&
      currentValue.parent_question != ""
    ) {
      acc.push(currentValue.parent_question);
    }
    return acc;
  }, []);

  const deptArray = data.reduce((acc, currentValue) => {
    if (!acc.includes(currentValue.Dept) && currentValue.Dept != "") {
      acc.push(currentValue.Dept);
    }
    return acc;
  }, []);

  const locationArray = data.reduce((acc, currentValue) => {
    if (!acc.includes(currentValue.Location) && currentValue.Location != "") {
      acc.push(currentValue.Location);
    }
    return acc;
  }, []);

  return (
    <main className="h-dvh flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">THI Technical Test - Part 3</h1>
      <p className="text-gray-700 mb-6">
        Dashboard showing survey results for numerical scores and comments. Use
        the filters below to view results by question topic, department, or
        location.
      </p>
      <Dashboard
        parentQuestions={parentQuestions}
        deptArray={deptArray}
        locationArray={locationArray}
      />
    </main>
  );
}
