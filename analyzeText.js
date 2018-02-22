var count = 0;
var keyReplacements;
keywordMatching = () => {
    var keywords = WORDS.words.map((word) => word.keyword);
    var keywordMatches = getKeywordMatches(keywords);
    keyReplacements = getKeyReplacements(keywordMatches,keywords);
    if(keywordMatches !== null) {
        keywordMatches.forEach((matchedWord) => {
            $("#popupMessage").html(function(_, html) {
                //Changes the CSS class if the keyword is bad
                let warningMessage = WORDS.words[keywords.indexOf(matchedWord.toLowerCase())].message;
                let id = "warningId"+count;
                let returnValue = html.replace(new RegExp("\\b"+matchedWord+"(?!</span>)\\b", "i"), `<span id= "${id}" class="warning">${removeCode(matchedWord)}</span>`);
                count++;
                return returnValue;
            });
        });
    }
    return keyReplacements;
}

registerKeywordListeners = (keyReplacements) => {
    for(var x = 0; x<keyReplacements.length; x++){
        let kw = WORDS.words.map((word) => word.keyword);
        let km = getKeywordMatches(kw);
        let tooltip = WORDS.words[kw.indexOf(km[x].toLowerCase())].message;
        $("#warningId"+x).attr('title', tooltip);
        document.getElementById("warningId"+x).addEventListener("dblclick", trackAcceptChange);
        document.getElementById("warningId"+x).addEventListener("dblclick", function(){
            this.innerHTML=keyReplacements[parseInt(this.id.replace("warningId", ""))];
            this.classList.remove("warning");
            this.removeAttribute("title");
        });
    }
    document.getElementById("allChange").addEventListener("click", AcceptAllChanges);
}

function prepareForCopy(str){
	return removeBeginningWhiteSpace(formatLineBreaks(str, "\n"));
}

function prepareForDisplay(str, lineBreak, exclusions){
	return removeBeginningBr(formatLineBreaks(str, lineBreak, exclusions));
}

function formatLineBreaks(str, lineBreak, exclusions){
	var removeNewLines = str.replace(/\r?\n|\r/g, "");
	var removeDivDiv = removeNewLines.replace(/<div><div>/g, lineBreak);
	var removeDiv = removeDivDiv.replace(/<div><\/div>/g, "").replace(/<div>(<br>)?/g, lineBreak);
	var removeP = removeDiv.replace(/<p><\/p>/g, "").replace(/<\/p>/g, lineBreak);
	var removeBr = removeP.replace(/<br>/g, lineBreak);
	return removeCode(removeBr, exclusions).replace(/&nbsp;/g, "");
}

function removeBeginningBr(str){
	return str.replace(/^(<br>)*/, "");
}

function removeBeginningWhiteSpace(str){
	return str.replace(/^\s/, "");
}

function removeCode(str, exclusions){
	if(exclusions == null){
		return str.replace(/<[^>]*>/g, "");
	}
	var pattern = "<(?!" + exclusions.join(")[^>]*>|<(?!") + ")[^>]*>";
	return str.replace(new RegExp(pattern, "g"), "");
}

AcceptAllChanges = () => {    
    var keywords = WORDS.words.map((word) => word.keyword);
    var matches = getKeywordMatches(keywords);
    var replacements = keyReplacements;
    for(var x = 0;x<replacements.length; x++){
        var element = document.getElementById("warningId"+x)
        element.innerHTML=replacements[parseInt(element.id.replace("warningId", ""))];
        element.classList.remove("warning");
        element.removeAttribute("title"); 
    }
}

getKeywordMatches = (keywords)=>{
    var inputString = $("#popupMessage").html().toString();
    //Creates regular expression that matches the json keywords
    var keywordMatcher = new RegExp(`(\\b${keywords.join("\\b)|(\\b")}\\b)`, "gi");
    var keywordMatches = inputString.match(keywordMatcher);
	if(keywordMatches == null){
		return [];
	}
    return keywordMatches;
}

getKeyReplacements = (keywordMatches, keywords)=>{
    return keywordMatches.map((word)=>WORDS.words[keywords.indexOf(word.toLowerCase())].replacement);
}