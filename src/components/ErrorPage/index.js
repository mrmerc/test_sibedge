import React from 'react';
import './ErrorPage.css';

export default function ErrorPage(props) {
	return (
		<div className="error-page">
			<div>{ props.error.code } | { props.error.text }</div>
		</div>
	);
}