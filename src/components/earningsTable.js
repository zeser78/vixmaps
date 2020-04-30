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
          // console.log(resp.data[0].earningsAnnouncement)
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
            let dateFormat = new Date(data.earningsAnnouncement).toDateString()
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

  return (
    <>
      <h2>Stocks Table</h2>

      <table style={{ width: `80%` }}>
        <tr>
          <td>Item</td>
          <td>Symbol</td>
          <td>Price</td>
          <td>Change %</td>
          <td>Earning Day</td>
        </tr>
        {stock.map((data, index) => (
          <tr key={index}>
            <td>{index + 1}</td> <td> {data.symbol}</td> <td>{data.price}</td>
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
