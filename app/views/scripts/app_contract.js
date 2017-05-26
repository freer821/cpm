/**
 * Created by Zhenyu on 25.05.2017.
 */
$(document).ready(function(){

    $('#contract-basic-modal').on('show.bs.modal', function(e) {
        $(this).find('form')[0].reset();
        var contract = $(e.relatedTarget).data('contract');
        if(contract){
            //set title
            $('#contract-modal-title').text('Update Contract Basic');

            //set content
            $("#customer").val(contract.customer);
            $("#partner_name").val(contract.partner_name);
            $("#sap_nr").val(contract.sap_nr);
            $("#cost_code").val(contract.cost_code);
            $("#manager_name").val(contract.manager_name);
            $("#estimated_value").val(contract.estimated_value);
            $("#work_content").val(contract.work_content);
            $("#contract_delivery").val(formatDate(contract.contract_delivery));
            $("#doc_delivery").val(formatDate(contract.doc_delivery));
            if (contract.contract_typ.electric) {
                $("#is_electric").attr('checked','checked');
            }
            if (contract.contract_typ.water){
                $("#is_water").attr('checked','checked');
            }
            if (contract.contract_typ.gas){
                $("#is_gas").attr('checked','checked');
            }
            if (contract.contract_typ.telecom){
                $("#is_telecom").attr('checked','checked');
            }
            if (contract.contract_typ.light){
                $("#is_light").attr('checked','checked');
            }
            if (contract.contract_typ.others){
                $("#is_others").attr('checked','checked');
            }
            $("#electric_nr").val(contract.electric_nr);
            $("#water_nr").val(contract.water_nr);
            $("#gas_nr").val(contract.gas_nr);
            if (contract.rot_b){
                $("#rot_b").attr('checked','checked');
            }
            if (contract.isBombExisted){
                $("#isBombExisted").attr('checked','checked');
            }
            if (contract.is_building_permission_activ){
                $("#is_building_permission_activ").attr('checked','checked');
            }
            if (contract.is_ofw_activ){
                $("#is_ofw_activ").attr('checked','checked');
            }
            $("#person").val(contract.person);
            $("#reason").val(contract.reason);
            $("#comment").val(contract.comment);
            $("#contract_id").val(contract.id);
            $("#project_id").val(contract.project_id);
            $("#contract_street").val(contract.contract_street);

        } else {
            var project = $(e.relatedTarget).data('project');

            if (project) {
                $("#project_id").val(project.id);
                $("#contract_street").val(project.street+' '+project.housenr);

            }

        }

    });


    $('#contract-permissions-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        var building_permission = contract.building_permission;
        building_permission.forEach((permission) => {
            var table_content = '<tr>'+'' +
                '<td>'+permission.type+'</td>'+
                '<td>'+permission.begin+'</td>'+
                '<td>'+permission.end+'</td>'+
                '<td>'+permission.cost+'</td>'+
                '<td>'+permission.permission_status+'</td>'+
                '</tr>';
            $('#permissions > tbody:last-child').append(table_content);
        });
    });


    $('#contract-ofw-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        //set content
        $("#ofw_worker_name").val(contract.ofw.worker_name);
        $("#ofw_permission_nr").val(contract.ofw.permission_nr);
        $("#ofw_delivery").val(contract.ofw.delivery);
        $("#ofw_completion_at").val(contract.ofw.completion_at);
        $("#ofw_ueberdicken").val(contract.ofw.ueberdicken);
        $("#ofw_estimated_value").val(contract.ofw.estimated_value);
        $("#ofw_status").val(contract.ofw.ofw_status);
        if (contract.ofw.typ.bausstr) {
            $("#bausstr").attr('checked','checked');
        }
        if (contract.ofw.typ.fahrbahn){
            $("#fahrbahn").attr('checked','checked');
        }
        if (contract.ofw.typ.fussweg){
            $("#fussweg").attr('checked','checked');
        }
        if (contract.ofw.typ.bitu){
            $("#bitu").attr('checked','checked');
        }
        if (contract.ofw.typ.pflaster){
            $("#pflaster").attr('checked','checked');
        }
        if (contract.ofw.typ.beton){
            $("#beton").attr('checked','checked');
        }
        if (contract.ofw.clean){
            $("#clean").attr('checked','checked');
        }
        if (contract.ofw.is_acceptance_activ){
            $("#is_acceptance_activ").attr('checked','checked');
        }
    });

    $('#contract-invoices-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        var invoices = contract.invoice;
        invoices.forEach((invoice) => {
            var table_content = '<tr>'+'' +
                '<td>'+invoice.rechnung_nr+'</td>'+
                '<td>'+invoice.sum+'</td>'+
                '<td>'+getInvoiceStatus(invoice.invoice_status)+'</td>'+
                '</tr>';
            $('#invoices > tbody:last-child').append(table_content);
        });
    });


    // Attach a submit handler to the form
    $("form").submit(function( event ) {
        // Get some values from elements on the page:
        url = $(this).attr( "action" );
        if (url != '/contracts/edit/permission' && url !='/contracts/edit/invocie'){
            // Stop form from submitting normally
            event.preventDefault();

            // Send the data using post
            var posting = $.post( url, $(this).serialize() );

            // Put the results in a div
            posting.done(function( data ) {
                bootbox.alert(data);
            });
        }
        $('.modal').modal('hide');
    });

});


function formatDate(time) {
    return moment(time).format("DD-MM-YYYY");
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
            return 'unknown status';
    }
}