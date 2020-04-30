import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

import SEO from "../components/seo"
import ChartData from "../components/chart"
import EarningsTable from "../components/earningsTable"
import AppAlternate from "../components/test"
import EnhancedTable from "../components/testMaterial"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <ChartData />
    <EarningsTable />
    <EnhancedTable />
  </Layout>
)

export default IndexPage
