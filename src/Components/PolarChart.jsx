import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Box, Text } from "@chakra-ui/react";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Mendaftarkan elemen yang diperlukan
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PolarChart = ({ dataStatistik }) => {
  // Menyiapkan data untuk chart
  const chartData = {
    labels: dataStatistik.map((item) => item.uptdNama),
    datasets: [
      {
        label: "Total Permintaan",
        data: dataStatistik.map((item) => item.totalPermintaan),
        backgroundColor: [
          "rgba(19, 167, 97, 1)",
          "rgba(21, 167, 132, 1)",
          "rgba(20, 166, 180, 1)",
          "rgba(19, 165, 208, 1)",
          "rgba(125, 174, 186, 1)",

          // "rgba(166, 181, 159, 1)",
          "rgba(200, 185, 125, 1)",
          "rgba(248, 191, 51, 1)",

          "rgba(197, 187, 67, 1)",
          "rgba(155, 181, 77, 1)",
          "rgba(95, 173, 86, 1)",
          // Tambahkan warna lain sesuai kebutuhan
        ],
        borderColor: [
          "white",

          // Tambahkan warna lain sesuai kebutuhan
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opsi untuk menempatkan legend di samping diagram
  const options = {
    plugins: {
      legend: {
        position: "right", // Mengatur posisi legend di sebelah kanan
        labels: {
          color: "black",
          font: {
            size: 20, // Mengatur ukuran font legend
          },
        },
      },
      datalabels: {
        color: "black",
        font: {
          size: 16,
        },
        formatter: (value) => value,
      },
    },
  };

  return (
    <Box w={"800px"}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default PolarChart;
