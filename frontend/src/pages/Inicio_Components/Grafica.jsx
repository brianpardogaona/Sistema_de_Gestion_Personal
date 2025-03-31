import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

import "../../styles/chart.css";

function Grafica() {
  const [activeTab, setActiveTab] = useState("bar");
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [],
  });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const doughnutCharts = useRef({});
  const [goalData, setGoalData] = useState([]);
  const [generalData, setGeneralData] = useState({
    completed: 0,
    notCompleted: 0,
  });

  useEffect(() => {
    const fetchCompletedGoals = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/objective/completed-per-month",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const labels = Object.keys(data).map((key) => {
          const [year, month] = key.split("-");
          return new Date(year, month - 1).toLocaleString("es-ES", {
            month: "long",
          });
        });

        const values = Object.values(data);

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Objetivos completados por mes",
              data: values,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderColor: "rgb(0, 0, 0)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchCompletedGoals();
  }, []);

  useEffect(() => {
    const fetchGeneralCompletion = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/objective/general-completion",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setGeneralData(data);
      } catch (error) {
        console.error("Error obteniendo los objetivos generales:", error);
      }
    };

    fetchGeneralCompletion();
  }, []);

  const generalChartData = {
    labels: ["OBJETIVOS PENDIENTES", "OBJETIVOS COMPLETADOS"],
    datasets: [
      {
        label: "Objetivos generales",
        data: [generalData.notCompleted, generalData.completed],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/goal/user/goals-completion",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setGoalData(data);
      } catch (error) {
        console.error("Error obteniendo los objetivos:", error);
      }
    };

    fetchGoals();
  }, []);

  useEffect(() => {
    if (activeTab !== "select" && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
  
      const ctx = chartRef.current.getContext("2d");
  
      const maxValue =
        barChartData.datasets.length > 0
          ? Math.max(...barChartData.datasets[0].data, 0)
          : 0;
      const yMax = maxValue < 5 ? 5 : maxValue + 1;
  
      chartInstance.current = new Chart(ctx, {
        type: activeTab === "bar" ? "bar" : "doughnut",
        data: activeTab === "bar" ? barChartData : generalChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: activeTab === "bar"
            ? {
                y: {
                  beginAtZero: true,
                  max: yMax,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                },
              }
            : {},
        },
      });
    }
  
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [activeTab, barChartData, generalChartData]);
  
  

  useEffect(() => {
    selectedCharts.forEach((goalId, index) => {
      const goal = goalData.find((g) => g.id === goalId);
      if (!goal) return;

      const canvas = document.getElementById(`chart-${index}`);
      if (canvas) {
        if (doughnutCharts.current[index]) {
          doughnutCharts.current[index].destroy();
        }
        const ctx = canvas.getContext("2d");
        doughnutCharts.current[index] = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["COMPLETADOS", "PENDIENTES"],
            datasets: [
              {
                label: goal.title,
                data: [goal.completed, goal.notCompleted],
                backgroundColor: [
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                ],
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
  }, [selectedCharts, goalData]);

  useEffect(() => {
    if (activeTab === "select" && selectedCharts.length > 0) {
      setSelectedCharts([...selectedCharts]);
    }
  }, [activeTab]);

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
    <div
      className="chart-container"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div className="chart-tabs" style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("bar")}
          className={activeTab === "bar" ? "active" : ""}
        >
          Objetivos por mes
        </button>
        <button
          onClick={() => setActiveTab("doughnut")}
          className={activeTab === "doughnut" ? "active" : ""}
        >
          Objetivos generales
        </button>
        <button
          onClick={() => setActiveTab("select")}
          className={activeTab === "select" ? "active" : ""}
        >
          Objetivos por meta
        </button>
      </div>

      {activeTab === "select" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div>
            {goalData.map((goal) => (
              <label
                key={goal.id}
                style={{ marginRight: "50px", fontWeight: "bold" }}
              >
                <input
                  type="checkbox"
                  checked={selectedCharts.includes(goal.id)}
                  onChange={() => toggleChart(goal.id)}
                  disabled={
                    !selectedCharts.includes(goal.id) &&
                    selectedCharts.length >= 4
                  }
                />
                {"  " + goal.title}
              </label>
            ))}
          </div>

          {selectedCharts.length > 0 && (
            <div
              className="chart-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                marginBottom: "60px",
              }}
            >
              {selectedCharts.map((goalId, index) => {
                const goal = goalData.find((g) => g.id === goalId);
                return (
                  <div
                    key={index}
                    style={{
                      width: "300px",
                      height: "250px",
                      textAlign: "center",
                      marginTop: "30px",
                    }}
                  >
                    <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                      {goal.title}
                    </p>
                    <canvas id={`chart-${index}`} />
                  </div>
                );
              })}
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
