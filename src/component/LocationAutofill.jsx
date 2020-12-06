import React from "react";
import PlacesAutocomplete,
	 { geocodeByAddress,
	   getLatLng } from "react-places-autocomplete";
import TextField from '@material-ui/core/TextField';
import LoadingComponent from './LoadingComponent';

export default function LocationAutofill(props) {
	const [prevAddress, setPrevAddress] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [coordinates, setCoordinates] = React.useState({
		lat: null,
		lng: null
	});
	const [current, setCurrent] = React.useState('');

	const handleSelect = async value => {
		const results = await geocodeByAddress(value);
		const latLng = await getLatLng(results[0]);
		setPrevAddress(address);
		setAddress(value);
		setCoordinates(latLng);
	};

	const handleChange = event => {
		props.update(event);
	}

	if(prevAddress !== address) {
		setPrevAddress(address)
		props.update(address);
	}
	
	const st = {
		// 'font-size': '1rem',
		// 'font-family': 'sans-serif',
		// 'font-weight': '400',
		// 'font': 'inherit',
		'line-height': '1.5',
		'letter-spacing': '0.00938em'
	}
	return (
		<PlacesAutocomplete
			value={address}
			onChange={setAddress}
			onSelect={handleSelect}
		>
			{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
			<div onChange={(event) => props.update(event.target.value)} onClick={(event) => props.update(address)}>
				<TextField inputProps={{autocomplete: 'new-password', form: {autocomplete: 'off',},}} label={props.text} {...getInputProps({ placeholder: "address" })}/>

				<div>
					{loading
					? <div style={{marginTop:'20px', marginRight: '20px'}}>
						<LoadingComponent/>
					</div>
					: null}
					{/* <div style={ {'backgroundColor': "#E0E0E0", 'line-height': '1.5', 'letter-spacing': '0.00938em'} }>
						One Two Three Four
					</div>
					<div style={ {'backgroundColor': "#fff"},st }>
						One Two Three Four
					</div> */}
					{suggestions.map(suggestion => {
						const style = {
							lineHeight : '1.5',
							letterSpacing : '0.00938em',
							backgroundColor: suggestion.active ? "#E0E0E0" : "#fff"
						};
						return (
						<div {...getSuggestionItemProps(suggestion, { style })}>
							{suggestion.description}
						</div>
						);
					})}
				</div>
			</div>
			)}
		</PlacesAutocomplete>
	);
}