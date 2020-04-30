import React, { useState, useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import axios from "axios"
import { stockList } from "../data/data"

const EarningsTable = () => {
  const [stock, setStockList] = useState([])
  const [alert, setAlert] = useState("")
  let data
  useEffect(() => {
    return stockList.map(stock => {
      axios
        .get(`https://financialmodelingprep.com/api/v3/quote/${stock}`)
        .then(resp => {
          console.log(resp)

          data = resp.data[0]
          if (data === undefined) {
            setStockList(
              prevData => [
                ...prevData,
                {
                  symbol: stock,
                  price: "null",
                  change: null,
                  earning: null,
                },
              ]
              // console.log(data.symbol)
            )
          } else {
            console.log("defined")
            let dateFormat

            if (new Date(data.earningsAnnouncement).getFullYear() < 2020) {
              dateFormat = "n/d"
            } else {
              dateFormat = new Date(data.earningsAnnouncement).toDateString()
            }
            setStockList(prevData => [
              ...prevData,
              {
                symbol: data.symbol,
                price: data.price,
                change: data.changesPercentage,
                earning: dateFormat,
              },
            ])
          }
        })
    })
  }, [])

  const [sortedField, setSortedField] = useState(null)
  let sortedProducts = [...stock]
  if (sortedField !== null) {
    sortedProducts.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return -1
      }
      if (a[sortedField] > b[sortedField]) {
        return 1
      }
      return 0
    })
  }
  return (
    <>
      <h2>Stocks Table</h2>
      <table style={{ width: `80%` }}>
        <tr>
          {/* <td>
            {" "}
            <button type="button" onClick={() => setSortedField("symbol")}>
              Item
            </button>
          </td> */}
          <td onClick={() => setSortedField("symbol")}>Symbol</td>
          <td onClick={() => setSortedField("price")}>Price</td>
          <td onClick={() => setSortedField("change")}>Change %</td>
          <td onClick={() => setSortedField("earning")}>Earning Day</td>
        </tr>
        {sortedProducts.map((data, index) => (
          <tr key={index}>
            <td> {data.symbol}</td> <td>${data.price}</td>
            <td>{data.change}%</td>
            <td
              className={
                data.earning == new Date().toDateString()
                  ? "background-red"
                  : null
              }
            >
              {data.earning}
            </td>
          </tr>
        ))}
      </table>
    </>
  )
}

export default EarningsTable
