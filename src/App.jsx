import "./index.css";
import { useEffect, useRef, useState } from "react";

import products from "./data.json";
import Search from "./Search";
// The view should do the following:

// ✅ Allow the user to search for a product and add it to the quote in the form of a line item.
// ✅ Each line item should display the name, sku, quantity, unit price and total price.
// ✅Display the subtotal, discounts, taxes, and total of the quote
// ✅ As a user modifies the quantity or unit price of a line item, update the total price for the line item.
// ✅ As a user modifies the quantity or unit price of a line item, update the subtotal, discounts, taxes, and total of the quote.
// ✅ Discounts and taxes can be whole number values (don't worry about percentages) and are applied to the whole quote, not at the line item level.
const initialQuote = {
	subtotal: 0,
	discounts: 0,
	taxes: 0,
	total: 0,
	lineItems: [
		{
			name: "Bathroom faucet",
			sku: "12345",
			quantity: null,
			unit_price: null,
			total_price: null,
			product_id: 1,
		},
		{
			name: "Soap dispenser",
			sku: "56789",
			quantity: null,
			unit_price: null,
			total_price: null,
			product_id: 9,
		},
	],
};
export default function App() {
	const [list, setList] = useState(initialQuote);
	const [value, setValue] = useState({});
	const [newItem, setNewItem] = useState({});
	const [tax, setTax] = useState(0);
	const [discount, setDiscount] = useState(0);
	const priceRef = useRef(0);
	const qtyRef = useRef("");
	let newSubTotalArr = [];

	const handleAdd = () => {
		// check if newItem.name exists in array
		const checkIfItemExist = list.lineItems.find(
			(item) => item.name === newItem.name,
		);
		// if newItem.name exists in array, update price, quanities
		if (checkIfItemExist) {
			const newList = list.lineItems.map((item) => {
				if (item.name === newItem.name) {
					item.quantity = item.quantity + 1;
					item.total_price = item.unit_price * item.quantity;
				}
				return item;
			});
			return setList({ ...list, lineItems: newList });
		}

		//if it doesn't exist, update newItem quanity to 1
		newItem.quantity = newItem.quantity + 1;
		const newList = [...list.lineItems, newItem];

		return setList({ ...list, lineItems: newList });
	};

	const handlePriceChange = (id) => {
		const newList = list.lineItems.map((item) => {
			// update the unit price based on the ID of the
			if (item.product_id === id) {
				item.unit_price = priceRef.current[id].value;
				item.total_price =
					item.quantity === null
						? item.unit_price
						: item.unit_price * item.quantity;
			}
			return item;
		});
		return setList({ ...list, lineItems: newList });
	};

	const handleQtyChange = (id) => {
		const newList = list.lineItems.map((item) => {
			if (item.product_id === id) {
				//update the qty based on the ID of the product
				item.quantity = qtyRef.current[id].value;
				item.total_price =
					item.total_price === undefined ? 0 : item.unit_price * item.quantity;
			}
			return item;
		});
		return setList({ ...list, lineItems: newList });
	};

	//every time the total price of the item changes, push to the array and calculate the total
	list.lineItems.forEach((item) => {
		return newSubTotalArr.push(item.total_price);
	});
	const updatedSubtotal = newSubTotalArr.reduce((acc, curr) => acc + curr, 0);

	useEffect(() => {
		//update the data object based on the variables changing state
		const taxToNum = tax < 10 ? `1.0${tax}` : `1.${tax}`;
		const discountToNum = discount < 10 ? `1.0${discount}` : `1.${discount}`;
		setList({
			...list,
			subtotal: updatedSubtotal,
			total: ((updatedSubtotal / discountToNum) * taxToNum).toFixed(2),
		});
	}, [updatedSubtotal, tax, discount]);

	return (
		<div className="App">
			<Search
				options={products}
				label="name"
				id="id"
				selectedVal={value}
				handleChange={(val) => setValue(val)}
				handleAdd={handleAdd}
				setNewItem={(val) => setNewItem(val)}
			/>
			<h2>Build your Quote</h2>
			<table>
				<tbody>
					<tr>
						<th>Item Name:</th>
						<th>Item SKU:</th>
						<th>Quantity</th>
						<th>Unit Price</th>
						<th>Total Price</th>
					</tr>
					{list.lineItems.map((item) => {
						return (
							<tr key={item.product_id}>
								<td>{item.name}</td>
								<td>{item.sku}</td>
								<td>
									<input
										type="number"
										min="0"
										placeholder="Insert Quantity"
										name={item.product_id}
										label={item.name}
										ref={(ref) =>
											(qtyRef.current = {
												...qtyRef.current,
												[item.product_id]: ref,
											})
										}
										value={item.quantity == null ? "" : item.quantity}
										onChange={() => handleQtyChange(item.product_id)}
									/>
								</td>
								<td>
									<input
										type="number"
										min="0"
										placeholder="Insert Unit Price"
										name={item.product_id}
										label={item.name}
										ref={(ref) =>
											(priceRef.current = {
												...priceRef.current,
												[item.product_id]: ref,
											})
										}
										onChange={() => handlePriceChange(item.product_id)}
									/>
								</td>
								<td>
									{item.total_price !== null || item.total_price > 0
										? `$${item.total_price.toFixed(2)}`
										: "$0.00"}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<table className="subtotal">
				<tbody>
					<tr>
						<th>Subtotal ($)</th>
						<th>Discounts (%)</th>
						<th>Taxes (%)</th>
						<th>Total ($)</th>
					</tr>
					<tr>
						<td>${list.subtotal.toFixed(2)}</td>
						<td>
							<input
								type="number"
								min="0"
								name={discount}
								value={discount}
								id=""
								placeholder="Discounts"
								onChange={(e) => setDiscount(e.target.value)}
							/>
						</td>
						<td>
							<input
								type="number"
								min="0"
								name={tax}
								value={tax}
								placeholder="% Tax"
								onChange={(e) => setTax(e.target.value)}
							/>
						</td>
						<td>${list.total}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
