var globalPercentWidth = 27;
var globalPercentHeight = 80;
var globalPercentLeft = 35;
var globalContentHeight = 95;
var globalPageTop = 10;

function zoomIn()
{
	if(globalPageTop <= 2.5)
	{
	;
	}
	else
	{
		globalPercentWidth = globalPercentWidth + 5;
		var percentWidth = globalPercentWidth + "%";	
		$("#page").css("width", percentWidth);
		
		globalPercentHeight = globalPercentHeight + 5;
		var percentHeight = globalPercentHeight + "%";
		$("#page").css("height", percentHeight);
		
		globalPercentLeft = globalPercentLeft - 2.5;
		var percentLeft = globalPercentLeft + "%";
		$("#page").css("left", percentLeft);
		
		globalContentHeight = globalContentHeight + 5;
		var percentContent = globalContentHeight + "%";
		$("#content").css("height", percentContent);

		globalPageTop = globalPageTop - 5 ;
		var percentPageTop = globalPageTop + "%";
		$("#page").css("top", percentPageTop);
	}
}

function zoomOut()
{
	if(globalPageTop >= 10)
	{
	;
	}
	else
	{
		globalPercentWidth = globalPercentWidth - 5;
		var percentWidth = globalPercentWidth + "%";	
		$("#page").css("width", percentWidth);
		globalPercentHeight = globalPercentHeight - 5;
		var percentHeight = globalPercentHeight + "%";
		$("#page").css("height", percentHeight);
		globalPercentLeft = globalPercentLeft + 2.5;
		var percentLeft = globalPercentLeft + "%";
		$("#page").css("left", percentLeft);
		globalContentHeight = globalContentHeight - 5;
		var percentContent = globalContentHeight + "%";
		$("#content").css("height", percentContent);
		
		
		globalPageTop = globalPageTop + 5;
		var percentPageTop = globalPageTop + "%";
		$("#page").css("top", percentPageTop);
	}
}




function printer()
{
	$("#page").css("width", "27%");
	$("#page").css("height", "80%");
	$("#page").css("left", "35%");
	$("#content").css("height", "100%");
	$("#page").css("top", "10%");
	
}