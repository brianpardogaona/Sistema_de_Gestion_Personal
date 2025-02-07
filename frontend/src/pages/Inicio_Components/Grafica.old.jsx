import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

function Grafica() {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Crear el gráfico dentro del div referenciado
    const chart = createChart(chartContainerRef.current, {
      width: 600, // Ajusta según sea necesario
      height: 300,
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
    });

    // Crear una serie de área
    const areaSeries = chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });

    // Datos de la gráfica
    const data = [
      { time: 1642425322, value: 0 },
      { time: 1642511722, value: 8 },
      { time: 1642598122, value: 10 },
      { time: 1642684522, value: 20 },
      { time: 1642770922, value: 3 },
      { time: 1642857322, value: 43 },
      { time: 1642943722, value: 41 },
      { time: 1643030122, value: 43 },
      { time: 1643116522, value: 56 },
      { time: 1643202922, value: 46 },
    ];

    areaSeries.setData(data);

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div>
      <h1>Gráfica</h1>
      <div ref={chartContainerRef} />
    </div>
  );
}

export default Grafica;
