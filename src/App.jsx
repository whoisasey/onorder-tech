import "./index.css";
import { useEffect, useRef, useState } from "react";

import products from "./data.json";
import Search from "./Search";
// The view should do the following:

// ✅ Allow the user to search for a product and add it to the quote in the form of a line item.
// ✅ Each line item should display the name, sku, quantity, unit price and total price.
// Display the subtotal, discounts, taxes, and total of the quote
// ✅ As a user modifies the quantity or unit price of a line item, update the total price for the line item.
// ✅ As a user modifies the quantity or unit price of a line item, update the subtotal, discounts, taxes, and total of the quote.
// Discounts and taxes can be whole number values (don't worry about percentages) and are applied to the whole quote, not at the line item level.

export default function App() {
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
	const [list, setList] = useState(initialQuote);
	const [value, setValue] = useState({});
	const [newItem, setNewItem] = useState({});
	let newSubTotalArr = [];
	let updatedSubtotal;

	// useEffect(() => {
	// 	getSubtotal();
	// 	console.log(list);
	// }, [list]);

	const getSubtotal = () => {
		// whenever an item is added or removed, update the subtotal
		list.lineItems.forEach((item) => {
			if (item.total_price !== null && item.total_price !== undefined) {
				newSubTotalArr.push(item.total_price);
			}
		});
		updatedSubtotal = newSubTotalArr.reduce((acc, curr) => acc + curr, 0);

		return setList({ ...list, subtotal: updatedSubtotal });
	};

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
					item.unit_price = 6; //arbitrary
					item.total_price = item.unit_price * item.quantity;
				}
				return item;
			});

			return setList({ ...list, lineItems: newList });
		}

		const newList = [...list.lineItems, newItem];
		return setList({ ...list, lineItems: newList });
	};

	const handleDecrease = (index) => {
		// if item quanity is 1 in array and decreases to 0, remove from lineItems
		if (list.lineItems[index].quantity === 1) {
			const updatedList = list.lineItems;
			updatedList.splice(index, 1);
			return setList({ ...list, lineItems: updatedList });
		}

		const updatedList = list.lineItems;
		updatedList[index].quantity--;
		updatedList[index].total_price =
			updatedList[index].quantity * updatedList[index].unit_price;

		return setList({ ...list, lineItems: updatedList });
	};

	const handleIncrease = (index) => {
		//this differs from handleAdd as it only increases the units
		const updatedList = list.lineItems;
		updatedList[index].quantity++;
		updatedList[index].total_price =
			updatedList[index].quantity * updatedList[index].unit_price;

		return setList({ ...list, lineItems: updatedList });
	};
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
			-------------------------------------------------------------------------
			<table>
				<tbody>
					<tr>
						<th>Item Name:</th>
						<th>Item SKU:</th>
						<th>Quantity</th>
						<th>Unit Price</th>
						<th>Total Price</th>
					</tr>
					{list.lineItems.map((item, idx) => {
						{
							/* don't show items if the quanity, total price, or unit price is null */
						}
						if (
							item.quantity !== null ||
							item.total_price !== null ||
							item.unit_price !== null
						)
							return (
								<tr key={item.product_id}>
									<td>{item.name}</td>
									<td>{item.sku}</td>
									<td>{item.quantity}</td>
									<td>{item.unit_price}</td>
									<td>{item.total_price}</td>
									<td>
										<button type="button" onClick={() => handleDecrease(idx)}>
											-
										</button>
									</td>
									<td>
										<button type="button" onClick={() => handleIncrease(idx)}>
											+
										</button>
									</td>
								</tr>
							);
					})}
				</tbody>
				<tbody>
					<tr>
						<th>Subtotal</th>
						<th>Discounts</th>
						<th>Taxes</th>
						<th>Total</th>
					</tr>
					<tr>
						<td>{list.subtotal}</td>
						<td></td>
						<td></td>
						<td></td>
						<td></td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}
