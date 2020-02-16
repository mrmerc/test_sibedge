import React, { useState, useEffect } from 'react';
import './UsersTable.css';
import Loader from '../Loader';
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

function UsersTable(props) {
	const [loading, setLoading] = useState( true );
	const [initData, setInitData] = useState( [] );
	const [users, setUsers] = useState( [] );
  const [page, setPage] = useState( 0 );
  const [rowsPerPage, setRowsPerPage] = useState( 10 );
	const [dateFrom, setDateFrom] = useState( new Date('1920-08-18T21:11:54') );
	const [dateTo, setDateTo] = useState( Date.now() );

	const classes = useStyles();

	useEffect(() => {
		fetch('https://cors-anywhere.herokuapp.com/http://jsteam.sibedge.com/raw/task/users.json', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		.then(response => response.json())
		.then(data => { setUsers(data.results); setInitData(data.results); setLoading(false) })
		.catch(err => console.log(err));
	}, []);

	const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
	const formatAddress = (address) => Object.values(address).reverse().join(', ');

	const tableRow = (user) => {
		const uName = `${ formatName(user.name.first) } ${ formatName(user.name.last) }`;
		const uAddress = formatAddress(user.location);
		const uPhone = `Phone: ${ user.phone }, Cell: ${ user.cell }`;

		return <TableRow key={ user.email }>
			<TableCell component="th" scope="row" align="center">
				<img src={ user.picture.thumbnail } alt="Avatar"/>
			</TableCell>
			<TableCell align="center">{ uName }</TableCell>
			<TableCell align="center">{ uAddress }</TableCell>
			<TableCell align="center">{ user.email }</TableCell>
			<TableCell align="center">{ uPhone }</TableCell>
			<TableCell align="center">{ user.dob }</TableCell>
		</TableRow>
	}

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

	const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
	};

	const filterByName = (e) => {
		setUsers(users
			.filter(user => user.name.last.startsWith(e.target.value.toLowerCase()))
		);
	}

	const filterByPhone = (e) => {
		const value = e.target.value;
		if (! /(^[0-9()-]+$)/.test(value) ) return;

		setUsers(users
			.filter(user => user.phone.startsWith(value.toLowerCase()))
		);
	}

	const filterByCity = (e) => {
		setUsers(users
			.filter(user => user.location.city.startsWith(e.target.value.toLowerCase()))
		);
	}

	const filterByDate = (from, date) => {
		if (!( date instanceof Date && !isNaN(date) )) return;

		if (from) {
			setUsers(users
				.filter(user => date.getTime() <= new Date(user.dob).getTime() && dateTo >= new Date(user.dob).getTime())
			);
		} else {
			setUsers(users
				.filter(user => dateFrom <= new Date(user.dob).getTime() && date.getTime() >= new Date(user.dob).getTime())
			);
		}
	}

	const handleDateFromChange = (date) => {
		setDateFrom(date.getTime());
		filterByDate(true, date);
	}

	const handleDateToChange = (date) => {
		setDateTo(date.getTime());
		filterByDate(false, date);
	}

	const handleRestoreClick = (e) => {
		setUsers(initData);
	}

	return(
		<Paper>
			<Loader isLoading={ loading } />
			<Toolbar className={ classes.toolbar }>
				<TextField 
					className={ classes.text } 
					id="filter-second-name" 
					label="Фамилия" 
					variant="outlined"
					onInput={ filterByName } />
				<TextField 
					className={ classes.text } 
					id="filter-phone" 
					label="Телефон"
					type="tel"
					variant="outlined"
					onInput={ filterByPhone } />
				<TextField 
					className={ classes.text } 
					id="filter-city" 
					label="Город"
					variant="outlined"
					onInput={ filterByCity } />
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
						value={ dateFrom }
						onChange={ handleDateFromChange }
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
						value={ dateTo }
						onChange={ handleDateToChange }
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
						{ users
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map(user => tableRow(user))
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
				count={ users.length }
				rowsPerPage={ rowsPerPage }
				page={ page }
				onChangePage={ handleChangePage }
				onChangeRowsPerPage={ handleChangeRowsPerPage }
			/>
		</Paper>
	);
}

export default UsersTable;