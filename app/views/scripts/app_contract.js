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
            $("#basic_contract_id").val(contract.id);
            $("#basic_project_id").val(contract.project_id);
            $("#contract_street").val(contract.contract_street);

        } else {
            var project = $(e.relatedTarget).data('project');

            if (project) {
                $("#basic_project_id").val(project.id);
                $("#contract_street").val(project.street+' '+project.housenr);

            }

        }

    });


    $('#contract-permissions-modal').on('show.bs.modal', function(e) {
        var contract = $(e.relatedTarget).data('contract');
        $("#permission_contract_id").val(contract.id);
        $("#permission_project_id").val(contract.project_id);
        $('#permission_tpye').empty();

        if (contract.customer === 'STW') {
            $('#permission_tpye').append($('<option>', {
                value: 'BAZ',
                text: 'BAZ'
            }));

            $('#permission_tpye').append($('<option>', {
                value: 'VAZ',
                text: 'VAZ'
            }));
            $('#permission_tpye').append($('<option>', {
                value: 'VBA',
                text: 'VBA'
            }));
            $('#permission_tpye').append($('<option>', {
                value: 'BAZVAZ',
                text: 'BAZ & VAZ'
            }));
        } else {
            $('#permission_tpye').append($('<option>', {
                value: 'BAZ',
                text: 'BAZ'
            }));
        }

        if (contract.is_building_permission_activ) {
            var building_permission = contract.building_permission;
            $('#permissions > tbody:last-child').empty();
            building_permission.forEach((permission) => {
                var table_content = '<tr>'+'' +
                    '<td>'+permission.type+'</td>'+
                    '<td>'+formatDate(permission.begin)+'</td>'+
                    '<td>'+formatDate(permission.end)+'</td>'+
                    '<td>'+permission.cost+'</td>'+
                    '<td>'+permission.permission_status+'</td>'+
                    '<td>'+'<a onclick="editPermission(this)" data-permission=\''+JSON.stringify(permission)+'\'><i class="material-icons md-24">&#xe3c9;</i></a>'+'</td>'+
                    '<td>'+'<a onclick="delPermission(this)" data-contract=\''+JSON.stringify(contract)+'\' data-permission=\''+JSON.stringify(permission)+'\'><i class="material-icons md-24">&#xe872;</i></a>'+'</td>'+
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
        $(this).find('form')[0].reset();
        $("#ofw_contract_id").val(contract.id);
        $("#ofw_project_id").val(contract.project_id);
        if (contract.is_ofw_activ){
            $('#ofw_activ').show();
            $('#ofw_not_activ').hide();
            //set content
            if (contract.ofw) {
                $("#ofw_worker_name").val(contract.ofw.worker_name);
                $("#ofw_permission_nr").val(contract.ofw.permission_nr);
                $("#ofw_delivery").val(formatDate(contract.ofw.delivery));
                $("#ofw_completion_at").val(formatDate(contract.ofw.completion_at));
                $("#ofw_ueberdicken").val(contract.ofw.ueberdicken);
                $("#ofw_estimated_value").val(contract.ofw.estimated_value);
                $("#ofw_ueberdicken").val(contract.ofw.ueberdicken);
                $("#ofw_applied").val(formatDate(contract.ofw.applied));
                $("#ofw_granted").val(formatDate(contract.ofw.applied));
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
        $('#invoices > tbody:last-child').empty();
        $("#invoice_contract_id").val(contract.id);
        $("#invoice_project_id").val(contract.project_id);
        var invoices = contract.invoice;
        invoices.forEach((invoice) => {
            var table_content = '<tr>'+
                '<td>'+invoice.rechnung_nr+'</td>'+
                '<td>'+invoice.sum+'</td>'+
                '<td>'+getInvoiceStatus(invoice.invoice_status)+'</td>'+
                '<td>'+'<a onclick="editInvoice(this)" data-invoice=\''+JSON.stringify(invoice)+'\'><i class="material-icons md-24">&#xe3c9;</i></a>'+'</td>'+
                '<td>'+'<a onclick="delInvoice(this)" data-contract=\''+JSON.stringify(contract)+'\' data-invoice=\''+JSON.stringify(invoice)+'\'><i class="material-icons md-24">&#xe872;</i></a>'+'</td>'+
                '</tr>';
            console.log(table_content);
            $('#invoices > tbody:last-child').append(table_content);
        });
        $('#invoices-overview').show();
        $('#invoice-detail').hide();
    });

    $('#contract-building-modal').on('show.bs.modal', function(e) {

        $(this).find('form')[0].reset();
        var contract = $(e.relatedTarget).data('contract');
        $("#building_contract_id").val(contract.id);
        $("#building_project_id").val(contract.project_id);

        if (contract.building_work) {
            $("#plan_begin").val(formatDate(contract.building_work.plan_begin));
            $("#plan_end").val(formatDate(contract.building_work.plan_end));
            $("#building_worker_name").val(contract.building_work.worker_name);
            $("#building_working_months").val(contract.building_work.working_months);
            $("#building_status").val(contract.building_work.status);
            $('#procent_completion').slider({
                formatter: function(value) {
                    return value+'%';
                }
            });
            $('#procent_completion').slider('setValue',contract.building_work.procent_completion);
        }

    });


    // date change events
    // check the status when the date is changed
    $(".date").on('dp.change', function (ev) {
        calStatusOfBuilding();
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

function editInvoice(element){
    $('#invoice_form')[0].reset();

    if (element) {
        //init data
        var invoice = element.dataset.invoice;
        invoice = eval('(' + invoice + ')');
        $('#invoice_id').val(invoice._id);
        $('#sum').val(invoice.sum);
        $('#aufmass_am').val(formatDate(invoice.aufmass_am));
        $('#bewert_aufmass').val(formatDate(invoice.bewert_aufmass));
        $('#rechnung_nr').val(invoice.rechnung_nr);
        $('#guts_datum').val(formatDate(invoice.guts_datum));
        $('#booking_month').val(invoice.booking_month);
        if(invoice.correction_needed) {
            $('#correction_needed').attr('checked','checked');
        } else {
            $('#correction_needed').removeAttr('checked');
        }
        $('#invoice_status').val(invoice.invoice_status);
    } else {
        $('#invoice_id').val('');
    }
    //show detail and hide overview
    $('#invoice-detail').show();
    $('#invoices-overview').hide();
}

function delInvoice(element){
    var invoice = element.dataset.invoice;
    var contract = element.dataset.contract;
    invoice = eval('(' + invoice + ')');
    contract = eval('(' + contract + ')');
    if(invoice && contract){
        let url = "/contracts/"+contract.id+"/del/invoice?id="+invoice._id;
        ajaxPost(url,{project_id:contract.project_id});
    }    
}

function editPermission(element){
    $('#building_permission_form')[0].reset();

    if (element) {
        var permission = element.dataset.permission;
        permission = eval('(' + permission + ')');
        $('#permission_id').val(permission._id);
        $('#permission_tpye').val(permission.type);
        $('#bp_doc_delivery').val(formatDate(permission.doc_delivery));
        $('#begin').val(formatDate(permission.begin));
        $('#end').val(formatDate(permission.end));
        $('#permission_cost').val(permission.cost);
    } else {
        $('#permission_id').val('');
    }

    $('#permission-detail').show();
    $('#permissions-overview').hide();
}

function delPermission(element){
    var permission = element.dataset.permission;
    var contract = element.dataset.contract;
    permission = eval('(' + permission + ')');
    contract = eval('(' + contract + ')');
    if(permission && contract){
        let url = "/contracts/"+contract.id+"/del/permission?id="+permission._id;
        ajaxPost(url,{project_id:contract.project_id});
    }    
}