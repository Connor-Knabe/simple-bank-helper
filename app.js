var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('transactions.json', 'utf8'));

var goals = { groceries: {}, 'date night': {}, 'eating out': {}, gas: {}, other: {}, utilities: {} };
obj.transactions.forEach(transaction => {
	if (transaction.associated_goal_info) {
		var goalName = transaction.associated_goal_info.name.toLowerCase();
		var date = goalName.substr(0, goalName.indexOf(' '));
		var c = goalName.charAt(0);
		if (c >= '0' && c <= '9' && !date.includes('1st')) {
			for (var name in goals) {
				if (goals.hasOwnProperty(name)) {
					if (goalName.includes(name)) {
						var amount = transaction.amounts.base / 10000;
						var goalObj = goals[name];
						goalObj[date] = goalObj[date] ? (goalObj[date] += amount) : (goalObj[date] = amount);
					}
				}
			}
		}
	}
});

for (var name in goals) {
	if (goals.hasOwnProperty(name)) {
		var individualGoal = goals[name];

		var goalCost = 0;
		for (var goal in individualGoal) {
			var count = Object.keys(individualGoal).length;
			goalCost += individualGoal[goal];
		}
		console.log(`Goal ${name} total cost ${goalCost.toFixed(2)}. Average of ${(goalCost / count).toFixed(2)} per month`);
	}
}
