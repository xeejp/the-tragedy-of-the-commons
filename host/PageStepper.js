import React, { Component } from 'react'
import { connect } from 'react-redux'

import { changePage } from './actions'

import { Step, Stepper, StepButton} from 'material-ui/Stepper'
import RaisedButton from 'material-ui/RaisedButton'

const pages = ["waiting", "description", "experiment", "result"]
const page_name = {"waiting": "待機", "description": "説明", "experiment": "実験", "result": "結果"}

const actionCreators = {
  changePage,
}
const mapStateToProps = ({ page }) => ({
  page,
})

class PageStepper extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  nextPage() {
    const { page } = this.props
    switch (page) {
      case "waiting":
        this.changePage("description")
        break
      case "description":
        this.changePage("experiment")
        break
      case "experiment":
        this.changePage("result")
        break
      case "result":
        this.changePage("waiting")
        break
    }
  }

  backPage() {
    const { page } = this.props
    switch (page) {
      case "waiting":
        this.changePage("result")
        break
      case "description":
        this.changePage("waiting")
        break
      case "experiment":
        this.changePage("description")
        break
      case "result":
        this.changePage("experiment")
        break
    }
  }

  changePage(page) {
    this.props.changePage(page)
  }

  render() {
    const { page } = this.props
    const steps = []
    for (let i = 0; i < pages.length; i++) {
      steps[i] = (
        <Step key={i}>
          <StepButton onTouchTap={this.changePage.bind(this, pages[i])}>
            {page_name[pages[i]]}
          </StepButton>
        </Step>
      )
    }
    return (
      <div style={{marginBottom: "5%"}}>
        <Stepper activeStep={pages.indexOf(page)} linear={false}>
          {steps}
        </Stepper>
        <div>
          <RaisedButton
            label="戻る"
            style={{float: "left"}}
            onClick={this.backPage.bind(this)}
          />
          <RaisedButton
            label="次へ"
            style={{float: "right"}}
            primary={true}
            onClick={this.nextPage.bind(this)}
          />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, actionCreators)(PageStepper)