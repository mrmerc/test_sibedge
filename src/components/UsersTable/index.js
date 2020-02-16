import React, { useState, useEffect } from 'react';
import './UsersTable.css';
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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
	},
	container: {
    maxHeight: 540,
	},
	toolbar: {
		'& > *': {
			width: 200,
			marginTop: 10
		},
	},
});

function UsersTable() {
	const [users, setUsers] = useState( [] );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

	const classes = useStyles();

	useEffect(() => {
		fetch('https://cors-anywhere.herokuapp.com/http://jsteam.sibedge.com/raw/task/users.json', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		})
		.then(response => response.json())
		.then(data => setUsers(data.results))
		.catch(err => console.log(err));
	}, []);

	const formatName = (name) => name.charAt(0).toUpperCase() + name.slice(1);
	const formatAddress = (address) => Object.values(address).reverse().join(', ');

	const userEntries = users
		.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
		.map(user => {
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
	});

	const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
	};
	
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

	return(
		<Paper>
			<Toolbar className={ classes.toolbar }>
				<TextField className={ classes.text } id="filter-second-name" label="Фамилия" variant="outlined" />
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
						{ userEntries }
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