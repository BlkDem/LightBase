	const idxCount = 10;
	const idxZone = 6;
	const idxPreset1 = 11;
	const idxPreset2 = 3;
	const idxBMx = 2;
	const idxRPM = 2;

	function updateTelemetry()
	{
		console.log("updating telemetry");
		loadParams(idxBMx, "Temperature", 0);
		loadParams(idxBMx, "Pressure", 0);
		loadParams(idxRPM, "rpmvalue", 0); //tacho
		setTimeout(updateTelemetry, 10000);
	}
		
	function addressChange(selector)
	{
		//rangeSetup(selector.substr(5), $('#'+selector).val());
		rangeSetup(selector.substr(5), document.querySelector('#'+selector).value);
		
	}

	function slideAddress(selector)
	{
		//$('#caption_'+selector).html($('#'+selector).val());
		document.querySelector('#caption_'+selector).innerHTML = document.querySelector('#'+selector).value;
		//console.log(document.querySelector('#'+selector).value);
	}

	function zoneControl(zone, value)
	{
		$.ajax({
		url: "/control?cmd=event," + zone + "=" + value + ",1",
		context: document.body
			}).done(function() {
					//$( this ).addClass( "done" );					
				});
	}
	
	function rangeSetup(zoneid, value)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', "/control?cmd=event,rangeSetup=" + zoneid + "," + value);
		xhr.send();
		xhr.onreadystatechange = function() {
			if (this.readyState != 4) return;
			console.log('request OK');
  // по окончании запроса доступны:
  // status, statusText
  // responseText, responseXML (при content-type: text/xml)

			if (this.status != 200) {
    // обработать ошибку
				alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
			return;
			}
			
			

  // получить результат из this.responseText или this.responseXML
		}
		
		/*$.ajax({
		//url: "/control?cmd=TaskValueSet,"+ idxCount + "," + zoneid + "," + value,
		url: "/control?cmd=event,rangeSetup=" + zoneid + "," + value,
		
		context: document.body
			}).done(function() {
					$('#caption_count'+zoneid).animate({opacity: 0}, 250);
					$('#caption_count'+zoneid).animate({opacity: 1}, 250);					
				});*/
	}

	function presetSetup(zone, dec, index)
	{
		$.ajax({
		url: "/control?cmd=event,preset=" + index + "," + zone + "," + dec,
		context: document.body
			}).done(function() {
				  console.log('preset'+index+' '+zone);
				});
	}
	
	function presetLoad(zone, dec)
	{
		$.ajax({
		url: "/control?cmd=event,presetLoad=" + zone + "," + dec,
		context: document.body
			}).done(function() {
				  console.log('load '+zone+' '+dec);
				});
	}

	
	function update(picker, selector) {
		document.querySelector(selector).style.background = picker.toBackground();
		var dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		var _zone = selector.substr(1);
		//console.log(dec+' '+selector);
		picker.hide();
		zoneControl(_zone, dec);
	}
	
	function updatePreset(picker, selector, index) {
		document.querySelector(selector).style.background = picker.toBackground();
		var dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		var _zone = selector.substr(13);		
		console.log(_zone);
		picker.hide();
		presetSetup(_zone, dec, index);
	}
	
	function zoneOff(selector)
	{
	    document.querySelector(selector).jscolor.fromRGBA(0,0,0,0);
	    zoneControl(selector.substr(1), 0);
	}
  
  
	function convertToHexColor(decArray){
    var i,l = decArray.length,
    hexColor = "#";

    for (i=0;i<l;i++){
        hexColor += decArray[i].toString(16);
    }
    return hexColor;
	}
		function loadParams(task, value, atype, prefix)
		{
			$.ajax({
				url: "/json?tasknr=" + task + "&view=sensorupdate",
				//force to handle it as text
				dataType: "text",
				success: function(data) {

				//data downloaded so we call parseJSON function 
				//and pass downloaded data
				var jsonData = $.parseJSON(data);
		
				for (let i = 0; i < jsonData.TaskValues.length; i++) {
					let app = jsonData.TaskValues[i];
					//console.log(app.Name + ' - ' + app.Value);
					if (app.Name==value)
					{
						if (atype == 0)
						{
						  $('#'+value).html(app.Value);
						}
						if (atype == 1)
						{
							console.log('Color: ' + app.Value + ' - ' + app.Value.toString(16));
							if (app.Value == 0) 
							{
								document.querySelector('#'+prefix+app.Name).jscolor.fromString('#000000');
							}
							else
							{
								document.querySelector('#'+prefix+app.Name).jscolor.fromString('#'+app.Value.toString(16).padStart(6, '0'));
							}
						}
						if (atype == 2)
						{
						  $('#'+value).val(app.Value);
						  $('#caption_'+value).html(app.Value);
						} 
						
					}
				}

				}
			});
		}
		
	function fromCurrent(index)
	{
		document.querySelector('#preset'+index+'_zone1').jscolor.fromString(document.querySelector('#zone1').jscolor.toString());
		document.querySelector('#preset'+index+'_zone2').jscolor.fromString(document.querySelector('#zone2').jscolor.toString());
		document.querySelector('#preset'+index+'_zone3').jscolor.fromString(document.querySelector('#zone3').jscolor.toString());
		document.querySelector('#preset'+index+'_zone4').jscolor.fromString(document.querySelector('#zone4').jscolor.toString());
		var picker = document.querySelector('#preset'+index+'_zone1').jscolor;
		var _dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(1, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone2').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(2, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone3').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(3, _dec, index);
		picker = document.querySelector('#preset'+index+'_zone4').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetSetup(4, _dec, index);
	}
	
	function applyPreset(index)
	{
		document.querySelector('#zone1').jscolor.fromString(document.querySelector('#preset'+index+'_zone1').jscolor.toString());
		document.querySelector('#zone2').jscolor.fromString(document.querySelector('#preset'+index+'_zone2').jscolor.toString());
		document.querySelector('#zone3').jscolor.fromString(document.querySelector('#preset'+index+'_zone3').jscolor.toString());
		document.querySelector('#zone4').jscolor.fromString(document.querySelector('#preset'+index+'_zone4').jscolor.toString());
		var picker = document.querySelector('#zone1').jscolor;
		var _dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(1, _dec);
		picker = document.querySelector('#zone2').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(2, _dec);
		picker = document.querySelector('#zone3').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(3, _dec);
		picker = document.querySelector('#zone4').jscolor;
		_dec = Math.round(picker.channel('R')) * 65536 + Math.round(picker.channel('G')) * 256 + Math.round(picker.channel('B'));
		presetLoad(4, _dec);
		
	}
		loadParams(idxCount, "count1", 2, '');
		loadParams(idxCount, "count2", 2, '');
		loadParams(idxCount, "count3", 2, '');
		loadParams(idxCount, "count4", 2, '');
		
		loadParams(idxZone, "zone1", 1, '');
		loadParams(idxZone, "zone2", 1, '');
		loadParams(idxZone, "zone3", 1, '');
		loadParams(idxZone, "zone4", 1, '');

		loadParams(idxPreset1, "zone1", 1, 'preset1_');
		loadParams(idxPreset1, "zone2", 1, 'preset1_');
		loadParams(idxPreset1, "zone3", 1, 'preset1_');
		loadParams(idxPreset1, "zone4", 1, 'preset1_');
		loadParams(idxPreset2, "zone1", 1, 'preset2_');
		loadParams(idxPreset2, "zone2", 1, 'preset2_');
		loadParams(idxPreset2, "zone3", 1, 'preset2_');
		loadParams(idxPreset2, "zone4", 1, 'preset2_');
		
		updateTelemetry();
		
  let preloader = $('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }