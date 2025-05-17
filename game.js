console.log("Game JS")
function start(){
	let selectedFruit = document.getElementById("fruit-select").value

	if(selectedFruit === "Select the Fruit"){alert("Please Choose The Fruit")}
		else {
			console.log(selectedFruit)
			const fruit = fruitsData[selectedFruit].en
			console.log(fruit)
			form = document.getElementById('form')
			form.style = `display:none;`
			screen = document.getElementById('game')
			screen.style.width = "600px"
			screen.style.height = "700px"
			screen.innerHTML = `<span>${fruit}</span>`
			// Object.keys(fruitsData).map(key => {
  			// 	console.log(key, fruitsData[key].en);
			// });
			// console.log(fruitsData.grapes.en)
		}
}