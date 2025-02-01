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
          "rgba(255, 228, 196, 1)", // Bisque
          "rgba(255, 218, 185, 1)", // Peach Puff
          "rgba(255, 215, 0, 1)", // Gold
          "rgba(255, 182, 193, 1)", // Light Pink
          "rgba(255, 140, 0, 1)", // Dark Orange
          "rgba(255, 165, 0, 1)", // Orange
          "rgba(255, 99, 71, 1)", // Tomato
          "rgba(240, 128, 128, 1)", // Light Coral
          "rgba(34, 139, 34, 1)", // Forest Green
          "rgba(60, 179, 113, 1)", // Medium Sea Green
          "rgba(70, 130, 180, 1)", // Steel Blue
          "rgba(100, 149, 237, 1)", // Cornflower Blue
          "rgba(135, 206, 250, 1)", // Light Sky Blue
          "rgba(30, 144, 255, 1)", // Dodger Blue
          "rgba(0, 191, 255, 1)", // Deep Sky Blue
          "rgba(147, 112, 219, 1)", // Medium Purple
          "rgba(123, 104, 238, 1)", // Medium Slate Blue
          "rgba(240, 230, 140, 1)", // Khaki
          "rgba(240, 255, 240, 1)", // Honeydew
          "rgba(255, 245, 205, 1)", // Lemon Chiffon
          "rgba(255, 240, 245, 1)", // Lavender Blush
          "rgba(200, 200, 200, 1)", // Light Gray
        ],
        borderColor: ["gray"],
        borderWidth: 1,
      },
    ],
  };

  // State untuk menyimpan posisi legend
  const [legendPosition, setLegendPosition] = React.useState(
    window.innerWidth < 768 ? "bottom" : "right"
  );

  // Mengatur posisi legend berdasarkan ukuran layar
  React.useEffect(() => {
    const handleResize = () => {
      setLegendPosition(window.innerWidth < 768 ? "bottom" : "right");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Opsi untuk menempatkan legend di samping diagram
  const options = {
    plugins: {
      legend: {
        position: legendPosition, // Menggunakan state untuk posisi legend
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
    <Box w={"100%"} h={"80vh"}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default PolarChart;
