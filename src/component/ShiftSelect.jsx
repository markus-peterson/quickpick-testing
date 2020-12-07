import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {Scheduler,
		Toolbar,
		WeekView,
		DateNavigator,
		Appointments,
		AppointmentTooltip,
		AppointmentForm,
		EditRecurrenceMenu,
} from '@devexpress/dx-react-scheduler-material-ui';
import {ListItem, List, Grid, MenuItem, ListItemText, ListItemIcon, FormControl, InputLabel, Select} from '@material-ui/core';
import {DateRange as HourglassEmptyIcon,
		EventAvailable as CheckCircleOutlineIcon,
		EventBusy as NotInterestedIcon,
		AccessTime as AccessTimeIcon,
	} from '@material-ui/icons';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { green, red, orange, blue } from '@material-ui/core/colors';
import { connectProps } from '@devexpress/dx-react-core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import Typography from '@material-ui/core/Typography';
import Close from '@material-ui/icons/Close';
import CalendarToday from '@material-ui/icons/CalendarToday';
import Create from '@material-ui/icons/Create';

import LoadingComponent from './LoadingComponent';
import UserService from '../api/UserService';
import ShiftService from '../api/ShiftService';
import ApplicationService from '../api/ApplicationService';
import JobService from '../api/JobService';
import ErrorMessage from './ErrorMessage';
import AuthenticationService from '../api/AuthenticationService';

export const appointments = [];

const containerStyles = theme => ({
	container: {
		width: theme.spacing(68),
		padding: 0,
		paddingBottom: theme.spacing(2),
	},
	content: {
		padding: theme.spacing(2),
		paddingTop: 0,
	},
	header: {
		overflow: 'hidden',
		paddingTop: theme.spacing(0.5),
	},
	closeButton: {
		float: 'right',
	},
	buttonGroup: {
		display: 'flex',
		justifyContent: 'flex-end',
		padding: theme.spacing(0, 2),
	},
	button: {
		marginLeft: theme.spacing(2),
	},
	picker: {
		marginRight: theme.spacing(2),
		'&:last-child': {
		marginRight: 0,
		},
		width: '50%',
	},
	wrapper: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: theme.spacing(1, 0),
	},
	icon: {
		margin: theme.spacing(2, 0),
		marginRight: theme.spacing(2),
	},
	textField: {
		width: '100%',
	},
});

