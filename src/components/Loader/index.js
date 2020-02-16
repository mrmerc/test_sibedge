import React, { useState } from 'react';
import './Loader.css';
import CircularProgress from '@material-ui/core/CircularProgress';

const containerClass = {
	position: 'absolute',
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
	zIndex: 5,
	background: '#fff',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center'
}

const hiddenClass = { display: 'none' }

export default function Loader(props) {
	return (
		<div style={ props.isLoading ? containerClass : hiddenClass }>
			<CircularProgress />
		</div>
	);
}