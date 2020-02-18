import React, { useState, useEffect } from 'react';
import Loader from '../Loader';
import UserRow from './UserRow';
import ErrorPage from '../ErrorPage';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { 
	MuiPickersUtilsProvider, 
	KeyboardTimePicker,
	KeyboardDatePicker
} from '@material-ui/pickers';

const useStyles = makeStyles({
	paper: {
		position: 'relative'
	},
	table: {
		minWidth: 650,
	},
	container: {
		maxHeight: 480,
	},
	toolbar: {
		'& > *': {
			width: 200,
			marginTop: 10
		},
		'& > *:not(:nth-child(1))': {
			marginLeft: 10
		},
	},
});

function UsersTable() {
	const MAX_ROWS_PER_PAGE = 10;
	const FIRST_PAGE 				= 0;
	const INIT_FILTER_STATE = {
		lastName: '',
		phone: '',
		city: '',
		dateFrom: new Date('1920-08-18T21:11:54').getTime(),
		dateTo: Date.now()
	}

	const [loading, setLoading]								= useState( true );
	const [fetchError, setFetchError]					= useState( null );
	const [initUsersData, setInitUsersData]		= useState( [] );
	const [usersData, setUsersData]						= useState( [] );
	const [filterLastName, setFilterLastName]	= useState( INIT_FILTER_STATE.lastName );
	const [filterPhone, setFilterPhone]				= useState( INIT_FILTER_STATE.phone );
	const [filterCity, setFilterCity]					= useState( INIT_FILTER_STATE.city );
	const [filterDateFrom, setFilterDateFrom]	= useState( INIT_FILTER_STATE.dateFrom );
	const [filterDateTo, setFilterDateTo]			= useState( INIT_FILTER_STATE.dateTo );
	const [currentPage, setCurrentPage]				= useState( FIRST_PAGE );
	const [rowsPerPage, setRowsPerPage]				= useState( MAX_ROWS_PER_PAGE );

	const classes = useStyles();

	useEffect(() => {
		fetch('https://cors-anywhere.herokuapp.com/http://jsteam.sibedge.com/raw/task/users.json', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
			.then(response => {
				if (!response.ok) { throw response }
				return response.json();	
			})
			.then(data => { 
				setUsersData(data.results); 
				setInitUsersData(data.results); 
			})
			.catch(err => setFetchError({ code: err.status, text: err.statusText }))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const users = initUsersData
			.filter(user => user.name.last.startsWith(filterLastName.toLowerCase()))
			.filter(user => user.phone.startsWith(filterPhone.toLowerCase()))
			.filter(user => user.location.city.startsWith(filterCity.toLowerCase()))
			.filter(user => filterDateFrom <= new Date(user.dob).getTime() &&
				filterDateTo >= new Date(user.dob).getTime()
			);
		setUsersData(users);
		setCurrentPage(FIRST_PAGE);
	}, 
		[
			filterLastName, 
			filterPhone, 
			filterCity, 
			filterDateFrom, 
			filterDateTo
		]
	);

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, usersData.length - currentPage * rowsPerPage);

	const handleChangePage = (e, newPage) => setCurrentPage(newPage);

	const handleChangeRowsPerPage = e => {
		setRowsPerPage(parseInt(e.target.value, 10));
		setCurrentPage(FIRST_PAGE);
	};

	const handleFilterLastName = e => setFilterLastName( e.target.value );
	
	const handleFilterPhone = e => setFilterPhone( e.target.value.replace(/(^[a-zA-Z]+$)/, '') ); 
	
	const handleFilterCity = e => setFilterCity( e.target.value );

	const handleFilterDateFrom = date => { 
		if (date instanceof Date && !isNaN(date)) {
			setFilterDateFrom( date ); 
		} 
	};

	const handleFilterDateTo = date => { 
		if (date instanceof Date && !isNaN(date)) {
			setFilterDateTo( date ); 
		} 
	};

	const handleRestoreClick = e => {
		setUsersData(initUsersData);
		setFilterLastName(INIT_FILTER_STATE.lastName);
		setFilterPhone(INIT_FILTER_STATE.phone);
		setFilterCity(INIT_FILTER_STATE.city);
		setFilterDateFrom(INIT_FILTER_STATE.dateFrom);
		setFilterDateTo(INIT_FILTER_STATE.dateTo);
	}

	return(
		<Paper className={ classes.paper }>
			{ fetchError && (
				<ErrorPage error={ fetchError }/>
			) }
			<Loader isLoading={ loading } />
			<Toolbar className={ classes.toolbar }>
				<TextField 
					className={ classes.text } 
					id="filter-second-name" 
					label="Фамилия" 
					variant="outlined"
					value={ filterLastName }
					onInput={ handleFilterLastName } />
				<TextField 
					className={ classes.text } 
					id="filter-phone" 
					label="Телефон"
					type="tel"
					variant="outlined"
					value={ filterPhone }
					onInput={ handleFilterPhone } />
				<TextField 
					className={ classes.text } 
					id="filter-city" 
					label="Город"
					variant="outlined"
					value={ filterCity }
					onInput={ handleFilterCity } />
			</Toolbar>
			<Toolbar className={ classes.toolbar }>
				<MuiPickersUtilsProvider utils={ DateFnsUtils }>
					<KeyboardDatePicker
						disableToolbar
						variant="inline"
						format="dd/MM/yyyy"
						margin="normal"
						id="filter-date-from"
						label="От"
						value={ filterDateFrom }
						onChange={ handleFilterDateFrom }
						KeyboardButtonProps={{
							'aria-label': 'change from date',
						}}
					/>
					<KeyboardDatePicker
						disableToolbar
						variant="inline"
						format="dd/MM/yyyy"
						margin="normal"
						id="filter-date-to"
						label="До"
						value={ filterDateTo }
						onChange={ handleFilterDateTo }
						KeyboardButtonProps={{
							'aria-label': 'change to date',
						}}
					/>
				</MuiPickersUtilsProvider>
				<Button 
					variant="contained" 
					color="primary"
					onClick={ handleRestoreClick } >Сбросить</Button>
			</Toolbar>
			<TableContainer className={ classes.container }>
				<Table stickyHeader className={ classes.table }>
					<TableHead>
						<TableRow>
							<TableCell align="center">Фотография</TableCell>
							<TableCell align="center">Имя</TableCell>
							<TableCell align="center">Адрес</TableCell>
							<TableCell align="center">Email</TableCell>
							<TableCell align="center">Телефон</TableCell>
							<TableCell align="center">Дата рождения</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ usersData
							.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
							.map(user => <UserRow user={ user } key={ user.email } />)
						}
						{emptyRows > 0 && (
							<TableRow style={{ height: 53 * emptyRows }}>
								<TableCell colSpan={ 6 } />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={ [10, 20, 30] }
				component="div"
				count={ usersData.length }
				rowsPerPage={ rowsPerPage }
				page={ currentPage }
				onChangePage={ handleChangePage }
				onChangeRowsPerPage={ handleChangeRowsPerPage }
			/>
		</Paper>
	);
}

export default UsersTable;