class AppointmentFormContainerBasic extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
		appointmentChanges: {},
		jobOptions: [],
		appliedOptions: [],
		isLoading: true,
		title: "",
		timeStart: null,
		timeEnd: null,
		shiftObj: null,
		};

		this.getAppointmentData = () => {
		const { appointmentData } = this.props;
		return appointmentData;
		};
		this.getAppointmentChanges = () => {
		const { appointmentChanges } = this.state;
		return appointmentChanges;
		};

		this.handleTimeStart = this.handleTimeStart.bind(this);
		this.handleTimeEnd = this.handleTimeEnd.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.changeAppointment = this.changeAppointment.bind(this);
		this.commitAppointment = this.commitAppointment.bind(this);
	}

	async componentDidMount() {
		const appointment = {
			...this.getAppointmentData(),
			...this.getAppointmentChanges(),
		};
		console.log("APT " + JSON.stringify(appointment))
		if(appointment.id !== undefined) {
			const shiftObj = await	ShiftService
									.getShiftById(appointment.id)
									.then(result => result.data);
			if(shiftObj !== null && shiftObj !== undefined) {
				this.setState({shiftObj : shiftObj});
				this.setState({
					timeStart: new Date(shiftObj.startYear, shiftObj.startMonth, shiftObj.startDay, shiftObj.startHour, shiftObj.startMinute),
					timeEnd: new Date(shiftObj.endYear, shiftObj.endMonth, shiftObj.endDay, shiftObj.endHour, shiftObj.endMinute)
				})
			}
		} else {
			// this.setState({
			// 	timeStart: new Date(shiftObj.startYear, shiftObj.startMonth, shiftObj.startDay, shiftObj.startHour, shiftObj.startMinute),
			// 	timeEnd: new Date(shiftObj.endYear, shiftObj.endMonth, shiftObj.endDay, shiftObj.endHour, shiftObj.endMinute)
			// })
		}
		const appliedJobs = await	ApplicationService
									.getAllApplied()
									.then(result => result.data);
		this.setState({appliedOptions : appliedJobs})
		let jobTitles = [];
		for (let i = 0; i < appliedJobs.length; i++) {
			const jobTitle = await	JobService
									.executeGetJob(appliedJobs[i].jobId)
									.then(result => result.data);
			jobTitles.push(jobTitle);
		}
		console.log(jobTitles)
		this.setState({jobOptions : jobTitles, isLoading : false})
	}

	changeAppointment({ field, changes }) {
		const nextChanges = {
		...this.getAppointmentChanges(),
		[field]: changes,
		};
		this.setState({
		appointmentChanges: nextChanges,
		});
	}

	async commitAppointment(type) {
		console.log(this.state.startDate + " " + this.state.endDate);
		if(this.state.title !== "" && this.state.timeStart !== null && this.state.timeEnd !== null) {
			if(type === 'added') {
				console.log(this.state.timeStart.getFullYear(),
							this.state.timeStart.getMonth(),
							this.state.timeStart.getDate(),
							this.state.timeStart.getHours(),
							this.state.timeStart.getMinutes(),
							" and ",
							this.state.timeEnd.getFullYear(),
							this.state.timeEnd.getMonth(),
							this.state.timeEnd.getDate(),
							this.state.timeEnd.getHours(),
							this.state.timeEnd.getMinutes(),)
				let shift = {
					"startYear"		:this.state.timeStart.getFullYear(),
					"startMonth"	:this.state.timeStart.getMonth(),
					"startDay"		:this.state.timeStart.getDate(),
					"startHour"		:this.state.timeStart.getHours(),
					"startMinute"	:this.state.timeStart.getMinutes(),
					"endYear"		:this.state.timeEnd.getFullYear(),
					"endMonth"		:this.state.timeEnd.getMonth(),
					"endDay"		:this.state.timeEnd.getDate(),
					"endHour"		:this.state.timeEnd.getHours(),
					"endMinute"		:this.state.timeEnd.getMinutes(),
				}
				let appId = null;
				for (let i = 0; i < this.state.jobOptions.length; i++) {
					if(this.state.jobOptions[i].jobTitle === this.state.title) {
						let jobId = this.state.jobOptions[i].id;
						let breakout = false;
						for (let j = 0; j < this.state.appliedOptions.length; j++) {
							if(this.state.appliedOptions[j].jobId === jobId) {
								appId = this.state.appliedOptions[j].id;
								breakout = true;
							}
							if(breakout) break;
						}
						console.log(this.state.jobOptions[i]);
						if(breakout) break;
					}
				}
				if(appId !== null) {
					await ShiftService.postShift(appId, shift);
					window.location.reload();
					// this.componentDidMount();
				}
			}
		}
	}

	handleChange(event) {
		const target = event.target;
		if(target !== undefined && target.name === "title" && target.value !== undefined && target.value !== 0)
			this.setState({title : target.value});
	}
	
	handleTimeStart(event) {
		if(event !== null) {
			this.setState({timeStart : new Date(event)});
			console.log("time start " + new Date(event))
		}
	}
	
	handleTimeEnd(event) {
		if(event !== null) {
			this.setState({timeEnd : new Date(event)});
			console.log("time end " + new Date(event))
		}
	}

	render() {
		const appointment = {
			...this.getAppointmentData(),
			...this.getAppointmentChanges(),
		};
		if(this.state.isLoading)
			return (
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			)
		const {
		classes,
		visible,
		visibleChange,
		appointmentData,
		cancelAppointment,
		target,
		onHide,
		} = this.props;
		const { appointmentChanges } = this.state;

		const displayAppointmentData = {
			...appointmentData,
			...appointmentChanges,
		};

		// const isNewAppointment = appointmentData.id === undefined;
		const isNewAppointment = true;
		const applyChanges = isNewAppointment
		? () => this.commitAppointment('added')
		: () => this.commitAppointment('changed');

		const textEditorProps = field => ({
			variant: 'outlined',
			onChange: ({ target: change }) => this.changeAppointment({
				field: [field], changes: change.value,
			}),
			value: displayAppointmentData[field] || '',
			label: field[0].toUpperCase() + field.slice(1),
			className: classes.textField,
		});

		const pickerEditorProps = field => ({
			className: classes.picker,
			// keyboard: true,
			ampm: true,
			value: displayAppointmentData[field],
			// onChange: date => this.changeAppointment({
			// 	field: [field], changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
			// }),
			inputVariant: 'outlined',
			format: 'MM/DD/YYYY HH:mm',
			onError: () => null,
		});

		const cancelChanges = () => {
		this.setState({
			appointmentChanges: {},
		});
		visibleChange();
		cancelAppointment();
		};
		let allowCreate =	!(this.state.title !== "" &&
							this.state.timeStart !== null &&
							this.state.timeEnd !== null);
		return (
		<AppointmentForm.Overlay
			visible={visible}
			target={target}
			fullSize
			onHide={onHide}
		>
			<div>
				<div className={classes.header}>
					<IconButton
					className={classes.closeButton}
					onClick={cancelChanges}
					>
					<Close color="action" />
					</IconButton>
				</div>
				<div className={classes.content}>
					<div className={classes.wrapper}>
					<Create className={classes.icon} color="action" />
					<FormControl variant="outlined" style={{minWidth: '40%',position: 'absolute', left: '56px', 'paddingBottom':0}}>
						<InputLabel id="demo-simple-select-outlined-label">Applied Jobs</InputLabel>
						<Select
						labelId="demo-simple-select-outlined-label"
						id="demo-simple-select-outlined"
						name="title"
						onClick={this.handleChange}
						value={this.state.title}
						label="Job"
						>
						<MenuItem value="" name="title">
							<em>None</em>
						</MenuItem>
						{this.state.jobOptions.map((data) => (
							<MenuItem name="title" value={data.jobTitle} key={data.jobTitle}>{data.jobTitle}</MenuItem>
						))}
						</Select>
					</FormControl>
					</div>
					<div className={classes.wrapper}>
					<CalendarToday className={classes.icon} color="action" />
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<KeyboardDateTimePicker
						onChange={this.handleTimeStart}
						value={this.state.timeStart}
						name="timeStart"
						label="Start Date"
						style={{minWidth: '40%',position: 'absolute', left: '56px', 'paddingBottom':0}}
						// {...pickerEditorProps('startDate')}
						/>
						<KeyboardDateTimePicker
						onChange={this.handleTimeEnd}
						value={this.state.timeEnd}
						name="timeEnd"
						label="End Date"
						style={{minWidth: '40%',position: 'absolute', left: '50%', 'paddingBottom':0}}
						// {...pickerEditorProps('endDate')}
						/>
					</MuiPickersUtilsProvider>
					</div>
				</div>
				<div className={classes.buttonGroup}>
					{!isNewAppointment && (
					<Button
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={() => {
						visibleChange();
						this.commitAppointment('deleted');
						}}
					>
						Delete
					</Button>
					)}
					<Button
					variant="contained"
					color="primary"
					className={classes.button}
					disabled={allowCreate}
					onClick={() => {
						visibleChange();
						applyChanges();
					}}
					>
					{isNewAppointment ? 'Create' : 'Save'}
					</Button>
				</div>
			</div>
		</AppointmentForm.Overlay>
		);
	}
}

