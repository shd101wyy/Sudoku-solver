/*
	used to generate sudoku
	n * n
	with all values = 0
*/
var generate_empty_sudoku = function(n)
{
	var output = [];
	for(var i = 0; i < n; i++)
	{
		output.push([]);
		for(var j = 0; j < n; j++)
		{
			output[i].push(0);
		}
	}
	return output;
}
/*
	check whether has repetition at current i, j 
	by row and col
*/
var have_repetition = function(sudoku_table, i, j, num)
{
	/* check row */
	for(var a = 0; a < sudoku_table.length; a++)
	{
		if(a == i) continue;
		if(sudoku_table[a][j] === num)
			return true
	}
	/* check col */
	for(var a = 0; a < sudoku_table.length; a++)
	{
		if(a == j) continue;
		if(sudoku_table[i][a] === num)
			return true;
	}
	/* check square */
	var n = Math.sqrt(sudoku_table.length);
	var x = Math.floor(i/n) * n;
	var y = Math.floor(j/n) * n;
	for(var a = x; a < x+n; a++)
	{
		for(var b = y; b < y+n; b++)
		{
			if(a == i && b == j) continue;
			if(sudoku_table[a][b] === num) return true;
		}
	}
	return false;
}

/*
	used to generate random sudoku table
	n*n table (usually 9*9 table)
*/
var generate_random_sudoku = function(n)
{
	/*
		Didn't finish
	*/
}

// console.log(generate_random_sudoku());

/*
	eg:
	[1,2,3] =>
		[1,2,3]
		[1,3,2]
		[2,1,3]
		[2,3,1]
		[3,1,2]
		[3,2,1]
*/
/*
var generate_all_possible_combination = function(l)
{
	// length = 0;
	if(l.length == 0) return [];
	// length = 1; only one possibilities
	if(l.length == 1) return [l];
	// length = 2; 2 possiblities
	if(l.length == 2) return [ [l[0], l[1]], [l[1], l[0]] ]
	else
	{
		var output = [];
		for(var i = 0; i < l.length; i++)
		{
			var head = l[i];
			var rest = [];
			for(var j = 0; j < l.length; j++)
			{
				if(i!==j) rest.push(l[j]);
			}
			rest = generate_all_possible_combination(rest);
			for(var j = 0; j < rest.length; j++) // push all possibilities
			{
				var new_output = [head].concat(rest[j]);
				output.push(new_output);
			}
		}
		return output;
	}
}
*/


/*
	get value list that an element can take
*/
var get_available_value_list = function(sudoku_table, i, j)
{
	var exist_ = {}; // check exist
	for(var a = 0; a < sudoku_table.length; a++)
	{
		exist_[a+1] = false;
	}

	/* check row */
	for(var a = 0; a < sudoku_table.length; a++)
	{
		if(sudoku_table[a][j] === 0) continue;
		exist_[sudoku_table[a][j]] = true;
	}
	/* check col */
	for(var a = 0; a < sudoku_table.length; a++)
	{
		if(sudoku_table[i][a] === 0) continue;
		exist_[sudoku_table[i][a]] = true;
	}
	/* check square */
	var n = Math.sqrt(sudoku_table.length);
	var x = Math.floor(i/n) * n;
	var y = Math.floor(j/n) * n;
	for(var a = x; a < x+n; a++)
	{
		for(var b = y; b < y+n; b++)
		{
			if(sudoku_table[a][b] === 0) continue;
			exist_[sudoku_table[a][b]] = true;
		}
	}
	var output = [];
	for(var i in exist_)
	{
		if(exist_[i] === false)
		{
			output.push(parseInt(i));
		}
	}
	return output;
}

/*
	solve sudoku by backtracking algothrithm
*/
var solve_sudoku = function(sudoku_table)
{
	/*
		save coord
		[[x0, y0], [x1, y1], ...]
	*/
	var coord = [];
	var value_list = [];
	var value_list_index = [];
	// init coord
	// init value list for each coord
	for(var i = 0; i < sudoku_table.length; i++)
	{
		for(var j = 0; j < sudoku_table.length; j++)
		{
			if(sudoku_table[i][j] == 0)
			{
				coord.push([i, j]) // save coord
				var available_value_list = get_available_value_list(sudoku_table, i, j);
				value_list.push(available_value_list); // save available value list
				value_list_index.push(0);
			}
		}
	}

	/*
		num start from 1
		until length
	*/
	var correct_sudoku = function(sudoku_table, coord)
	{
		for(var i = 0; i < coord.length; i++)
		{
			var x = coord[i][0]; var y = coord[i][1];
			if(have_repetition(sudoku_table, x, y, sudoku_table[x][y]))
				return false
		}
		return true;
	}
	var count = 0
	while(1)
	{
		if(count === coord.length) return sudoku_table; // finished
		var x = coord[count][0]; var y = coord[count][1];
		var available_value_list = value_list[count];
		sudoku_table[x][y] = 0;
		var satisfied = false;

		if(value_list_index[count] === available_value_list.length)
		{
			value_list_index[count] = 0;
			count-=1;
			if(count == -1)
			{
				console.log("ERROR:Invalid SOKUDO");
				return "ERROR:Invalid SOKUDO";
			}
			continue;
		}
		for(var i = value_list_index[count]; i < available_value_list.length; i++)
		{
			if(have_repetition(sudoku_table, x, y, available_value_list[i])) continue;
			else
			{
				satisfied = true;
				value_list_index[count] = i + 1;
				sudoku_table[x][y] = available_value_list[i];
				break;
			}
		}
		/*
		console.log(count);
		console.log("X: "+x+" Y: "+y);
		console.log(available_value_list);
		console.log(sudoku_table);
		*/
		if(satisfied) count+=1; // run next;
		else 
		{
			value_list_index[count] = 0;
			count-=1;
		}
	}
}

/*
	solve world hardest sudoku
*/
var world_hardest_sudoku = 
[
	[8,0,0,0,0,0,0,0,0],
	[0,0,3,6,0,0,0,0,0],
	[0,7,0,0,9,0,2,0,0],
	[0,5,0,0,0,7,0,0,0],
	[0,0,0,0,4,5,7,0,0],
	[0,0,0,1,0,0,0,3,0],
	[0,0,1,0,0,0,0,6,8],
	[0,0,8,5,0,0,0,1,0],
	[0,9,0,0,0,0,4,0,0]
]
/*
console.log(generate_random_sudoku(9));
console.log(solve_sudoku(world_hardest_sudoku));
*/



