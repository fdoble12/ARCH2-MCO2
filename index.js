$(document).ready(()=>{
    var cmSize
    var cmMode
   
    var cbSize //This is in words

    var mmSize

    var progSeq
    var progMode
    var mmTime
    var cmTime
    var mmMode


    var mmTime
    var cmTime

    function directMapping(){
        if(progMode == 'block'){
            let cacheBlock  = {};
            let miss = 0
            let hit = 0
            let seqLength = 0 
            let missPenalty = 0
            let hitRate = 0
            let missRate = 0 
            
            for(i = 0; i< cmSize; i++){
                cacheBlock[i] = []
            }

            progSeq.forEach((curr) => {
                let val = parseInt(curr)
                let destBlock = val % cmSize

                if(cacheBlock[destBlock].pop() == val){
                    hit++
                }else{
                    miss++
                }
                cacheBlock[destBlock].push(val)
                seqLength++
            })

            /** DISPLAY */
            var cMiss = $("#CacheMiss");
            var cHit = $("#CacheHit");
            

            console.log(cacheBlock)

            
            let cbRec ="\nBlock : Data \n"
            for(i = 0; i < cmSize; i++){
                $('#cacheBlock').append("<div>"+"Block "+i+": "+cacheBlock[i.toString()]+"</div>")
                cbRec+=i+": \t"+cacheBlock[i.toString()]+'\n'
            }
           

            console.log('Miss: '+ miss)
                cMiss.text("Cache Miss:  " + miss)

            console.log('Hit: '+ hit)
                cHit.text("Cache Hit:  " + hit)

            hitRate = hit/seqLength
            missRate = miss/seqLength

            missPenalty = (cmTime*2) + (mmTime * cbSize)

            let aveAccTime = (hitRate * cmTime) + (missRate * missPenalty)

            let totalAccessTime = (hit * 2 * cmTime) + (miss * 2 *(mmTime+1)) + (miss * cmTime)

            /** DISPLAY */

            var aveAT = $("#Ave-AT");
            var totAT = $("#Tot-AT");        

            console.log(mmTime+1)

            var mP = $("#MissPenalty")
                mP.text("Miss penalty: "+missPenalty)
            console.log("Ave: "+aveAccTime)
                aveAT.text("Average Memory Access Time:  "+ aveAccTime)

            console.log("total Acc: "+ totalAccessTime)
                totAT.text("Total Memory Access Time:  "+ totalAccessTime)
            
            
            $("#btn-dl").click(function () {
                results = "OUTPUTS:\n" + "Cache Hit: " + hit + '\n' + "Cache Miss: " + miss 
                + '\n' + "Miss Penalty: " + missPenalty + "ns" + '\n' + "Average Memory Access Time: " + aveAccTime 
                + "ns" + '\n' + "Total Memory Access Time: " + totalAccessTime + "ns" + '\n' + "Cache Memory: " + cbRec;
                          
                const blob = new Blob([results], {type:"text/plain"});
                const href = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = "results.txt";
                link.href = href;
                link.click();
                URL.revokeObjectURL(href);
            });

        }else{
            if(cmMode == 'block' && mmMode == 'word'){
                let mmBits = getBits(mmSize) // MM memory to bits
                let w= getBits(cbSize) //block size to bits
                let b = getBits(cmSize) //cache mem to bits
                let tag = mmBits - w - b
                let hit = 0
                let miss = 0
                let seqLength = 0
                let missPenalty = 0
                let hitRate = 0
                let missRate = 0
                let cacheBlock = {};
                for(i = 0; i< cmSize; i++){
                    cacheBlock[i] = []
                }
                console.log(progSeq)
                progSeq.forEach((curr)=>{
                    
                    if(curr.length != mmBits)
                    {
                        //TODO place error in front end. "Input correct number of bits"
                        console.log('Wrong num of bits')
                    }
                    else{
                        let decVal = parseInt(curr, 2)
                        let blockNum = curr.substring(tag, (tag+b))
                        console.log(blockNum)
                        let blockNumInt = parseInt(blockNum, 2)
                        console.log(blockNumInt)

                        let destBlock = blockNumInt % cmSize
                        if(cacheBlock[destBlock].pop() == decVal)
                        {
                            hit++
                        }
                        else{
                            miss++
                        }
                        cacheBlock[destBlock].push(decVal)
                        seqLength++
                    }
                })
                hitRate = hit/seqLength
                missRate = miss/seqLength
                missPenalty = (cmTime*2) + (mmTime * cbSize)

                let aveAccTime = (hitRate * cmTime) + (missRate * missPenalty)

                let totalAccessTime = (hit * 2 * cmTime) + (miss * 2 *(mmTime+1)) + (miss * cmTime)
                var aveAT = $("#Ave-AT");
                var totAT = $("#Tot-AT");        
                var mP = $("#MissPenalty")
                mP.text("Miss penalty: "+ missPenalty)
                console.log("Ave: "+aveAccTime)
                    aveAT.text("Average Memory Access Time:  "+ aveAccTime)
    
                console.log("total Acc: "+ totalAccessTime)
                    totAT.text("Total Memory Access Time:  "+ totalAccessTime)
                    let cbRec ="\nBlock : Data \n"
                    for(i = 0; i < cmSize; i++){
                    $('#cacheBlock').append("<div>"+"Block "+i+": "+cacheBlock[i.toString()]+"</div>")
                    cbRec+=i+": \t"+cacheBlock[i.toString()]+'\n'
                }   
                $("#btn-dl").click(function () {
                    results = "OUTPUTS:\n" + "Cache Hit: " + hit + '\n' + "Cache Miss: " + miss 
                    + '\n' + "Miss Penalty: " + missPenalty + "ns" + '\n' + "Average Memory Access Time: " + aveAccTime 
                    + "ns" + '\n' + "Total Memory Access Time: " + totalAccessTime + "ns" + '\n' + "Cache Memory: " + cbRec;
                              
                    const blob = new Blob([results], {type:"text/plain"});
                    const href = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.download = "results.txt";
                    link.href = href;
                    link.click();
                    URL.revokeObjectURL(href);
                });
    
            }
        }

    }

    function getBits(num) {
        let n = 0;
        while (num > 1) {
            if (num % 2 == 0) {
                num = num / 2;
                n++;
            } else {
                return -1;
            }
        }
        return n;
    }
    
    function checkCompatibility(cmSize, mmSize, cbSize, progMode) {
		let modeVal = $('#ProgMode').val();

		var errFree = true;
        var errorDiv = $(".error");

		if(mmMode == 'block' && mmSize != 0) {
                mmSize = 0;
                mmMode = null;
                errorDiv.text('Main Memory Size is not required for Block Mode');
				errorDiv.attr('style', 'color:red;');

		} else if(modeVal == 'word') {

			if(Math.log(cmSize)/Math.log(2) % 1 === 0) {
				errorDiv.text('[WORD] Main Memory is not a power of 2.');
				errorDiv.attr('style', 'color:red;');
				errFree = false;
			}

		}
		return errFree;
	}


    function checkInput(){
        var errFree = true
        var errorDiv = $(".error");

        if (isNaN(cmSize) || cmSize <= 0) {
			errorDiv.text('Cache Memory Size should be a positive number');
			errorDiv.attr('style', 'color:red;');
			errFree = false;

        } else if(isNaN(cbSize) || cbSize <= 0) {
			errorDiv.text('Block Size should be a positive number');
			errorDiv.attr('style', 'color:red;');
			errFree = false;

		 } else if(isNaN(mmSize) || mmSize <= 0 && progMode!='block') {
			errorDiv.text('Main Memory Size should be a positive number');
			errorDiv.attr('style', 'color:red;');
			errFree = false;
            console.log("BLOCK " + cbSize)

		 } else if(isNaN(cmTime) || cmTime <= 0) {
			errorDiv.text('Cache Access Time should be a positive number');
			errorDiv.attr('style', 'color:red;');
			errFree = false;

		 } else if(isNaN(mmTime) || mmTime <= 0) {
			errorDiv.text('Memory Access Time should be a positive number');
			errorDiv.attr('style', 'color:red;');
			errFree = false;

		 } else if(cmSize > 0 && mmSize > 0 && cbSize > 0 && cmTime > 0 && mmTime > 0) {
			progSeq.forEach((i) => {
				if(!isNaN(i) && i < 0) {
					errorDiv.text('Program Sequence Values should be a positive number');
					errorDiv.attr('style', 'color:red;');
					errFree = false;
				}
			});
			 
			if(errFree && checkCompatibility())
				return true;
			else return false;
		 }
    }

    $('#btn-start').on('click', function() {
        cmSize= parseInt($('#CacheMemory').val());
        cmMode= $('#Cache-Mode').val();

        cbSize= parseInt($('#BlockSize').val());

        mmSize= parseInt($('#MM-Size').val());
        mmMode = $('#Mem-Mode').val();

        progSeq = $('#ProgSeq').val().split(',');
        progMode = $('#ProgMode').val();


        mmTime = parseInt($('#MemTime').val());
        cmTime= parseInt($('#CacheTime').val());
        
        
		//console.log("BLOCK " + cbSize)

		
        // Null error
        var errorDiv = $(".error");
		
            if (isNaN(cmSize)) {
				errorDiv.text('Please enter Cache Memory Size');
				errorDiv.attr('style', 'color:red;');

            } else if (isNaN(cbSize)) {
                errorDiv.text('Please enter Block Size');
				errorDiv.attr('style', 'color:red;');

            } else if (isNaN(mmSize) && progMode != 'block') {
                errorDiv.text('Please enter Main Memory Size');
				errorDiv.attr('style', 'color:red;');

            } else if (isNaN(cmTime)) {
                errorDiv.text('Please enter Cache Access Time');
				errorDiv.attr('style', 'color:red;');

            } else if (isNaN(mmTime)) {
                errorDiv.text('Please enter Memory Access Time');
				errorDiv.attr('style', 'color:red;');

            } else if (cmSize !== '' && cbSize !== '' && mmSize !== '' && progSeq !== '' && cmTime !== '' && mmTime !== '') {
				errorDiv.text('');
				if(checkInput()) {
					directMapping();
				}
			}
            //directMapping();
    });

    
    $('#btn-clear').on('click', function() {
        $('#CacheMemory').val("");
        $('#BlockSize').val("");
        $('#MM-Size').val("");
        $('#ProgSeq').val("");
        $('#CacheTime').val("");
        $('#MemTime').val("");
        
    });
    
})