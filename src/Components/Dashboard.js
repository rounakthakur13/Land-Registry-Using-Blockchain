import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { Button, Container, CircularProgress } from '@material-ui/core'
import Land from '../abis/LandRegistry.json'
import ipfs from '../ipfs'
import Table from '../Containers/Owner_Table'
import AvailableTable from '../Containers/Buyer_Table'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import PropTypes from 'prop-types'
// import SwipeableViews from 'react-swipeable-views'
import RegistrationForm from '../Containers/RegistrationForm'
import { Buffer } from 'buffer';



window.Buffer = Buffer;
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const styles = (theme) => ({
  container: {
    '& .MuiContainer-maxWidthLg': {
      maxWidth: '100%',
    },
  },
  root: {
    backgroundColor: '#fff',
    // width: 500,
    borderRadius: '5px',
    minHeight: '80vh',
  },
})

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      assetList: [],
      assetList1: [],
      isLoading: true,
      value: 0,
    }
  }
  componentDidMount = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    await window.localStorage.setItem('web3account', accounts[0])
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const LandData = Land.networks[networkId]
    if (LandData) {
      const landList = new web3.eth.Contract(Land.abi, LandData.address)
      this.setState({ landList })
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    if (
      !window.localStorage.getItem('authenticated') ||
      window.localStorage.getItem('authenticated') === 'false'
    )
      this.props.history.push('/login')
    // const category=window.localStorage.getItem('category');
    this.setState({ isLoading: false })
    this.getDetails()
    this.getDetails1()
  }

  async propertyDetails(property) {
    let details = await this.state.landList.methods
      .landInfoOwner(property)
      .call()

    const decoder = new TextDecoder();
    const stream = await ipfs.cat(details[1]);
    console.log(stream);
    let rawData = '';
    for await (const chunk of stream) {
      rawData += decoder.decode(chunk, { stream: true })
    }
    const obj = JSON.parse(rawData)
    
    try {
      const obj = JSON.parse(rawData)
      console.log(obj);

      // setting up the assetList
      this.state.assetList.push({
        property: property,
        uniqueID: details[1],
        name: obj.name,
        key: details[0],
        email: obj.email,
        contact: obj.contact,
        pan: obj.pan,
        occupation: obj.occupation,
        oaddress: obj.address,
        ostate: obj.state,
        ocity: obj.city,
        opostalCode: obj.postalCode,
        laddress: obj.laddress,
        lstate: obj.lstate,
        lcity: obj.lcity,
        lpostalCode: obj.lpostalCode,
        larea: obj.larea,
        lamount: details[2],
        isGovtApproved: details[3],
        isAvailable: details[4],
        requester: details[5],
        requestStatus: details[6],
        document: obj.document,
        images: obj.images,
      })
      this.setState({ assetList: [...this.state.assetList] })
    } catch (e) {
      console.error(e)
    }
  }

  async propertyDetails1(property) {
    let details = await this.state.landList.methods
      .landInfoOwner(property)
      .call()
      const decoder = new TextDecoder();
      const stream = await ipfs.cat(details[1]);
      console.log(stream);
      let rawData = '';
      for await (const chunk of stream) {
        rawData += decoder.decode(chunk, { stream: true })
      }
      const obj = JSON.parse(rawData)
      
      try {
        const obj = JSON.parse(rawData)
        console.log(obj);
  
        // setting up the assetList
        this.state.assetList1.push({
          property: property,
          uniqueID: details[1],
          name: obj.name,
          key: details[0],
          email: obj.email,
          contact: obj.contact,
          pan: obj.pan,
          occupation: obj.occupation,
          oaddress: obj.address,
          ostate: obj.state,
          ocity: obj.city,
          opostalCode: obj.postalCode,
          laddress: obj.laddress,
          lstate: obj.lstate,
          lcity: obj.lcity,
          lpostalCode: obj.lpostalCode,
          larea: obj.larea,
          lamount: details[2],
          isGovtApproved: details[3],
          isAvailable: details[4],
          requester: details[5],
          requestStatus: details[6],
          document: obj.document,
          images: obj.images,
        })
        this.setState({ assetList1: [...this.state.assetList1] })
      } catch (e) {
        console.error(e)
      }
  }

  async getDetails() {
    const properties = await this.state.landList.methods
      .viewAssets()
      .call({ from: this.state.account })
    console.log(properties)
    for (let item of properties) {
      console.log("Item" + item)
      this.propertyDetails(item)
    }
  }
  async getDetails1() {
    const properties = await this.state.landList.methods.Assets().call()
    console.log(properties)

    for (let item of properties) {
      console.log("Item" + item)
      this.propertyDetails1(item)
    }
  }
  handleChange = (event, newValue) => {
    this.setState({ value: newValue })
  }
  handleChangeIndex = (index) => {
    this.setState({ index })
  }
  render() {
    const { classes } = this.props
    return this.state.isLoading ? (
      <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <CircularProgress />
      </div>
    ) : (
      <div className="profile-bg ">
        <div className={classes.container}>
          <Container style={{ marginTop: '40px' }}>
            <div className={classes.root}>
              <AppBar position="static" color="default" className="dashboard">
                <Tabs
                  value={this.state.value}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                >
                  <Tab label="My Properties" {...a11yProps(0)} />
                  <Tab label="Available Properties" {...a11yProps(1)} />
                  <Tab label="Regsiter Land" {...a11yProps(2)} />
                </Tabs>
              </AppBar>
              {/* <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      > */}
              <TabPanel value={this.state.value} index={0}>
                <div style={{ marginTop: '60px' }}>
                  {/* <h2 style={{ textAlign: 'center' }}>My Properties</h2> */}
                  <Table assetList={this.state.assetList} />
                </div>
              </TabPanel>
              <TabPanel value={this.state.value} index={1}>
                <div style={{ marginTop: '60px' }}>
                  {/* <h2 style={{ textAlign: 'center' }}>Available Properties</h2> */}
                  <AvailableTable assetList={this.state.assetList1} />
                </div>
              </TabPanel>
              <TabPanel value={this.state.value} index={2}>
                <RegistrationForm />
              </TabPanel>

              {/* </SwipeableViews> */}
              {/* <Button
              style={{ marginTop: '30px' }}
              variant="contained"
              color="primary"
              onClick={() => this.props.history.push('/registration_form')}
            >
              Register Land
            </Button> */}
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
export default withStyles(styles)(Dashboard)
