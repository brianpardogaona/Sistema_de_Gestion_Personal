import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

import "../../styles/chart.css";

function Grafica() {
  const [activeTab, setActiveTab] = useState("bar");
  const [selectedCharts, setSelectedCharts] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const doughnutCharts = useRef({});

  const barChartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
    datasets: [
      {
        label: "Objetivos por mes",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  };

  const generalChartData = {
    labels: ["Objetivos sin completar","Objetivos completados"],
    datasets: [
      {
        label: "Objetivos generales",
        data: [120, 150],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: "rgb(255, 159, 64)",
        borderWidth: 1,
      },
    ],
  };

  const doughnutDataSets = {
    Ventas: [30, 70],
    Clientes: [50, 50],
    Ingresos: [80, 20],
    Gastos: [40, 60],
    Beneficios: [60, 40],
    Pérdidas: [45, 55],
    Costos: [70, 30],
  };

  const additionalCharts = Object.keys(doughnutDataSets);

  useEffect(() => {
    if (activeTab !== "select" && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: activeTab,
        data: activeTab === "bar" ? barChartData : generalChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activeTab]);

  useEffect(() => {
    selectedCharts.forEach((chart, index) => {
      const canvas = document.getElementById(`chart-${index}`);
      if (canvas) {
        if (doughnutCharts.current[index]) {
          doughnutCharts.current[index].destroy();
        }
        const ctx = canvas.getContext("2d");
        doughnutCharts.current[index] = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Completados", "Pendientes"],
            datasets: [
              {
                label: chart,
                data: doughnutDataSets[chart],
                backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(54, 162, 235)", "rgb(255, 99, 132)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    });

    return () => {
      selectedCharts.forEach((_, index) => {
        if (doughnutCharts.current[index]) {
          doughnutCharts.current[index].destroy();
        }
      });
    };
  }, [selectedCharts]);

  const toggleChart = (chart) => {
    setSelectedCharts((prev) => {
      if (prev.includes(chart)) {
        return prev.filter((c) => c !== chart);
      } else if (prev.length < 4) {
        return [...prev, chart];
      }
      return prev;
    });
  };

  return (
    <div className="chart-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="chart-tabs" style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("bar")} className={activeTab === "bar" ? "active" : ""}>Objetivos por mes</button>
        <button onClick={() => setActiveTab("doughnut")} className={activeTab === "doughnut" ? "active" : ""}>Objetivos generales</button>
        <button onClick={() => setActiveTab("select")} className={activeTab === "select" ? "active" : ""}>Seleccionar Gráficas</button>
      </div>

      {activeTab === "select" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div>
            {additionalCharts.map((chart) => (
              <label key={chart} style={{ marginRight: "10px" }}>
                <input
                  type="checkbox"
                  checked={selectedCharts.includes(chart)}
                  onChange={() => toggleChart(chart)}
                  disabled={!selectedCharts.includes(chart) && selectedCharts.length >= 4}
                />
                {chart}
              </label>
            ))}
          </div>
          {selectedCharts.length > 0 && (
            <div className="chart-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginTop: "20px" }}>
              {selectedCharts.map((chart, index) => (
                <div key={index} style={{ width: "300px", height: "300px", textAlign: "center" }}>
                  <p><strong>{chart}</strong></p>
                  <canvas id={`chart-${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="chart-space" style={{ width: "50%", height: "400px" }}>
          <canvas ref={chartRef}></canvas>
        </div>
      )}
    </div>
  );
}

export default Grafica;
