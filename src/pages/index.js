import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"

import SEO from "../components/seo"
import ChartData from "../components/chart"
import EarningsTable from "../components/earningsTable"
import AppAlternate from "../components/test"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <ChartData />
    <EarningsTable />
    <AppAlternate />
  </Layout>
)

export default IndexPage
