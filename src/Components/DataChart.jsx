import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, Text } from "@chakra-ui/react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Mendaftarkan skala dan elemen yang diperlukan
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DataChart = ({ dataStatistik }) => {
  // Menyiapkan data untuk chart
  const combinedData = {
    labels: dataStatistik.map((item) => `Bulan ${item.month}`),
    datasets: [
      {
        label: "Pengeluaran",
        data: dataStatistik.map((item) => item.totalPermintaan.pengeluaran),
        backgroundColor: "rgba(23, 163, 221, 1)",
        hoverBackgroundColor: "rgb(46, 80, 119)",
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: (value) => value,
        },
      },
      {
        label: "Penerimaan",
        data: dataStatistik.map((item) => item.totalPermintaan.penerimaan),
        backgroundColor: "rgba(20, 167, 91, 1)",
        hoverBackgroundColor: "rgba(10, 107, 67, 1)",
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: (value) => value,
        },
      },

      {
        label: "EXP",
        data: dataStatistik.map((item) => item.totalPermintaan.exp),
        backgroundColor: "rgba(198, 46, 46, 1)",
        hoverBackgroundColor: "rgba(143, 3, 17, 1)",
        datalabels: {
          anchor: "end",
          align: "end",
          formatter: (value) => value,
        },
      },
    ],
  };

  return (
    <Box mb={"40px"}>
      <Bar
        data={combinedData}
        options={{ plugins: { datalabels: { display: true } } }}
      />
    </Box>
  );
};

export default DataChart;
