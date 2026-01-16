export default function NumericalTable({ tableNumericalData, activeParent }) {
  const tableElements = tableNumericalData.map((item, index) => {
    return (
      <tr key={index} className="hover:bg-yellow-100">
        <td className="px-4 py-2">{item.question}</td>
        <td className="px-4 py-2 text-center">{item.averageScore}</td>
        <td className="px-4 py-2 text-center">{item.minScore}</td>
        <td className="px-4 py-2 text-center">{item.maxScore}</td>
        <td className="px-4 py-2 text-center">{item.count}</td>
      </tr>
    );
  });

  return (
    <div className="mb-10">
      {tableNumericalData.length !== 0 ? (
        <>
          <h1 className="text-center text-xl font-semibold mb-2">
            Survey Scores by Question
          </h1>
          <table className="border-collapse w-full text-left">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-gray-800 font-semibold">
                  Question
                </th>
                <th className="px-4 py-2 text-gray-800 font-semibold text-center">
                  Average Score
                </th>
                <th className="px-4 py-2 text-gray-800 font-semibold text-center">
                  Min Score
                </th>
                <th className="px-4 py-2 text-gray-800 font-semibold text-center">
                  Max Score
                </th>
                <th className="px-4 py-2 text-gray-800 font-semibold text-center">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>{tableElements}</tbody>
          </table>
        </>
      ) : (
        <p className="text-gray-500 text-center text-lg italic py-4">
          {activeParent
            ? "No results match the selected filters."
            : "Select a question topic to view survey results."}
        </p>
      )}
    </div>
  );
}
