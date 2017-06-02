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

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isDateValid(time) {
    return moment(time, "DD-MM-YYYY", true).isValid();
}

// -1 : status not defined
// 0 : before begin
// 1 : between begin and end
// 2 : after end
function calStatusOfTime(t_begin, t_end) {
    var now = moment();
    if ( isDateValid(t_begin)  ||  isDateValid(t_end) ) {
        if (now.isAfter(moment(t_begin,"DD-MM-YYYY")) && moment(t_end,"DD-MM-YYYY").isAfter(now)) {
            return 1;
        } else if (moment(t_begin,"DD-MM-YYYY").isAfter(now)) {
            return 0;
        } else if (now.isAfter(moment(t_end,"DD-MM-YYYY"))) {
            return 2;
        } else {
            return -1;
        }
    } else {
        return -1;
    }
}


// cal the status of Building
function calStatusOfBuilding() {

    switch (calStatusOfTime($("#plan_begin").val(), $("#plan_end").val())) {
        case 1:
            $("#building_status").val('02');
            break;
        case 2:
            $("#building_status").val('03');
            break;
        default:
            break;
    }
}


function getBuildingStatus(code) {

    switch (code){
        case '00':
            return 'in der Vorbereitung';
        case '01':
            return 'vorbereiten zu bauen';
        case '02':
            return 'geplant in Bau';
        case '03':
            return 'Tiefbau &amp; Montage erledigt';
        default:
            return 'unknown building status';
    }
}


// cal the status of Permission
function calStatusOfPermission() {
    var permission_license = 'zu bestimmen';
    var permission_license_1 = '';
    var permission_license_2 = '';


    if (isEmpty($("#permission_tpye").val())) {
        return $("#permission_status").val(permission_license);
    } else {
        permission_license = 'zu beantragen';
    }

    if (isDateValid($("#bp_doc_delivery").val())) {
        permission_license_1 = 'beantragt am '+$("#bp_doc_delivery").val();
    }

    if (isDateValid($("#begin").val()) && isDateValid($("#end").val())) {
        if ($("#permission_tpye").val() === 'VBA') {
            permission_license_1 = $("#begin").val() +' bis '+ $("#end").val();
        } else {
            permission_license_1 = 'Beginn ab ' +  $("#begin").val();
        }
    }

    if ( !isEmpty($("#permission_cost").val())) {
        permission_license_2 = ' - '+ $("#permission_cost").val() +' €';
    }

    permission_license = permission_license_1 + ' ' + permission_license_2;

    return $("#permission_status").val(permission_license);
}