const AppointmentFormContainer = withStyles(containerStyles, { name: 'AppointmentFormContainer' })(AppointmentFormContainerBasic);

const styles = theme => ({
	addButton: {
		position: 'absolute',
		bottom: theme.spacing(1) * 3,
		right: theme.spacing(1) * 4,
	},
});

const useTooltipContentStyles = makeStyles((theme) => ({
	content: {
		padding: theme.spacing(3, 1),
		paddingTop: 0,
		backgroundColor: theme.palette.background.paper,
		boxSizing: "border-box",
		width: "400px"
	},
	contentContainer: {
		paddingBottom: theme.spacing(1.5)
	},
	text: {
		...theme.typography.body2,
		display: "inline-block"
	},
	title: {
		...theme.typography.h6,
		color: theme.palette.text.secondary,
		fontWeight: theme.typography.fontWeightBold,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "normal"
	},
	icon: {
		verticalAlign: "middle"
	},
	contentItemIcon: {
		textAlign: "center"
	},
	grayIcon: {
		color: theme.palette.action.active
	},
	colorfulContent: {
		color: ({ color }) => color[300]
	},
	lens: {
		width: theme.spacing(4.5),
		height: theme.spacing(4.5),
		verticalAlign: "super"
	},
	textCenter: {
		textAlign: "center"
	},
	dateAndTitle: {
		lineHeight: 1.1
	},
	titleContainer: {
		paddingBottom: theme.spacing(2)
	},
	container: {
		paddingBottom: theme.spacing(1.5)
	}
}));
function generate(element) {
	return [0, 1, 2].map((value) =>
	  React.cloneElement(element, {
		key: value,
	  }),
	);
  }
