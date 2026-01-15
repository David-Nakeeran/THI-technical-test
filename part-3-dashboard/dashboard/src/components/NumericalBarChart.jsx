import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function NumericalBarChart({ data }) {
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const chartData = {
    datasets: [
      {
        label: "Average Score",
        data: data.map((item) => {
          return Number(item.averageScore);
        }),
        backgroundColor: "rgba(243, 226, 53, 0.7)",
        borderColor: "rgba(43, 41, 53, 1)",
        borderWidth: 1,
      },
    ],
    labels: data.map((item) => {
      return item.question;
    }),
  };
  return (
    <section className="w-full">
      {data.length !== 0 ? <Bar data={chartData} options={options} /> : null}
    </section>
  );
}
