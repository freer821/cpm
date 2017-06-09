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

    // date change events
    // check the status when the date is changed
    $(".date").on('dp.change', function (ev) {
        $(ev.target).children('input').trigger('change');
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
                $('#' + response.project_id).DataTable().ajax.reload();
                break;
            case 'add_con':
                $('#contract-basic-modal').modal('show');
                $("#basic_project_id").val(response.project.id);
                $("#contract_street").val(response.project.street+' '+response.project.housenr);
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

function isFieldEmpty(fieldname) {
    return isEmpty($('#'+fieldname).val());
}

function getNumValue(value){
    if (isNaN(parseFloat(value))) {
        return 0;
    }
    return parseFloat(value);
}

function isDateValid(time) {
    return moment(time, "DD-MM-YYYY", true).isValid();
}

function getMonthDate(time) {
    return moment(time, "DD-MM-YYYY").format("MM-YYYY");
}


// -1 : status not defined
// when t_begin and t_end exist
// 0 : before begin
// 1 : between begin and end
// 2 : after end
// when only t_begin exists
// 3 : before begin
// 4 : after begin
// when only t_end exits
// 5 : before end
// 6 : after end
function calStatusOfTime(t_begin, t_end) {
    var now = moment();
    if ( isDateValid(t_begin)  &&  isDateValid(t_end) ) {
        if (now.isAfter(moment(t_begin,"DD-MM-YYYY")) && moment(t_end,"DD-MM-YYYY").isAfter(now)) {
            return 1;
        } else if (now.isBefore(moment(t_begin,"DD-MM-YYYY"))) {
            return 0;
        } else if (now.isAfter(moment(t_end,"DD-MM-YYYY"))) {
            return 2;
        }
    } else if (isDateValid(t_begin)) {
        if (now.isBefore(moment(t_begin,"DD-MM-YYYY"))) {
            return 3;
        } else {
            return 4;
        }
    } else if (isDateValid(t_end)) {
        if (now.isBefore(moment(t_end,"DD-MM-YYYY"))) {
            return 5;
        } else {
            return 6;
        }
    } else {
        return -1;
    }
}


// cal the status of Building
function calStatusOfBuilding() {

    if ($("#building_status").val() !== '04') {
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

    // auto set Booking month
    if (isDateValid($("#plan_end").val()) && isEmpty($("#building_working_months").val())) {
        $("#building_working_months").val(getMonthDate($("#plan_end").val()));
    }

    setBuildingPercent($("#building_status").val());
}

function setBuildingPercent(status_value) {
    switch (status_value){
        case "" :
        case '00':
            $("#procent_completion").slider('setValue', 0);
            $("#procent_completion").slider("disable");
            break;
        case '01':
            $("#procent_completion").slider("enable");
            break;
        case '02':
            $("#procent_completion").slider("enable");
            break;
        case '03':
            $("#procent_completion").slider('setValue', 100);
            $("#procent_completion").slider("enable");
            break;
        case '04':
            $("#procent_completion").slider('setValue', 100);
            $("#procent_completion").slider("disable");
            break;
    }
}

function getInvoiceStatus(code) {

    switch (code){
        case '00':
            return 'Warten auf Unterlagen';
        case '01':
            return 'bereit abzurechnen';
        case '02':
            return 'abgerechnet';
        case '03':
            return 'WaG, gesendet';
        case '04':
            return 'WaG, genehmigt';
        case '05':
            return 'Gutschrift vorhanden';
        case '06':
            return 'Ueberzubearbeiten';
        default:
            return code;
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
    var permission_license = '';
    var permission_license_1 = '';
    var permission_license_2 = '';


    if (isEmpty($("#permission_tpye").val())) {
        permission_license = 'zu bestimmen';
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

    if (!isEmpty(permission_license_1) || !isEmpty(permission_license_2)) {
        permission_license = permission_license_1 + ' ' + permission_license_2;
    }

    $("#permission_status").val(permission_license);
}

function calStatusOfOFW() {
    var ofw_var1, ofw_var2;
    switch (calStatusOfTime($("#ofw_delivery").val(), $("#ofw_completion_at").val())) {
        case 0:
            ofw_var1 = 'OFW nicht gebaut';
            break;
        case 1:
            ofw_var1 = 'OFW im Bau';
            break;
        case 2:
            ofw_var1 = 'OFW fertig';
            break;
        default:
            break;
    }

    if ($('#ofw_contract_customer').val() === 'STW') {
        if($('#permission_nr').val().trim().length > 0) {
            ofw_var2 = $('#permission_nr').val();
        } else {
            ofw_var2 = 'Meld.Nr. nicht vorhand';
        }
    }
    else {
        if ($('#is_acceptance_activ').is(':checked')) {
            switch (calStatusOfTime($("#ofw_applied").val(), $("#ofw_granted").val())) {
                case 0:
                    ofw_var2 = 'Abn. Noetig (zu beantragen)';
                    break;
                case 1:
                    ofw_var2 = 'Abn. beantragt';
                    break;
                case 2:
                    ofw_var2 = 'Abn. vorhanden';
                    break;
                default:
                    break;
            }
        } else {
            ofw_var2 = 'Abnahme nicht noetig';
        }
    }

    $('#ofw_status').val(ofw_var1+' - '+ofw_var2);

}


function calInvoiceStatus() {
    if ($('#correction_needed').is(":checked")) {
        $('#invoice_status').val('06').change();
    } else if (getNumValue($('#sum').val())> 0) {
        if ( !isDateValid('aufmass_am') && !isDateValid('bewert_aufmass') && isFieldEmpty('rechnung_nr') && !isDateValid('guts_datum')) {
            $('#invoice_status').val('03').change();
        } else if (isDateValid('aufmass_am') && !isDateValid('bewert_aufmass') && isFieldEmpty('rechnung_nr') && !isDateValid('guts_datum')) {
            $('#invoice_status').val('04').change();
        } else if (isDateValid('aufmass_am') && isDateValid('bewert_aufmass') && isFieldEmpty('rechnung_nr') && !isDateValid('guts_datum')) {
            $('#invoice_status').val('05').change();
        } else if (!isFieldEmpty('rechnung_nr') && isDateValid('guts_datum')) {
            $('#invoice_status').val('06').change();
        }
    }

    // auto set Booking month
    if (isDateValid($("#guts_datum").val()) && isEmpty($("#booking_month").val())) {
        $("#booking_month").val(getMonthDate($("#guts_datum").val()));
    }
}