const TooltipContent = ({
		appointmentData,
		formatDate,
		appointmentResources
	}) => {
		let statusIcon;
		switch(appointmentData.status) {
		case 'pending':
			statusIcon = () => (<HourglassEmptyIcon style={{color: "#FFCA28"}} />);
			break;
		case 'accepted':
			statusIcon = () => (<CheckCircleOutlineIcon style={{color: "#1DE8B5"}} />);
			break;
		default: // denied
			statusIcon = () => (<NotInterestedIcon style={{color: "#EF5350"}} />);
			break;
		}
		return (
			<Grid item xs={12} md={6}>
				<Typography variant="h6" className={{margin: 'theme.spacing(4, 0, 2)'}}>
					{appointmentData.title}
				</Typography>
				<div className={{backgroundColor: 'theme.palette.background.paper'}} style={{width:'100%'}}>
					<List>
						<ListItem>
							<ListItemIcon>
								<CalendarTodayIcon />
							</ListItemIcon>
							<ListItemText
								primary={formatDate(appointmentData.startDate, {
										day: "numeric",
										weekday: "long"
										})}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								<AccessTimeIcon />
							</ListItemIcon>
							<ListItemText
								primary=
								{`${formatDate(appointmentData.startDate, {
										hour: "numeric",
										minute: "numeric"
									})} - ${formatDate(appointmentData.endDate, {
										hour: "numeric",
										minute: "numeric"
									})}`}
							/>
						</ListItem>
						<ListItem>
							<ListItemIcon>
								{statusIcon()}
							</ListItemIcon>
							<ListItemText primary={appointmentData.status}/>
						</ListItem>
					</List>
				</div>
			</Grid>
		)
	};

const CustomAppointment = ({ style, ...restProps }) => {
	if (restProps.data.status === "pending")
		return (
			<Appointments.Appointment
			{...restProps}
			style={{ ...style, backgroundColor: "#FFCA28" }}
			/>
		);
	if (restProps.data.status === "accepted")
		return (
			<Appointments.Appointment
			{...restProps}
			style={{ ...style, backgroundColor: "#1DE8B5" }}
			/>
		);
	return (
		<Appointments.Appointment
		{...restProps}
		style={{ ...style, backgroundColor: "#EF5350" }}
		/>
	);
};

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

const AppointmentContent = ({ style, ...restProps }) => {
	let jobIcon;
	switch(restProps.data.status) {
	case 'pending':
		jobIcon = () => (<HourglassEmptyIcon style={{color: orange[0]}} />);
		break;
	case 'accepted':
		jobIcon = () => (<CheckCircleOutlineIcon style={{color: green[0]}} />);
		break;
	default: // denied
		jobIcon = () => (<NotInterestedIcon style={{color: red[0]}} />);
		break;
	}
	return (
	<Appointments.AppointmentContent {...restProps}>
		<div className={restProps.container} style={{'width': '90%', 'height': '100%', 'position': 'absolute'}}>
			<div style={{'float': 'right'}}>
				{jobIcon()}
			</div>
			<div>
				<br/>
				<Typography variant="subtitle1" gutterBottom>
					<b>{restProps.data.title}</b>
				</Typography>
				<Typography variant="subtitle1" gutterBottom>
					<b>{formatAMPM(restProps.data.startDate)} -</b>
				</Typography>
				<Typography variant="subtitle1" gutterBottom>
					<b>{formatAMPM(restProps.data.endDate)}</b>
				</Typography>
			</div>
		</div>
	</Appointments.AppointmentContent>
	);
};

