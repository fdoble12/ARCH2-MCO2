$(document).ready(() => {
    const MEM_ACCESS = 10;
	const CAC_ACCESS = 1;
	var   MISS_PENALTY;
	
	var cacheMemory;
	var mainMemory;
	var cacheBlock;
	var mainMemValues;
	
	var tagLength;
	var blkLength;
	var wrdLength;
	
	var HIT  = 0;
	var MISS = 0;
	
	var HIT_RATE;
	var MISS_RATE;
	var AMAT;
	var TMAT;
	
	function drawBlockTable(blkTable) {
		var table = $('<table>');
		var tr_h = $('<tr>');
		var th_blk = $('<th>');
		var th_dat = $('<th>');
		
		th_blk.text("Block");
		th_dat.text("Data");
		
		tr_h.append(th_blk);
		tr_h.append(th_dat);
		table.append(tr_h);
		
		for(var i = 0; i < blkTable.length; i++) {
			var tr = $('<tr>');
			var td_blk = $('<td>');
			var td_dat = $('<td>');
			var data = "";
			
			for(var j = 0; j < blkTable[i].length; j++) {
				data += blkTable[i][j].toString();
				if(j + 1 != blkTable[i].length)
					data += ", ";
			}
			console.log(data);
			td_blk.append(i);
			td_dat.append(data);
			tr.append(td_blk);
			tr.append(td_dat);
			table.append(tr);
		}
		$('#table-display').append(table);
	}
	
	function drawWordTable(wrdTable) {
		var table = $('<table>');
		var tr_h = $('<tr>');
		var th_blk = $('<th>');
		var th_dat = $('<th>');
		
		th_blk.text("Block");
		th_dat.text("Data");
		
		tr_h.append(th_blk);
		tr_h.append(th_dat);
		table.append(tr_h);
		
		for(var i = 0; i < wrdTable.length; i++) {
			var tr = $('<tr>');
			var td_blk = $('<td>');
			var td_dat = $('<td>');
			var data = "";

			td_blk.attr('rowspan', Math.log2(cacheMemory));
			td_blk.append(i);
			tr.append(td_blk);
			
			for(var j = 0; j < Math.log2(cacheMemory); j++) {
				if(j == 0) {
					if(wrdTable[i].length != 0)
						td_dat.append(wrdTable[i][j]);
					else
						td_dat.append("-");
						
					tr.append(td_dat);
					table.append(tr);
				} else if(j < wrdTable[i].length) {
					var tr_dat = $('<tr>');
					var td_dat_single = $('<td>');
					
					td_dat_single.append(wrdTable[i][j].toString());
					tr_dat.append(td_dat_single);
					table.append(tr_dat);
				} else {
					var tr_dat = $('<tr>');
					var td_dat_single = $('<td>');
					
					td_dat_single.append("-");
					tr_dat.append(td_dat_single);
					table.append(tr_dat);
				}
			}			
		}
		$('#table-display').append(table);
	}
	
	function displayResults() {
		var results = $('#results-display');
		results.empty();

		var ch = $('<div>');
		var cm = $('<div>');
		var mp = $('<div>'); //Miss Penalty
		var amat = $('<div>'); // Average Memory Access Time
		var tmat = $('<div>'); // Total Memory Access Time
		
		HIT_RATE = HIT / mainMemValues.length;
		MISS_RATE = MISS / mainMemValues.length;
		MISS_PENALTY = CAC_ACCESS + (MEM_ACCESS * Math.log2(cacheMemory)) + CAC_ACCESS;
		AMAT = (HIT_RATE * CAC_ACCESS) + (MISS_RATE * MISS_PENALTY);
		TMAT = (HIT * CAC_ACCESS * 2) + (MISS * MISS_PENALTY) + (MISS * CAC_ACCESS);
		
		ch.append("Cache Hit: " + HIT + " / " + mainMemValues.length);
		cm.append("Cache Miss: " + MISS + " / " + mainMemValues.length);
		mp.append("Miss Penalty: " + MISS_PENALTY + " nanoseconds");
		amat.append("Average Memory Access Time: " + AMAT + " nanoseconds");
		tmat.append("Total Memory Access Time: " + TMAT + " nanoseconds");
		
		$('#results-display').append(ch);
		$('#results-display').append(cm);
		$('#results-display').append(mp);
		$('#results-display').append(amat);
		$('#results-display').append(tmat);
	}
	
	function blockDM() {
		var blockTable = [];
		var result;
		var i, j;
		
		for(j = 0; j < cacheBlock; j++)
			blockTable[j] = [];
			
		for(i = 0; i < mainMemValues.length; i++) {
			result = mainMemValues[i] % cacheBlock;
			
			if(blockTable[result].length == 1 && blockTable[result][0] == mainMemValues[i])
				HIT++;
			else {
				blockTable[result][0] = mainMemValues[i];
				MISS++;
			}
		}
		
		drawBlockTable(blockTable);
		displayResults();
	}
	
	function computeAddress() {
		blkLength = Math.log2(cacheBlock); // 2
		wrdLength = Math.log2(Math.log2(cacheMemory)); // 2
		tagLength = Math.log2(mainMemory) - blkLength - wrdLength; //4
	}
	
	function Bin_To_Dec(num) {
		var nDec = 0;
		var nTwo = 1;
		
		while (num > 0) {
			
			if(num % 2 != 0)
				nDec += nTwo;
			
			nTwo *= 2;
			num = Math.floor(num / 10);
		}
		
		return nDec;
	}
	
	function Dec_To_BinArr(num) {		
		var bNum = 0;
		var nTen = 1;
		
		while (num > 0) {
			if(num % 2 != 0)
				bNum += nTen;
			nTen *= 10;
			num = Math.floor(num / 2);
		}
		
		return appendZero(bNum.toString().split(''));
	}
	
	function appendZero(num) {
		while(num.length < tagLength + blkLength + wrdLength)
			num.splice(0, 0, '0').join();
		return num;
	}
	
	function wordDM() {
		var wordTable = [];
		var wordIndex = [];
		var result;
		var bin_mem;
		var blk_res;
		var blk_bit = "";
		var i, j;
		
		for(j = 0; j < cacheBlock; j++) {
			wordTable[j] = [];
			wordIndex[j] = 0;
		}
		
		computeAddress();
		
		for(i = 0; i < mainMemValues.length; i++) {
			blk_bit = "";
			bin_mem = Dec_To_BinArr(mainMemValues[i]);
			
			for(j = tagLength; j < tagLength + blkLength; j++)
				blk_bit += bin_mem[j];
			
			blk_res = Bin_To_Dec(parseInt(blk_bit));

			if(wordTable[blk_res].includes(mainMemValues[i]))
				HIT++;
			else MISS++;
			
			if(wordTable[blk_res].length < Math.log2(cacheMemory)) {
				wordTable[blk_res].push(mainMemValues[i]);
				wordIndex[blk_res] += 1;
			} else {
				wordIndex[blk_res] %= cacheBlock;
				wordTable[blk_res] = mainMemValues[i];
				wordIndex[blk_res] += 1;
			}
		}
		
		drawWordTable(wordTable);
		displayResults();
	}
	
	function checkCompatibility(cmSize, mmSize, cbSize, mmvArr) {
		const mode = $('#ProgMode').val();
		
		var errFree = true;
		if(mode == 'block') {
			if(cmSize != cbSize) {
				$(".error").text('[BLOCK] Cache Memory and Cache Block Sizes are unequal.');
				$(".error").attr('style', 'color:red;');
				errFree = false;
			}
		} else if(mode == 'word') {
			if(Math.pow(2, cbSize) != cmSize) {
				$(".error").text('[WORD] Cache Block Size and Cache Memory Size are incompatible');
				$(".error").attr('style', 'color:red;');
				errFree = false;
			} else if(Math.log2(mmSize) % 1 !== 0) {
				$(".error").text('[WORD] Main Memory is not a power of 2.');
				$(".error").attr('style', 'color:red;');
				errFree = false;
			}
		}
		
		if(errFree)
			console.log("compatible values");
			
		return errFree;
	}
	
	// check if input is a positive number,
	// before checking compatibility
	function isValidValues(cmSize, mmSize, cbSize, mmVals) {
		 var cm = parseInt(cmSize);
		 var mm = parseInt(mmSize);
		 var cb = parseInt(cbSize);
		 var mmv = mmVals.split('\n');
		 var errFree = true;

		 if(isNaN(cm) || cm <= 0) {
			$(".error").text('Cache Memory Size should be a positive number');
			$(".error").attr('style', 'color:red;');
			errFree = false;
		 } else if(isNaN(mm) || mm <= 0) {
			$(".error").text('Main Memory Size should be a positive number');
			$(".error").attr('style', 'color:red;');
			errFree = false;
		 } else if(isNaN(cb) || cb <= 0) {
			$(".error").text('Cache Block Size should be a positive number');
			$(".error").attr('style', 'color:red;');
			errFree = false;
		 } else if(cm > 0 && mm > 0 && cb > 0) {
			mmv.forEach((i) => {
				if(!isNaN(i) && (i < 0 || i >= mm)) {
					$(".error").text('Main Memory Values should be from range 0 to ' + (mm - 1));
					$(".error").attr('style', 'color:red;');
					errFree = false;
				}
			});
			 
			console.log("values are positive numbers");
			if(errFree && checkCompatibility(cm, mm, cb, mmv)) {
				cacheMemory = cm;
				mainMemory = mm;
				cacheBlock = cb;
				mainMemValues = mmv;
				return true;
			}
			else return false;
		 }
	}
	
	
    // Get inputs
    $('#btn-start').on('click', function() {
        const cacheMemory = $('#CacheMemory').val();
        const mainMemory = $('#MainMemory').val();
        const cacheBlock = $('#CacheBlock').val();
        const progMode = $('#ProgMode').val();
        const mmVals = $('#MMVals').val();
		
		var errFree = false;

		
            if (cacheMemory === '') {
				 $(".error").text('Please enter Cache Memory Size');
				 $(".error").attr('style', 'color:red;');
            } else if (mainMemory === '') {
                 $(".error").text('Please enter Main Memory Size');
				 $(".error").attr('style', 'color:red;');
            } else if (cacheBlock === '') {
                 $(".error").text('Please enter Cache Block Size');
				 $(".error").attr('style', 'color:red;');
            } else if (mmVals === '') {
                 $(".error").text('Please enter Main Memory Values');
				 $(".error").attr('style', 'color:red;');
            } else if (cacheMemory !== '' && mainMemory !== '' && cacheBlock !== '' && mmVals !== '') {
				 $(".error").text('');
				 console.log("no empty space");
				if(isValidValues(cacheMemory, mainMemory, cacheBlock, mmVals)) {
					// clearInputs();
					$('#table-display').empty();
					if(progMode === "block")
						blockDM();
					else
						wordDM();
				}
			}
    });

	function clearInputs() {
		$('#CacheMemory').val('');
		$('#MainMemory').val('');
		$('#CacheBlock').val('');
		$('#MMVals').val('');
		var table  = $('#table-display');
		var results = $('#results-display');

		results.empty();
  		table.empty();
		
		
		HIT = 0;
		MISS = 0;
		MISS_PENALTY = 0;
		AMAT = 0;
		TMAT = 0;
	}
	
	$('#btn-clear').click(() => {
		clearInputs();
	});

	/*$("#btn-dl").click(() => {
		results = "OUTPUTS:\n" + "Cache Hit: " + hit + '\n' + "Cache Miss: " + miss 
		+ '\n' + "Miss Penalty: " + missPenalty + "ns" + '\n' + "Average Memory Access Time: " + aveAccTime 
		+ "ns" + '\n' + "Total Memory Access Time: " + totalAccessTime + "ns" + '\n' + "Cache Memory: " + cbRec;
				  
		const blob = new Blob([results], {type:"text/plain"});
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "Results.txt";
		link.href = href;
		link.click();
		URL.revokeObjectURL(href);
	});*/

	var blockTbForTxt = "Block : Data"

	for(j = 0; j < cacheBlock; j++)
			{
				let txtToAppend = "\n"+ j + " : "+blockTable[j][0]	
				blockTbForTxt = blockTbForTxt + txtToAppend
			}

	$("#btn-dl").click(function () {
		results = "OUTPUTS:\n" + "Cache Hit: " + HIT + '\n' + "Cache Miss: " + MISS 
		+ '\n' + "Miss Penalty: " + MISS_PENALTY + "ns" + '\n' + "Average Memory Access Time: " + AMAT 
		+ "ns" + '\n' + "Total Memory Access Time: " + TMAT + "ns" + '\n' + "Cache Memory: " + blockTbForTxt;
				
		const blob = new Blob([results], {type:"text/plain"});
		const href = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = "results.txt";
		link.href = href;
		link.click();
		URL.revokeObjectURL(href);
	});
	  
	
	$('#MMVals').text('');

	
});