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
                $("#is_electric").prop( "checked", true );
            } else {
                $("#is_electric").prop( "checked", false );
            }

            if (contract.contract_typ.water){
                $("#is_water").prop( "checked", true );
            } else {
                $("#is_water").prop( "checked", false );
            }

            if (contract.contract_typ.gas){
                $("#is_gas").prop( "checked", true );
            } else {
                $("#is_gas").prop( "checked", false );
            }

            if (contract.contract_typ.telecom){
                $("#is_telecom").prop( "checked", true );
            } else {
                $("#is_telecom").prop( "checked", false );
            }

            if (contract.contract_typ.light){
                $("#is_light").prop( "checked", true );
            } else {
                $("#is_light").prop( "checked", false );
            }
            if (contract.contract_typ.others){
                $("#is_others").prop( "checked", true );
            } else {
                $("#is_others").prop( "checked", false );
            }

            $("#electric_nr").val(contract.electric_nr);
            $("#water_nr").val(contract.water_nr);
            $("#gas_nr").val(contract.gas_nr);
            if (contract.rot_b){
                $("#rot_b").prop( "checked", true );
            } else {
                $("#rot_b").prop( "checked", false );
            }

            if (contract.isBombExisted){
                $("#isBombExisted").prop( "checked", true );
            } else {
                $("#isBombExisted").prop( "checked", false );
            }

            if (contract.is_building_permission_activ){
                $("#is_building_permission_activ").prop( "checked", true );
            } else {
                $("#is_building_permission_activ").prop( "checked", false );
            }

            if (contract.is_ofw_activ){
                $("#is_ofw_activ").prop( "checked", true );
            } else {
                $("#is_ofw_activ").prop( "checked", false );
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

        if (contract.is_building_permission_activ) {
            var building_permission = contract.building_permission;
            $('#permissions > tbody:last-child').empty();
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
            $('#permissions-overview').show();
            $('#permission-detail').hide();
            $('#building_permission_not_activ').hide();
            $('#building_permission_activ').show();
            $('#add-permission').prop('disabled', false);
        } else {
            $('#permissions-overview').show();
            $('#permission-detail').hide();
            $('#building_permission_not_activ').show();
            $('#building_permission_activ').hide();
            $('#add-permission').prop('disabled', true);
        }
    });


    $('#contract-ofw-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        if (contract.is_ofw_activ){
            $('#ofw_activ').show();
            $('#ofw_not_activ').hide();
            //set content
            if (contract.ofw) {
                $("#ofw_worker_name").val(contract.ofw.worker_name);
                $("#ofw_permission_nr").val(contract.ofw.permission_nr);
                $("#ofw_delivery").val(contract.ofw.delivery);
                $("#ofw_completion_at").val(contract.ofw.completion_at);
                $("#ofw_ueberdicken").val(contract.ofw.ueberdicken);
                $("#ofw_estimated_value").val(contract.ofw.estimated_value);
                $("#ofw_status").val(contract.ofw.ofw_status);
                if (contract.ofw.typ.bausstr) {
                    $("#bausstr").prop( "checked", true );
                } else {
                    $("#bausstr").prop( "checked", false );
                }

                if (contract.ofw.typ.fahrbahn){
                    $("#fahrbahn").prop( "checked", true );
                } else {
                    $("#fahrbahn").prop( "checked", false );
                }

                if (contract.ofw.typ.fussweg){
                    $("#fussweg").prop( "checked", true );
                } else {
                    $("#fussweg").prop( "checked", false );
                }

                if (contract.ofw.typ.bitu){
                    $("#bitu").prop( "checked", true );
                } else {
                    $("#bitu").prop( "checked", false );
                }

                if (contract.ofw.typ.pflaster){
                    $("#pflaster").prop( "checked", true );
                } else {
                    $("#pflaster").prop( "checked", false );
                }

                if (contract.ofw.typ.beton){
                    $("#beton").prop( "checked", true );
                } else {
                    $("#beton").prop( "checked", false );
                }
                if (contract.ofw.clean){
                    $("#clean").prop( "checked", true );
                } else {
                    $("#clean").prop( "checked", false );
                }

                if (contract.ofw.is_acceptance_activ){
                    $("#is_acceptance_activ").prop( "checked", true );
                } else {
                    $("#is_acceptance_activ").prop( "checked", false );
                }
            }
        } else {
            $('#ofw_activ').hide();
            $('#ofw_not_activ').show();
        }
    });

    $('#contract-invoices-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        var invoices = contract.invoice;
        invoices.forEach((invoice) => {
            var table_content = '<tr>'+
                '<td>'+invoice.rechnung_nr+'</td>'+
                '<td>'+invoice.sum+'</td>'+
                '<td>'+getInvoiceStatus(invoice.invoice_status)+'</td>'+
                '</tr>';
            console.log(table_content);
            $('#invoices > tbody:last-child').append(table_content);
        });
        $('#invoices-overview').show();
        $('#invoice-detail').hide();
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

function addnewinvoice() {
    $('#invoice-detail').show();
    $('#invoices-overview').hide();
}

function addnewpermission() {
    $('#permission-detail').show();
    $('#permissions-overview').hide();
}