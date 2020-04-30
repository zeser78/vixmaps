import React, { useState, useEffect, useRef } from "react"
import { graph, useStaticQuery } from "gatsby"
import { Link } from "gatsby"
import Chart from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import data from "./vix.json"

// console.log(data)

const ChartData = () => {
  const [uvxyData, setUvxyData] = useState(0)
  const [vixData, setVixData] = useState(0)
  const [vxxData, setVxxData] = useState(0)
  const [delay, setDelay] = useState(5000)
  const [count, setCount] = useState(0)

  // Increment the counter.
  useInterval(() => {
    //   get data VIX
    fetch(`https://financialmodelingprep.com/api/v3/quote/^VIX,UVXY,VXX`)
      .then(response => response.json()) // parse JSON from request
      .then(resultData => {
        resultData.map(res => {
          if (res.symbol === "^VIX") {
            setVixData(res.price)
          } else if (res.symbol === "UVXY") {
            setUvxyData(res.price)
          } else {
            setVxxData(res.price)
          }
        })
      })
    let mam = Math.random()
    setCount(mam * 100)
  }, delay)

  function useInterval(callback, delay) {
    const savedCallback = useRef()

    useEffect(() => {
      savedCallback.current = callback
    })

    useEffect(() => {
      function tick() {
        savedCallback.current()
      }

      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }, [delay])
  }

  const chartRef = useRef()
  // canvas useEffect
  useEffect(() => {
    let canvas = chartRef.current
    let context = canvas.getContext("2d")
    let symbolStock = []
    let expiration = []
    let lastPrice = []
    let settlement = []
    data.map(res => {
      if (res.Last !== 0) {
        const { Symbol, Expiration, Last, Settlement } = res
        symbolStock.push(Symbol)
        expiration.push(Expiration)
        lastPrice.push(Last)
        settlement.push(Settlement)
      }
    })
    let initialValueVix = Array(10).fill(vixData)
    let initialValueUvxy = Array(10).fill(uvxyData)
    let initialValueVxx = Array(10).fill(vxxData)
    let myLineChart = new Chart(context, {
      type: "line",
      data: {
        labels: [...expiration],
        datasets: [
          {
            label: "Last",
            type: "line",
            data: [...lastPrice],
            borderColor: ["#b590ca"],
            fill: false,
            lineTension: 0,
            // backgroundColor: ["#79D1CF"],
          },
          {
            label: "Settlement",
            type: "line",
            data: [...settlement],
            borderColor: ["#a8d3da"],
            fill: false,
            lineTension: 0,
          },
          {
            label: "UVXY",
            type: "line",
            data: initialValueUvxy,
            borderColor: ["#f5cab3"],
            fill: false,
            // datalabels: {
            //   labels: {
            //     title: "UVXY",
            //   },
            // },
          },
          {
            label: "VIX",
            type: "line",
            data: initialValueVix,
            borderColor: ["#f57b51"],
            fill: false,
            // datalabels: {
            //   labels: {
            //     title: "UVXY",
            //   },
            // },
          },
          {
            label: "VXX",
            type: "line",
            data: initialValueVxx,
            borderColor: ["#481380"],
            fill: false,
            // datalabels: {
            //   labels: {
            //     title: "UVXY",
            //   },
            // },
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
        responsive: true,
        plugins: {
          datalabels: {
            color: "#36A2EB",
            align: "top",
            display: "auto",
          },
        },
        title: {
          display: true,
          text: "Chart VIX and UVXY",
        },
        legend: {
          display: true,
          labels: {
            fontColor: "#ffb2a7",
          },
          position: "top",
        },
      },
    })

    function updateChart() {
      let num = Array(12).fill(uvxyData)
      let num2 = Array(12).fill(vixData)
      let num3 = Array(12).fill(vxxData)
      console.log(num)
      myLineChart.data.datasets[2].data = [...num]
      myLineChart.data.datasets[3].data = [...num2]
      myLineChart.data.datasets[4].data = [...num3]
      //   myLineChart.options.scales.yAxes[0].scaleLabel.labelString =
      //     "My New Title"

      myLineChart.update(0)
    }
    updateChart()
  })

  return (
    <div
      style={{ display: `flex`, flexDirection: `column`, alignItems: `center` }}
    >
      <p s>
        VIX Index: {vixData} - UVXY: {uvxyData} - VXX: {vxxData}
        <small style={{ marginLeft: 10 }}>updated every 5 seconds</small>
      </p>
      <canvas ref={chartRef} style={{ width: "200px", height: "200px" }} />
      <p> Vix Futures updated : March 31st, 2020 - 6:00PM</p>
    </div>
  )
}
// Chart.plugins.unregister(ChartDataLabels)

export default ChartData
