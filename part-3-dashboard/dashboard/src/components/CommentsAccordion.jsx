"use client";

export default function CommentsAccordion({
  commentsData,
  onToggle,
  openIndexes,
}) {
  const questionsAndCommentsElements = commentsData.map((item, index) => {
    return (
      <div
        key={index}
        className="mb-4 border border-gray-300 rounded-lg shadow-sm p-3"
      >
        <button
          className="w-full text-left font-semibold text-gray-900 hover:text-yellow-500 focus:outline-none"
          onClick={() => onToggle(index)}
        >
          Question Topic: {item.question}
        </button>
        {openIndexes.includes(index) &&
          item.comments.map((comment, commentIndex) => {
            return (
              <div key={commentIndex} className="mt-2 ml-4 space-y-1">
                <p className="text-gray-700 bg-yellow-50 px-2 py-1 rounded">
                  {comment}
                </p>
              </div>
            );
          })}
      </div>
    );
  });

  return (
    <section>
      {commentsData.length !== 0 ? (
        <div>
          <h2 className="text-center text-xl font-semibold mb-2">
            Survey Comment Results
          </h2>
          {questionsAndCommentsElements}
        </div>
      ) : null}
    </section>
  );
}
