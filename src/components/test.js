import React, { useState, useEffect, useRef } from "react"

const data = [
  { name: "Porsche", age: 2, color: "Blue" },
  { name: "BMW", age: 1, color: "Grey" },
  { name: "Renault", age: 2, color: "Yellow" },
  { name: "Volkswagen", age: 7, color: "Matte Red" },
  { name: "Porsche", age: 2, color: "Silver Grey" },
  { name: "Jaguar", age: 6, color: "Electric Blue" },
  { name: "Mistubishi", age: 4, color: "Black" },
  { name: "Toyota", age: 9, color: "Copper" },
  { name: "Honda", age: 12, color: "Biege" },
].map((d, id) => ({ ...d, id }))

const meta = [
  {
    key: "id",
    text: "ID",
    sort: true,
  },
  {
    key: "name",
    text: "Automobile Company",
    sort: true,
  },
  {
    key: "age",
    text: "Years Since Purchase",
    sort: true,
  },
  {
    key: "color",
    text: "Color",
    sort: true,
  },
]

// const pageSize = 5

function normalizeData(data) {
  return data.map(td => {
    const keys = Object.keys(td)
    return keys.map(key => ({ key, text: td[key] }))
  })
}

function AppAlternate() {
  const compare = {
    ">": (d1, d2) => d1 > d2,
    "<": (d1, d2) => d1 < d2,
  }

  function TableData({ data, meta }) {
    const headerOrder = meta.map(m => m.key)
    return (
      <tbody>
        {data.map(row => (
          <tr className="table-row">
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
      <thead className="table-row">
        {headers.map(d => (
          <TableCell data={d} />
        ))}
      </thead>
    )
  }
  function TableCell({ data }) {
    return (
      <td className="table-cell" onClick={data.sortFunc}>
        {data.text}
      </td>
    )
  }

  const [headerMeta, setHeaderMeta] = useState(meta)
  const [tableData, setTableData] = useState([])
  const [sortBy, setSortBy] = useState({ key: null, order: ">" })
  const [currentPage, setCurrentPage] = useState(0)

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
    setTableData(normalizeData(data), meta)
  }, [])

  useEffect(() => {
    // sort
    setTableData(
      normalizeData(
        data.sort((d1, d2) =>
          compare[sortBy.order](d1[sortBy.key], d2[sortBy.key])
        )
      )
    )
  }, [sortBy])

  //   useEffect(() => {
  //     // paginate
  //     const startPointer = currentPage * pageSize
  //     const endPointer = startPointer + pageSize
  //     setTableData(normalizeData(data.slice(startPointer, endPointer)))
  //   }, [sortBy, currentPage])

  return (
    <div className="container">
      <TableHeader headers={headerMeta} />
      <TableData data={tableData} meta={meta} />
    </div>
  )
}

export default AppAlternate
