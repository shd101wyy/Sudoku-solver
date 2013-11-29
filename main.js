/*
	used to generate sudoku
	9*9
	with all values = 0
*/
var generate_empty_sudoku = function()
{
	var output = [];
	for(var i = 0; i < 9; i++)
	{
		output.push([]);
		for(var j = 0; j < 9; j++)
		{
			output[i].push(0);
		}
	}
	return output;
}
/*
	3*3
	在3*3中随机选取四个数并且付值1～9

	used to generate random sudoku table
*/
var generate_random_sudoku = function()
{
	var empty_sudoku_table = generate_empty_sudoku();
	var have_repetition = function(sudoku_table, i, j, num)
	{
		/* check row */
		for(var a = 0; a < i; a++)
		{
			if(sudoku_table[a][j] === num)
				return true
		}
		/* check col */
		for(var a = 0; a < j; a++)
		{
			if(sudoku_table[i][a] === num)
				return true;
		}
		/*
			check inside 3*3
		*/
		/*
		var start_i = parseInt(i/3)*3;
		var start_j = parseInt(j/3)*3;
		for(var a = start_i; a < start_i+3; a++)
		{
			for(var b = start_j; b < start_j+3; b++)
			{
				if((a!==i && b!==j) && sudoku_table[a][b] === sudoku_table[i][j])
					return true;
			}
		}*/
		return false;
	}
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
/*
	CHECK WHETHER SUDOKU TABLE IS CORRECT
	Only check rows and cols
*/
var correct_sudoku = function(sudoku_table)
{
	// check row
	for(var i = 0; i < 9; i++)
	{
		var table = {}; // length 9 table
		for(var a = 0; a < 9; a++)
		{
			table[a+1] = false;
		}
		for(var j = 0; j < 9; j++)
		{
			var num = sudoku_table[i][j];
			if(table[num] == true)
				return false
			else
				table[num] = true;
		}
	}
	// check col
	// check row
	for(var i = 0; i < 9; i++)
	{
		var table = {}; // length 9 table
		for(var a = 0; a < 9; a++)
		{
			table[a+1] = false;
		}
		for(var j = 0; j < 9; j++)
		{
			var num = sudoku_table[j][i];
			if(table[num] == true)
				return false
			else
				table[num] = true;
		}
	}
	return true;
}

/*
	try one by one
*/
var solve_sudoku = function(sudoku_table)
{
	/*
		return
		0: numbers need to fill
		1: need to fill x coord
		2: need to fill y coord
	*/
	var return_3_to_3_table_information = function(sudoku_table, left_top_x, left_top_y)
	{
		/*
			get number that need to fill
		*/
		var numbers_need_to_fill = [];
		var number_already_filled = [];
		var need_to_fill_x_coord = [];
		var need_to_fill_y_coord = [];
		for(var i = left_top_x; i < left_top_x+3; i++)
		{
			for(var j = left_top_y; j < left_top_y+3; j++)
			{
				if(sudoku_table[i][j]!==0)
				{
					number_already_filled.push(sudoku_table[i][j])
				}
				else
				{
					need_to_fill_x_coord.push(i);
					need_to_fill_y_coord.push(j);
				}
			}
		}
		for(var i = 1; i<=9; i++)
		{
			if(number_already_filled.indexOf(i) == -1)
				numbers_need_to_fill.push(i);
		}
		return [numbers_need_to_fill, need_to_fill_x_coord, need_to_fill_y_coord]
	}
	/*
		get 3*3 table information
	*/
	var information_list = []; // its length should be 9
	for(var a = 0; a <= 6; a=a+3)
	{
		for(var b = 0; b <= 6; b=b+3)
		{
			var information = return_3_to_3_table_information(sudoku_table, a, b);
			information_list.push(information);
		}
	}
	var numbers_need_to_fill_list = [];
	var x_coord = [];
	var y_coord = [];
	for(var i = 0; i < information_list.length; i++)
	{
		numbers_need_to_fill_list.push(information_list[i][0]);
		x_coord.push(information_list[i][1]);
		y_coord.push(information_list[i][2]);
	}
	/* 
		check combinations
	*/
	var combinations = [];
	var combinations_length_list = [];
	for(var i = 0; i < numbers_need_to_fill_list.length; i++)
	{
		var c = generate_all_possible_combination(numbers_need_to_fill_list[i])
		combinations.push(c);
		combinations_length_list.push(c.length); // attention: here is length not length-1
	}

	// COUNT combibations
	var count = 1;
	for(var i = 0; i < combinations_length_list.length; i++)
	{
		count*=combinations_length_list[i];
	}
	console.log(count);
	return "TRUE";
	// console.log(combinations);
	
	for(var a0 = 0; a0<combinations[0].length; a0++)
	{
		for(var a1 = 0; a1<combinations[1].length; a1++)
		{
			for(var a2 = 0; a2<combinations[2].length; a2++)
			{
				for(var a3 = 0; a3<combinations[3].length; a3++)
				{
					for(var a4=0; a4<combinations[4].length; a4++)
					{
						for(var a5=0; a5<combinations[5].length; a5++)
						{
							for(var a6=0; a6<combinations[6].length; a6++)
							{
								for(var a7=0; a7<combinations[7].length; a7++)
								{
									for(var a8=0; a8<combinations[8].length; a8++)
									{
										var l0 = combinations[0][a0];
										var l1 = combinations[1][a1];
										var l2 = combinations[2][a2];
										var l3 = combinations[3][a3];
										var l4 = combinations[4][a4];
										var l5 = combinations[5][a5];
										var l6 = combinations[6][a6];
										var l7 = combinations[7][a7];
										var l8 = combinations[8][a8];
										var c = [l0, l1, l2, l3, l4, l5, l6, l7, l8];
										for(var i = 0; i < 9; i++)
										{
											xs = x_coord[i];
											ys = y_coord[i];
											for(var j = 0; j < xs.length; j++)
											{
												x = xs[j];
												y = ys[j];
												sudoku_table[x][y] = c[i][j];
											}
										}
										// console.log("Enter Here")
										console.log(sudoku_table);
										if(correct_sudoku(sudoku_table))
										{
											console.log("PASS");
											return "PASS"
										}

									}
								}
							}
						}
					}
				}
			}
		}
	}
}
/*
var test = [ 
	[5,3,4,6,7,8,9,1,2],
	[6,7,2,1,9,5,3,4,8],
	[1,9,8,3,4,2,5,6,7],
	[8,5,9,7,6,1,4,2,3],
	[4,2,6,8,5,3,7,9,1],
	[7,1,3,9,2,4,8,5,6],
	[9,6,1,5,3,7,2,8,4],
	[2,8,7,4,1,9,6,3,5],
	[3,4,5,2,8,6,1,7,9]
];*/
// console.log(correct_sudoku(test))
var test_soduku = generate_random_sudoku();
console.log(test_soduku);
solve_sudoku(test_soduku);




