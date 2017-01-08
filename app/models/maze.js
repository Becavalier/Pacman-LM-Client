import Ember from 'ember';

export default Ember.Object.extend({
	// x - columes, y - rows
	generate: function(scale) {
		let x = scale, y = scale;
		// Establish variables and starting grid
	    let totalCells = x * y;
	    let cells = [];
	    let unvis = [];
	    for (let i = 0; i < y; i++) {
	        cells[i] = [];
	        unvis[i] = [];
	        for (let j = 0; j < x; j++) {
	            cells[i][j] = [0, 0, 0, 0];
	            unvis[i][j] = true;
	        }
	    }
	    
	    // Set a random position to start from
	    let currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
	    let path = [currentCell];
	    unvis[currentCell[0]][currentCell[1]] = false;
	    let visited = 1;
	    
	    // Loop through all available cell positions
	    while (visited < totalCells) {
	        // Determine neighboring cells
	        let pot = [[currentCell[0] - 1, currentCell[1], 0, 2],
	                [currentCell[0], currentCell[1] + 1, 1, 3],
	                [currentCell[0] + 1, currentCell[1], 2, 0],
	                [currentCell[0], currentCell[1] - 1, 3, 1]];
	        let neighbors = [];
	        
	        // Determine if each neighboring cell is in game grid, and whether it has already been checked
	        for (let l = 0; l < 4; l ++) {
	            if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) { neighbors.push(pot[l]); }
	        }
	         
	        // If at least one active neighboring cell has been found
	        if (neighbors.length) {
	            // Choose one of the neighbors at random
	            let next = neighbors[Math.floor(Math.random() * neighbors.length)];
	            
	            // Remove the wall between the current cell and the chosen neighboring cell
	            cells[currentCell[0]][currentCell[1]][next[2]] = 1;
	            cells[next[0]][next[1]][next[3]] = 1;
	            
	            // Mark the neighbor as visited, and set it as the current cell
	            unvis[next[0]][next[1]] = false;
	            visited ++;
	            currentCell = [next[0], next[1]];
	            path.push(currentCell);
	        }
	        // Otherwise go back up a step and keep going
	        else {
	            currentCell = path.pop();
	        }
	    }

	    return this.transform(x, y, cells);
	},

	// Transform maze array to a proper format
	transform: function(columes, rows, cells) {
		let maps = [];
		for(let i = 0; i < 2 * columes - 1; i++) {
			maps[i] = [];
			for(let j = 0; j < 2 * rows - 1; j++) {
				maps[i][j] = 2;
			}
		} 

		cells.forEach(function(row, rowIndexInMaze) {
			row.forEach(function(item, itemIndexInRow) {

				let xIndex        = 2 * rowIndexInMaze;
				let yIndex        = 2 * itemIndexInRow;

				let topCellVal    = 1 - cells[rowIndexInMaze][itemIndexInRow][0];
				let rightCellVal  = 1 - cells[rowIndexInMaze][itemIndexInRow][1];
				let bottomCellVal = 1 - cells[rowIndexInMaze][itemIndexInRow][2];
				let leftCellVal   = 1 - cells[rowIndexInMaze][itemIndexInRow][3];

				if(rowIndexInMaze == 0 && itemIndexInRow == 0) {
					maps[xIndex][yIndex + 1] = rightCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;

					if(rightCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex + 1] = 1;
					}
				} 

				if(rowIndexInMaze == 0 && itemIndexInRow != 0 && itemIndexInRow != columes - 1) {
					maps[xIndex][yIndex - 1] = leftCellVal;
					maps[xIndex][yIndex + 1] = rightCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;

					if(rightCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex + 1] = 1;
					}

					if(leftCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex - 1] = 1;
					}
				}

				if(rowIndexInMaze == 1 && itemIndexInRow == columes - 1) {
					maps[xIndex][yIndex - 1] = leftCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;

					if(leftCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex - 1] = 1;
					}
				}

				if(rowIndexInMaze != 0 && rowIndexInMaze != rows - 1 && itemIndexInRow == columes - 1) {
					maps[xIndex - 1][yIndex] = topCellVal;
					maps[xIndex][yIndex - 1] = leftCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;

					if(leftCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex - 1] = 1;
					}

					if(leftCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex - 1] = 1;
					}
				}

				if(rowIndexInMaze == rows - 1 && itemIndexInRow == columes - 1) {
					maps[xIndex - 1][yIndex] = topCellVal;
					maps[xIndex][yIndex - 1] = leftCellVal;

					if(leftCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex - 1] = 1;
					}
				}

				if(rowIndexInMaze == rows - 1 && itemIndexInRow != 0 && itemIndexInRow != columes - 1) {
					maps[xIndex - 1][yIndex] = topCellVal;
					maps[xIndex][yIndex - 1] = leftCellVal;
					maps[xIndex][yIndex + 1] = rightCellVal;

					if(leftCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex - 1] = 1;
					}

					if(rightCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex + 1] = 1;
					}
				}

				if(rowIndexInMaze == rows - 1 && itemIndexInRow == 0) {
					maps[xIndex - 1][yIndex] = topCellVal;
					maps[xIndex][yIndex + 1] = rightCellVal;

					if(rightCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex + 1] = 1;
					}
				}

				if(rowIndexInMaze != 0 && rowIndexInMaze != rows - 1 && itemIndexInRow == 0) {
					maps[xIndex - 1][yIndex] = topCellVal;
					maps[xIndex][yIndex + 1] = rightCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;

					if(rightCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex + 1] = 1;
					}

					if(rightCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex + 1] = 1;
					}
				}

				if(rowIndexInMaze != 0 && rowIndexInMaze != rows - 1 && itemIndexInRow != 0 && itemIndexInRow != columes - 1) {
					maps[xIndex - 1][yIndex] = topCellVal; 
					maps[xIndex][yIndex + 1] = rightCellVal;
					maps[xIndex + 1][yIndex] = bottomCellVal;
					maps[xIndex][yIndex - 1] = leftCellVal;

					if(rightCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex + 1] = 1;
					}

					if(rightCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex + 1] = 1;
					}

					if(leftCellVal == 1 && topCellVal == 1) {
						maps[xIndex - 1][yIndex - 1] = 1;
					}

					if(leftCellVal == 1 && bottomCellVal == 1) {
						maps[xIndex + 1][yIndex - 1] = 1;
					}
				}

				// Clear the sign
				maps[xIndex][yIndex] = 0;
			});
		});
	
		// Repaint the rest area
		for(let i = 0; i < maps.length; i++) {
			for(let j = 0; j < maps[i].length; j++) {
				if(maps[i][j] == 2)
					maps[i][j] = 1;
			}
		} 

		return maps;
	}
});