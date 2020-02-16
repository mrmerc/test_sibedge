import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [users, setUsers] = useState( [] );

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

	const userEntries = users.map(user => {
		const uName = `${ formatName(user.name.first) } ${ formatName(user.name.last) }`;
		const uAddress = formatAddress(user.location);
		const uPhone = `Phone: ${ user.phone }, Cell: ${ user.cell }`;

		return <tr>
			<td><img src={ user.picture.thumbnail } alt="Avatar"/></td>
			<td>{ uName }</td>
			<td>{ uAddress }</td>
			<td>{ user.email }</td>
			<td>{ uPhone }</td>
			<td>{ user.dob }</td>
		</tr>
	});

	return(
		<table>
			<thead>
				<tr>
					<th>Фотография</th>
					<th>Имя</th>
					<th>Адрес</th>
					<th>Email</th>
					<th>Телефон</th>
					<th>Дата рождения</th>
				</tr>
			</thead>
			<tbody>
				{ userEntries }
			</tbody>
		</table>
	);
}

export default App;
