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
	3*3
	在3*3中随机选取四个数并且付值1～9

	used to generate random sudoku table
*/
var generate_random_sudoku = function(n)
{
	var empty_sudoku_table = generate_empty_sudoku(9);
	/*

		start from left-top corner
		(0,0) (3,0) (6,0)
		(0,3) (3,3) (6,3)
		(0,6) (3,6) (6,6)
		
	*/
	for(var a = 0; a <= 6; a=a+3)
	{
		for(var b = 0; b <= 6; b=b+3)
		{
			// a b is the left-top corner
			var saved_x = []; // save x coord
			var saved_y = []; // save y coord
			var saved = []; // choose 4 different numbers
			while(saved_x.length!==4){
				var x = Math.floor(Math.random()*3);
				var y = Math.floor(Math.random()*3);
				var find_same = false;
				for(var i = 0; i < saved_x.length; i++)
				{
					if(saved_x[i] === x && saved_y[i] == y)
					{
						find_same = true; // find same coord
						break;
					}
				}
				if(find_same) continue;
				saved_x.push(x);
				saved_y.push(y);
				
				while(true)
				{
					var num = Math.floor(Math.random()*9+1)
					if (saved.indexOf(num)!==-1) continue;
					if (have_repetition(empty_sudoku_table, a+x, b+y, num))
					{
						continue;
					}
					saved.push(num);
					empty_sudoku_table[a+x][b+y] = num; // save num to sudoku table
					break;
				}
			}
		}
	}
	return empty_sudoku_table
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


var test = [ 
	[5,3,0,6,7,8,9,1,2],
	[6,0,2,1,9,5,3,4,8],
	[1,9,8,0,4,2,5,6,7],
	[8,5,9,7,0,1,0,2,3],
	[4,2,6,8,5,3,7,9,1],
	[7,1,3,9,0,4,0,5,6],
	[9,6,0,5,3,7,2,8,4],
	[2,8,0,4,0,9,6,3,5],
	[3,4,5,2,8,0,1,7,9]
];
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
var world_hardest_sudoku2 = 
[
	[0,0,0,0,4,1,8,9,0],
	[0,0,4,0,0,0,0,0,0],
	[0,0,2,5,9,0,0,0,0],
	[0,5,0,4,0,0,6,0,0],
	[0,0,0,0,1,0,0,0,8],
	[0,8,0,0,0,0,4,5,0],
	[0,0,5,7,0,0,0,0,0],
	[0,0,6,0,0,0,0,4,0],
	[0,9,0,3,6,0,1,0,0]
]
var t = 
[
	[4,3,2,1,0,0,0,0,9],							
	[0,0,0,0,9,0,0,3,4],			
	[0,0,0,3,7,0,2,0,0],		
	[1,0,0,0,2,5,0,8,0],		
	[0,2,7,0,0,0,9,6,0],		
	[0,5,0,6,3,0,0,0,1],		
	[0,0,6,0,8,9,0,0,0],
	[2,9,0,0,4,0,0,0,0],
	[7,0,0,0,0,1,5,9,8]					
]

var t2 = 
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

var t3 = 
[
	[1,0,0,0],
	[0,0,3,1],
	[2,4,1,3],
	[3,1,4,2]
]

// console.log(get_available_value_list(world_hardest_sudoku2, 1, 1));

// console.log(correct_sudoku(test))
// var test_soduku = generate_random_sudoku();
// console.log(test_soduku);
console.log(solve_sudoku(t2));




