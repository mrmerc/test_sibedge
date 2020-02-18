import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const formatName = name => name.charAt(0).toUpperCase() + name.slice(1);
const formatAddress = address => Object.values(address).reverse().join(', ');

export default function UserRow(props) {
	const user = props.user;
	const uName = `${ formatName(user.name.first) } ${ formatName(user.name.last) }`;
	const uAddress = formatAddress(user.location);
	const uPhone = `Phone: ${ user.phone }, Cell: ${ user.cell }`;

	return (
		<TableRow>
			<TableCell component="th" scope="row" align="center">
				<img src={ user.picture.thumbnail } alt="Avatar"/>
			</TableCell>
			<TableCell align="center">{ uName }</TableCell>
			<TableCell align="center">{ uAddress }</TableCell>
			<TableCell align="center">{ user.email }</TableCell>
			<TableCell align="center">{ uPhone }</TableCell>
			<TableCell align="center">{ user.dob }</TableCell>
		</TableRow>
	)
}