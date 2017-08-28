import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import AppBar from 'material-ui/AppBar'
import AutoComplete from 'material-ui/AutoComplete'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'
import List from 'material-ui/svg-icons/action/list'
import IconButton from 'material-ui/IconButton'
import Snackbar from 'material-ui/Snackbar'
import styles from './index.scss'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

const muiTheme = getMuiTheme({
	palette: {primary1Color: '#000080'},
	textField: {textColor: '#000080'}

})

class MaterialUIExComponent extends React.Component {


	handleUpdateInput = (searchPick) => {
		this.setState({selectedCountry: searchPick})
	}
	handleSelectedCountry = (searchPick) => {
		let country = this.state.countries.find(u => u.name === searchPick)
		fetch('http://127.0.0.1:5150/alerts/' + country.code)
			.then(response => {
					if (response.ok) {
						return Promise.resolve(response.json())
					} else {
						return Promise.reject(new Error(response.statusText))
					}
				}
			)
			.then(json => {
				console.log(json)
				this.setState({selected_alert: json.alert})
			})
			.catch(function (error) {
				this.setState({gotDataMsg: 'Problem loading alert'})
				this.setState({gotData: true})
			})
	}
	handleRequestClose = () => {
		this.setState({gotData: false});
	}
	fetchCountries = () => {
		this.state.selectedName = ''
		this.state.selected_alert = ''
		fetch('http://127.0.0.1:5150/countries/')
			.then(response => {
					if (response.ok) {
						return Promise.resolve(response.json())
					} else {
						return Promise.reject(new Error(response.statusText))
					}
				}
			)
			.then(json => {
				console.log(json)
				this.state.countries = json
				this.state.country_names = []
				this.state.countries.forEach(country => {
					this.state.country_names.push(country.name)
				})
				this.setState({gotDataMsg: this.state.countries.length + ' countries loaded'})
				this.setState({gotData: true})
			})
			.catch(function (error) {
				this.setState({gotDataMsg: 'Problem loading server data'})
				this.setState({gotData: true})
			})
	}
	UpdateCountryData = () => {
		fetch('http://127.0.0.1:5150/countries/refresh/all')
			.then(response => {
					if (response.ok) {
						return Promise.resolve(response.json())
					} else {
						return Promise.reject(new Error(response.statusText))
					}
				}
			)
			.then(json => {
				console.log(json)
				this.setState({gotDataMsg: json.count + ' countries refreshed'})
				this.setState({gotData: true})
				this.UpdateAlertData()
			})
			.catch(function (error) {
				this.setState({gotDataMsg: 'Problem refreshing countries'})
				this.setState({gotData: true})
			})
	}
	UpdateAlertData = () => {
		fetch('http://127.0.0.1:5150/alerts/refresh/all')
			.then(response => {
					if (response.ok) {
						return Promise.resolve(response.json())
					} else {
						return Promise.reject(new Error(response.statusText))
					}
				}
			)
			.then(json => {
				console.log(json)
				this.setState({gotDataMsg: json.count + ' alerts refreshed'})
				this.setState({gotData: true})
			})
			.catch(function (error) {
				this.setState({gotDataMsg: 'Problem refreshing alerts'})
				this.setState({gotData: true})
			})
	}
	UpdateData = () => {
			this.UpdateCountryData()
	}
	constructor() {
		super()
		this.state = {
			countries: [],
			country_names: [],
			selectedCountry: '',
			selected_alert: '',
			gotData: false,
			gotDataMsg: ''
		}


		this.fetchCountries()
	}
	render() {
		return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<Card style={{marginTop: '10%', marginLeft: '10%', width: '80%'}}>
					<AppBar title="Travel Alerts"
									iconElementLeft={<IconMenu
										iconButtonElement={<IconButton>
											<List color="white"/>
										</IconButton>}>
										<MenuItem primaryText="Get Updates"
															onClick={this.UpdateData}/>
									</IconMenu>}>
					</AppBar>
					<CardHeader style={{textAlign: 'center'}}>
						<div>
							<img src="globe.png" width="100" height="100"/>
						</div>
						<div className={styles.blueTitle}>
							World Wide Travel Alerts
						</div>
					</CardHeader>
					<CardText style={{textAlign: 'center'}}>
						<AutoComplete
							floatingLabelText="Enter Country Name"
							filter={AutoComplete.caseInsensitiveFilter}
							onUpdateInput={this.handleUpdateInput}
							dataSource={this.state.country_names}
							onNewRequest={this.handleSelectedCountry}
						/>
						{this.state.selected_alert.length > 0 &&
						<p className={styles.alertText}>
							{this.state.selected_alert}
						</p>
						}
					</CardText>
					<Snackbar
						open={this.state.gotData}
						message={this.state.gotDataMsg}
						autoHideDuration={2000}
						onRequestClose={this.handleRequestClose}
					/>
				</Card>
			</MuiThemeProvider>
		)
	}
}
export default MaterialUIExComponent
