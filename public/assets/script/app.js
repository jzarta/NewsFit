//Add comments
$('.commentAdder').on('click', function(){

	var cArea = $(this).parent();
	$(cArea).empty();

	$(cArea).html(`
		<form action="/update/`+$(cArea).data('id')+`" method="post">
			<fieldset class="form-group">
			    <label for="commentBox">Comment:</label>
			    <textarea class="form-control" name="comment" id="commentBox" rows="3"></textarea>
			</fieldset>
			 <input type="submit" class="btn btn-danger" value="Add Comment"/>
		</form>
	`);
});

//Delete comments
$('.list-group-item').on('click', function(){
	var comment = $(this).text().trim();
	var commID  = $(this).parent().data('id');
	var commDel = {
		comment: comment,
		commID: commID
	}
	console.log(commDel);

	var currentURL = window.location.origin;

    $.post(currentURL + "/delete", commDel);
  
});