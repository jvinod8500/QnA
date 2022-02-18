

var $base_height= 200;
var $base_pic = document.getElementById('BaseSize');
var $comp_pic = document.getElementById('CompSize');
var $frm = document.getElementById('Set_Sizes');
var $url = document.URL
$base_pic.height = $base_height;

if($url.indexOf('?') > -1){
	var $args = $url.split('?')[1].split('&');
	for(var $i=0; $i < $args.length; $i++){
		var $argmnt = $args[$i].split('=');
		$frm[$argmnt[0]].value = $argmnt[1];
		Compare($frm.base_ft.value, $frm.base_in.value, $frm.comp_ft.value, $frm.comp_in.value, $comp_pic, $frm.url, $url);
	}
} else {
	$comp_pic.height = $base_height;
}


$frm.compare.onclick = function(){
	Compare($frm.base_ft.value, $frm.base_in.value, $frm.comp_ft.value, $frm.comp_in.value, $comp_pic, $frm.url, $url);
}

for(var $i=0; $i < $frm.base_gn.length; $i++){
	$frm.base_gn[$i].onclick = function($i){return function(){
		$base_pic.src = '/Content/'+ $frm.base_gn.value + 'outline.jpg';
	}}($i);
}

for(var $i=0; $i < $frm.comp_gn.length; $i++){
	$frm.comp_gn[$i].onclick = function($i){return function(){
	    $comp_pic.src = '/Content/' + $frm.comp_gn.value + 'outline.jpg';
	}}($i);
}

function Compare($b_ft, $b_in, $c_ft, $c_in, $c_img, $c_url, $link){
	var $base_size = (Number($b_ft)*12) + Number($b_in);
	var $comp_size = (Number($c_ft)*12) + Number($c_in);
	
	var $ratio = $comp_size / $base_size;
	
	$c_img.height = $base_height * $ratio;
	
	$c_url.value = $link.split('?')[0]+'?base_ft='+$b_ft+'&base_in='+$b_in+'&comp_ft='+$c_ft+'&comp_in='+$c_in;
}