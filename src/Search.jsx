import { useEffect, useRef, useState } from "react";

// from https://codesandbox.io/p/sandbox/searchable-dropdown-omxyr
const Search = ({
	options,
	label,
	id,
	selectedVal,
	handleChange,
	handleAdd,
	setNewItem,
}) => {
	const [query, setQuery] = useState({});
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef(null);

	useEffect(() => {
		document.addEventListener("click", toggle);
		return () => document.removeEventListener("click", toggle);
	}, []);

	const selectOption = (option) => {
		const unitPrice = 6;
		const qty = 1;
		const totalPrice = qty * unitPrice;
		const newItem = {
			name: option.name,
			sku: option.sku,
			product_id: option.id,
			quantity: qty,
			unit_price: unitPrice,
			total_price: totalPrice,
		};
		setQuery(() => "");
		handleChange(option[label]);
		setNewItem(newItem);
		setIsOpen((isOpen) => !isOpen);
	};

	function toggle(e) {
		setIsOpen(e && e.target === inputRef.current);
	}

	const getDisplayValue = () => {
		if (query) return query;
		if (selectedVal) return selectedVal;
		return "";
	};

	// search by name function
	const filter = (options) => {
		// because we are starting as an {}, only run this function when the query is a string
		if (typeof query === "string") {
			return options.filter(
				(option) =>
					option[label].toLowerCase().indexOf(query?.toLowerCase()) > -1,
			);
		}
		return options;
	};

	return (
		<div className="dropdown">
			<div className="control">
				<div className="selected-value">
					<input
						ref={inputRef}
						type="text"
						value={
							typeof getDisplayValue() === "object" ? "" : getDisplayValue()
						}
						placeholder="Search..."
						name="searchTerm"
						onChange={(e) => {
							setQuery(e.target.value);
							handleChange(null);
							setNewItem(null);
						}}
						onClick={toggle}
					/>
				</div>
				<div className={`arrow ${isOpen ? "open" : ""}`}></div>
			</div>

			<div className={`options ${isOpen ? "open" : ""}`}>
				{filter(options).map((option, index) => {
					return (
						<div
							onClick={() => selectOption(option)}
							className={`option ${
								option[label] === selectedVal ? "selected" : ""
							}`}
							key={`${id}-${index}`}>
							{option[label]}
						</div>
					);
				})}
			</div>
			<button type="button" onClick={handleAdd}>
				Add
			</button>
		</div>
	);
};

export default Search;
