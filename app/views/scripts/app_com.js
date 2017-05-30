/**
 * Created by Zhenyu on 27.05.2017.
 */


(function ($) {
    "use strict";

// Attach a submit handler to the form
    $("form").submit(function( event ) {
        var url = $(this).attr( "action" );
        // Stop form from submitting normally
        event.preventDefault();

        // Send the data using post
        var posting = $.post( url, $(this).serialize() );

        // Put the results in a div
        posting.done(function( json_response ) {
            doAction(json_response);
        });

        $('.modal').modal('hide');
    });

})(jQuery);

function ajaxPost(url, data){
    var posting = $.post( url, data);
    posting.done(function( json_response ) {
        doAction(json_response);
        $('.modal').modal('hide');
    });
}

function doAction(response) {
    if (response.action) {
        switch (response.action) {
            case 'refresh':
                location.reload();
                break;
            case 'reload':
                console.log(response.project_id);
                $('#' + response.project_id).DataTable().ajax.reload();
                break;
            default:
                break;
        }
    } else {
        bootbox.alert(response);
    }
}