console.log("Logic JS")
// Addin The New Fruit
function addClick () {
	let inputText = document.getElementById("fruit-input").value.toLowerCase()
	let select = document.getElementById("fruit-select")
	let optionsCount = select.options.length
	// Cheking The Options Count
	if(optionsCount === 6){ alert("Fruits' List Couldn't be Over Than 5, Please Remove The One For Adding The New One")}
	// The Validation of Input Value
	else if(inputText.length === 0 ){ 
		alert("Please Wrtie The Name of Fruit")
	}
	else if(inputText.length < 3 && inputText.length !== 0) {
		alert("You Know The Shortest Name of The Fruit about 3 letters, like N-U-T or F-I-G, so try again :)))");
	}
		else {
			// Checkin Regex of The Fruit Name
			const isValid = /^[a-zA-Zа-яА-ЯёЁԱ-Ֆա-ֆ]+$/.test(inputText);
			if(isValid) {
				let values = Array.from(select.options).filter(option => !option.selected).map(option => option.value);
				if (values.find( value => value === inputText)){ alert("You Can't Add The Same Fruit Again, Please Choose Another!")}
					else {
						let option = document.createElement("option")
						option.id = inputText
						option.value = inputText
						option.innerHTML = `${inputText} <span onclick="removeFruit(event)">🗑️</span>`
						select.appendChild(option);
						console.log(inputText)
						console.log(values)
					}
			}
			else { alert("The Fruit Name Can Be Only Letters And One Word!")}
		}
	// Clean Input Value
	document.getElementById('fruit-input').value = ""
}
// Remove Fruit
function removeFruit (event) {
	let id = event.target.parentElement.id
	let option = document.getElementById(id)
	console.log(option)
	option.remove()
}