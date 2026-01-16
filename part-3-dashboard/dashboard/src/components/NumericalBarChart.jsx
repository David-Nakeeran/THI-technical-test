import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

export default function NumericalBarChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: "line",
            xMin: 5,
            xMax: 5,
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 1,
          },
        },
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: "Min Score",
        data: data.map((item) => {
          return Number(item.minScore);
        }),
        backgroundColor: "rgba(156, 163, 175, 0.6)",
      },
      {
        label: "Average Score",
        data: data.map((item) => {
          return Number(item.averageScore);
        }),
        backgroundColor: "rgba(243, 226, 53, 0.8)",
      },
      {
        label: "Max Score",
        data: data.map((item) => {
          return Number(item.maxScore);
        }),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
    ],
    labels: data.map((item) => {
      return item.question;
    }),
  };
  return (
    <section className="w-full h-96 flex justify-center mb-10">
      {data.length !== 0 ? <Bar data={chartData} options={options} /> : null}
    </section>
  );
}
