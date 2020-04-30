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
  console.log(stock)
  const meta = [
    {
      key: "symbol",
      text: "Symbol",
      sort: true,
    },
    {
      key: "price",
      text: "Price",
      sort: true,
    },
    {
      key: "change",
      text: "Change %",
      sort: true,
    },
    {
      key: "earning",
      text: "Earning Day",
      sort: true,
    },
  ]

  function normalizeData(data) {
    return data.map(td => {
      const keys = Object.keys(td)
      return keys.map(key => ({ key, text: td[key] }))
    })
  }

  const compare = {
    ">": (d1, d2) => d1 > d2,
    "<": (d1, d2) => d1 < d2,
  }

  function TableData({ data, meta }) {
    const headerOrder = meta.map(m => m.key)
    return (
      <tbody>
        {data.map(row => (
          <tr>
            {row.map((_, i) => (
              <TableCell data={row.find(r => r.key === headerOrder[i])} />
            ))}
          </tr>
        ))}
      </tbody>
    )
  }
  function TableHeader({ headers }) {
    return (
      <thead>
        {headers.map(d => (
          <TableCell data={d} />
        ))}
      </thead>
    )
  }
  function TableCell({ data }) {
    return (
      <td
        className={
          data.text == new Date().toDateString() ? "background-red" : null
        }
        onClick={data.sortFunc}
      >
        {data.text}
      </td>
    )
  }
  // meta values comes to useState and xreate a sort when they are click
  const [headerMeta, setHeaderMeta] = useState(meta)
  const [tableData, setTableData] = useState([])
  const [sortBy, setSortBy] = useState({ key: null, order: ">" })

  useEffect(() => {
    function sortFunc(m) {
      setSortBy({ key: m.key, order: sortBy.order === ">" ? "<" : ">" })
    }

    setHeaderMeta(currentHeaderMeta =>
      currentHeaderMeta.map(m =>
        m.sort ? { ...m, sortFunc: () => sortFunc(m) } : m
      )
    )
  }, [sortBy])

  useEffect(() => {
    // normalize data
    setTableData(normalizeData(stock), meta)
  }, [])

  useEffect(() => {
    // sort
    setTableData(
      normalizeData(
        stock.sort((d1, d2) =>
          compare[sortBy.order](d1[sortBy.key], d2[sortBy.key])
        )
      )
    )
  }, [sortBy])

  return (
    <>
      <h2>Stocks Table</h2>
      <div>
        <TableHeader headers={headerMeta} />
        <TableData data={tableData} meta={meta} />
      </div>
      {/* <table style={{ width: `80%` }}>
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
      </table> */}
    </>
  )
}

export default EarningsTable