class ShiftSelect extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			userObj: null,
			appObj: null,
			shiftObj: null,
			data: appointments,
			currentDate: new Date(),
			confirmationVisible: false,
			editingFormVisible: false,
			deletedAppointmentId: undefined,
			editingAppointment: undefined,
			previousAppointment: undefined,
			addedAppointment: {},
			startDayHour: 0,
			endDayHour: 24,
			// isNewAppointment: false,
			isNewAppointment: true,
		};

		this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
		this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
		this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
		this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this);
		this.deleteFromDatabase = this.deleteFromDatabase.bind(this);

		this.commitChanges = this.commitChanges.bind(this);
		this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
		this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
		this.appointmentForm = connectProps(AppointmentFormContainer, () => {
			// this.componentDidMount();
			const {
				editingFormVisible,
				editingAppointment,
				data,
				addedAppointment,
				isNewAppointment,
				previousAppointment,
			} = this.state;

			let currentAppointment;
			if(data !== undefined && data !== null) {
				currentAppointment = data
					.filter(appointment => editingAppointment && appointment.id === editingAppointment.id)[0]
					|| addedAppointment;
			}
			const cancelAppointment = () => {
				if (isNewAppointment) {
				this.setState({
					editingAppointment: previousAppointment,
					// isNewAppointment: false,
					isNewAppointment: true,
				});
				}
			};

			return {
				visible: editingFormVisible,
				appointmentData: currentAppointment,
				commitChanges: this.commitChanges,
				visibleChange: this.toggleEditingFormVisibility,
				onEditingAppointmentChange: this.onEditingAppointmentChange,
				cancelAppointment,
			};
		});
	}

	async componentDidMount() {
		const data = await	UserService
							.executeGetUserService(sessionStorage.getItem('authenticatedUser'))
							.then(result => result.data);
							console.log('loading data ...');
		this.setState({userObj : data});

		const appData = await	ApplicationService.getAllApplied()
								.then(result => result.data)
								console.log('loading data...');
		this.setState({appObj : appData});
		const shiftData = await	ShiftService.getShiftsByUser(data.id)
								.then(result => result.data)
								console.log('loading data...');
		this.setState({shiftObj : shiftData, isLoading : false});
		let tmpData = [];
		this.state.data = [];
		for (let i = 0; i < shiftData.length; i++) {
			const s = shiftData[i];
			const jobId = await ApplicationService.getApplication(s.applicationId).then(r=>r.data.jobId);
			const title = await JobService.executeGetJob(jobId).then(r=>r.data.jobTitle);
			const j = {
				id: s.id,
				title: title,
				startDate: new Date(s.startYear, s.startMonth, s.startDay, s.startHour, s.startMinute),
				endDate: new Date(s.endYear, s.endMonth, s.endDay, s.endHour, s.endMinute),
				status: s.status
			}
			console.log(s.startYear, s.startMonth, s.startDay, s.startHour, s.startMinute)
			console.log(s.endYear, s.endMonth, s.endDay, s.endHour, s.endMinute)
			console.log(JSON.stringify(j))
			console.log("pushing " + j)
			tmpData.push(j);
		}
		this.setState({data : tmpData});

		var evt = document.createEvent('Event');
		evt.initEvent('load', false, false);
		window.dispatchEvent(evt);
	}

	componentDidUpdate() {
		this.appointmentForm.update();
	}

	onEditingAppointmentChange(editingAppointment) {
		this.setState({ editingAppointment });
	}

	onAddedAppointmentChange(addedAppointment) {
		this.setState({ addedAppointment });
		const { editingAppointment } = this.state;
		if (editingAppointment !== undefined) {
		this.setState({
			previousAppointment: editingAppointment,
		});
		}
		this.setState({ editingAppointment: undefined, isNewAppointment: true });
	}

	setDeletedAppointmentId(id) {
		this.setState({ deletedAppointmentId: id });
	}

	toggleEditingFormVisibility() {
		const { editingFormVisible } = this.state;
		this.setState({
		editingFormVisible: !editingFormVisible,
		});
		window.scrollTo(0, 0)
	}

	toggleConfirmationVisible() {
		const { confirmationVisible } = this.state;
		this.setState({ confirmationVisible: !confirmationVisible });
	}

	commitDeletedAppointment() {
		this.setState((state) => {
		const { data, deletedAppointmentId } = state;
		const nextData = data.filter(appointment => appointment.id !== deletedAppointmentId);
		this.deleteFromDatabase(deletedAppointmentId);
		return { data: nextData, deletedAppointmentId: null };
		});
		this.toggleConfirmationVisible();
	}

	async deleteFromDatabase(id) {
		console.log("deleting" + id);
		const status = await ShiftService.deleteShiftById(id).then(result => result.data);
		console.log(status);
		this.componentDidMount();
	}

	commitChanges({ added, changed, deleted }) {
		this.setState((state) => {
		let { data } = state;
		if (added) {
			const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
			data = [...data, { id: startingAddedId, ...added }];
		}
		if (changed) {
			data = data.map(appointment => (
			changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
		}
		if (deleted !== undefined) {
			this.setDeletedAppointmentId(deleted);
			this.toggleConfirmationVisible();
		}
		return { data, addedAppointment: {} };
		});
	}

	render() {
		const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
		if(this.state.isLoading)
			return (
				<div style={{marginTop:'20px', marginRight: '20px'}}>
					<LoadingComponent/>
				</div>
			)
		if(!isUserLoggedIn)
			return (
				<div style={{marginTop : '20px'}}>
					<div className="profile-background-container"/>
					<ErrorMessage text="Not Logged In"/>
				</div>
			)
		// console.log("USER:\t" + JSON.stringify(this.state.userObj));
		// console.log("APP:\t" + JSON.stringify(this.state.appObj));
		// console.log("SHIFT:\t" + JSON.stringify(this.state.shiftObj));
		// console.log("DATA:\t" + JSON.stringify(this.state.data));
		const {
			currentDate,
			data,
			confirmationVisible,
			editingFormVisible,
			startDayHour,
			endDayHour,
		} = this.state;
		// for (let i = 0; i < data.length; i++) {
		// 	console.log(data[i])
		// }
		document.getElementById('root')
		return (
		<Paper id='schedule'>
			<Scheduler
			data={data}
			height="100%"
			editing='false'
			>
			<ViewState
				currentDate={currentDate}
				onCurrentDateChange={this.currentDateChange}
			/>
			<EditingState
				onCommitChanges={this.commitChanges}
				onEditingAppointmentChange={this.onEditingAppointmentChange}
				onAddedAppointmentChange={this.onAddedAppointmentChange}
			/>
			<WeekView
				startDayHour={startDayHour}
				endDayHour={endDayHour}
			/>
			{/* <MonthView /> */}
			<EditRecurrenceMenu />
			<Appointments
				appointmentComponent={CustomAppointment}
				appointmentContentComponent={AppointmentContent}
			/>
			<AppointmentTooltip
				contentComponent={TooltipContent}
				// showOpenButton
				showCloseButton
				showDeleteButton
			/>
			<Toolbar />
			<DateNavigator />
			{/* <ViewSwitcher /> */}
			<AppointmentForm
				readOnly='true'
				overlayComponent={this.appointmentForm}
				visible={editingFormVisible}
				onVisibilityChange={this.toggleEditingFormVisibility}
			/>
			{/* <DragDropProvider /> */}
			</Scheduler>

			<Dialog
			open={confirmationVisible}
			onClose={this.cancelDelete}
			>
			<DialogTitle>
				Delete Shift
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
				Are you sure you want to delete this shift?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">
				Cancel
				</Button>
				<Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">
				Delete
				</Button>
			</DialogActions>
			</Dialog>
			<div style={{
				position: 'fixed',
				display: 'block',
				width: '100%',
				height: '100%',
				marginT: '0',
				right: '0',
				fontSize: '200',
				pointerEvents: 'none',
				zIndex: '20'}}>
				
			</div>
				<div
				style={{position: 'fixed',
						right: '0',
						// padding:'20px',
						bottom: '0',
						marginRight: '20px',
						marginBottom: '20px',
						width: '100%',
						color: 'white',
						pointerEvents: 'none',
						textAlign: 'right',}}
				>
					<Fab style={{pointerEvents: 'auto'}}
						color="secondary"
						onClick={() => {
							this.setState({ editingFormVisible: true });
							this.onEditingAppointmentChange(undefined);
							this.onAddedAppointmentChange({
							startDate: new Date(currentDate).setHours(startDayHour),
							endDate: new Date(currentDate).setHours(startDayHour + 1),
							});
							window.scrollTo(0, 0)
						}}
						>
						<AddIcon />
					</Fab>
				</div>
		</Paper>
		);
	}
}
export default withStyles(styles, { name: 'ShiftSelect' })(ShiftSelect);
