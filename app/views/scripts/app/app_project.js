/**
 * Created by Zhenyu on 25.05.2017.
 */
$(document).ready(function(){

    // add and edit project
    $('#project-modal').on('show.bs.modal', function (e) {
        $(this).find('form')[0].reset();
        var project = $(e.relatedTarget).data('project');
        if (project) {
            //set title
            $('#project-modal-title').text('Update Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/update/' + project.id);

            //set content
            $("#city").val(project.city);
            $("#community").val(project.community);
            $("#street").val(project.street);
            $("#housenr").val(project.housenr);
            $("#files_path").val(project.files_path);
            $("#linesplan_files_path").val(project.linesplan_files_path);
            $("#zipcode").val(project.zipcode);
            $("#comment").val(project.comment);
            if (project.is_linesplan_files_exist) {
                $("#is_linesplan_files_exist").prop( "checked", true );
            } else {
                $("#is_linesplan_files_exist").prop( "checked", false );
            }
        } else {
            //set title
            $('#project-modal-title').text('Add Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/add');

        }
    });

});

function showContracts(project_id) {
    $('#'+project_id).addClass("shown");
    $('#'+project_id).css("font-weight", "800");
    $.get( '/projects/'+project_id+'/contracts', function( data ) {
        if (data.contracts && data.contracts.length > 0) {
            $('#'+project_id).after("<tr><td id=\'"+project_id+"_contracts\' colspan='9'></td></tr>");
            var contacts_html = '<table class="table"><tbody>';
            data.contracts.forEach((contract) => {
                contacts_html+=contractOverview(contract);
                contacts_html+='<tr id="'+contract.id+'_details" style="display:none"><td colspan="10">'+contractDetail(contract)+'</td></tr>';
            });
            contacts_html +='</tbody></table>';
            $('#'+project_id+'_contracts').append(contacts_html);
        } else {
            $('#'+project_id).after("<tr><td id=\'"+project_id+"_contracts\' colspan='9'><table class='table'><tbody><tr><td style='background-color: rgba(0, 0, 0, 0.025)'>no contract data</td></tr></tbody><table></td></tr>");
        }
    });
}

function hideContracts(project_id) {
    $('#'+project_id).removeClass("shown");
    $('#'+project_id+'_contracts').parent().remove();
    $('#'+project_id).css("font-weight", "");
}

function updateProject(project_id) {
    $.get( '/projects/'+project_id, function( data ) {
        if (data.project) {
            $('#'+project_id+' td.finished_overview').val(data.project.contracts_status);
            $('#'+project_id+' td.contracts_types').empty();
            $('#'+project_id+' td.contracts_types').html(buildProjectTypesHTML(data.project));
        }
    });
}

function buildProjectTypesHTML(project) {
    var project_types = '<div style="max-width:185px;min-width:185px;">';
    if (project.contract_types.electric)  {
        project_types+= '<a class="hint--top" data-hint="Elt"><i class="fa fa-square projectSchema.contract_types.electric_true" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#b53f45;"></i></a>';
    } else {
        project_types+='<a class="hint--top" data-hint="Elt"><i class="fa fa-square-o projectSchema.contract_types.electric_false" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#b53f45;"></i></a>';
    }

    if (project.contract_types.gas ) {
        project_types+='<a class="hint--top" data-hint="Gas"><i class="fa fa-square projectSchema.contract_types.gas_true" style="width:21px;height:21px;font-size:21px;margin-right:4px;color:#ffd000;"></i></a>';
    } else {
        project_types+='<a class="hint--top" data-hint="Gas"><i class="fa fa-square-o projectSchema.contract_types.gas_false" style="width:21px;height:21px;font-size:21px;margin-right:4px;color:#ffd000;"></i></a>';
    }
    if ( project.contract_types.water ) {
        project_types+= '<a class="hint--top" data-hint="Wasser"><i class="fa fa-square projectSchema.contract_types.water_true" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#3e6b7e;"></i></a>';
    } else {
        project_types+='<a class="hint--top" data-hint="Wasser"><i class="fa fa-square-o projectSchema.contract_types.water_false" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#3e6b7e;"></i></a>';
    }
    if ( project.contract_types.light ) {
        project_types+= '<a class="hint--top" data-hint="Beleuchtung"><i class="fa fa-square projectSchema.contract_types.light_true" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#91c0ab;"></i></a>';
    } else {
        project_types+='<a class="hint--top" data-hint="Beleuchtung"><i class="fa fa-square-o projectSchema.contract_types.light_false" style="width:21px;height:21px;font-size:21px;margin-right:6px;color:#91c0ab;"></i></a>';
    }
    if ( project.contract_types.telecom ) {
        project_types+= '<a class="hint--top" data-hint="Telekom"><i class="fa fa-square projectSchema.contract_types.telecom_true" style="width:21px;height:21px;font-size:21px;margin-right:4px;color:rgb(248,126,123);"></i></a>';
    } else {
        project_types+= '<a class="hint--top" data-hint="Telekom"><i class="fa fa-square-o projectSchema.contract_types.telecom_false" style="width:21px;height:21px;font-size:21px;margin-right:4px;color:rgb(248,126,123);"></i></a>';
    }
    if ( project.contract_types.others ) {
        project_types+= '<a class="hint--top" data-hint="Sonstige"><i class="fa fa-square projectSchema.contract_types.others_true" style="width:21px;height:21px;font-size:21px;margin-right:0px;"></i></a>';
    } else {
        project_types+= '<a class="hint--top" data-hint="Sonstige"><i class="fa fa-square-o projectSchema.contract_types.others_false" style="width:21px;height:21px;font-size:21px;margin-right:0px;"></i></a>';
    }

    project_types+='</div>';

    return project_types;
}


function contractOverview (contract) {
    // generate contract overview
     return formatContractStatus(contract) +
                        '<td class="contractSchema.id" style="width:150px;min-width:150px;max-width:150px;">'+contract.id+' </td>'+
                        '<td class="contractSchema.street&amp;contractSchema.housenr" style="min-width:150px;">'+contract.contract_street+'</td>'+
                        '<td class="contractSchema.work_content" style="min-width:150px;">'+contract.work_content+'</td>'+
                        '<td class="contractSchema.cost_code" style="min-width:80px;">'+contract.cost_code+' </td>'+
                        '<td class="contractSchema.customer" style="min-width:70px;">'+contract.customer+' </td>'+
                        '<td class="contractSchema.contract_id" style="min-width:110px;">'+contract.contract_id+' </td>'+
                        '<td class="contract_edit" style="min-width:45px;max-width:45px;"><a class="hint--left" data-hint="Info. des Auftrag bearbeiten" href="#" data-toggle="modal" data-target="#contract-basic-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static"><i class="fa fa-pencil-square-o" style="font-size:22px;margin-left:4px;min-width:22px;"></i></a></td>'+
                        '<td class="contract_types&amp;lock" style="height:42px;padding:0px;min-width:92px;width:92px;max-width:92px;">'+
                            '<div style="padding:0px;height:40px;">'+
                                '<div style="height:42px;min-height:0px;font-size:0px;">'+
                                    '<table class="table">'+
                                        '<thead>'+
                                            '<tr></tr>'+
                                        '</thead>'+
                                        '<tbody style="height:42px;">'+ 
                                            '<tr style="height:15%;">'+
                                                '<td rowspan="0" style="width:40%;padding-top:13%;padding-left:10%;padding-bottom:10%;padding-right:0%;height:42px;">'+
                                                    formatContractLockandUnlock(contract)+
                                                '</td>'+
                                                formatContractType(contract)+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                    '</tr>';
}

function formatContractLockandUnlock(contract) {
    if (contract.is_contract_ative) {
        return '<a class="hint--left" data-hint="Auftrag aktivieren / deaktivieren"><i onclick="deactivAndActivContract(\''+contract.id+'\',\''+contract.project_id+'\',\''+ contract.cost_code+'\',\'true\')" class="fa fa-unlock-alt" style="font-size:22px;margin-left:4px;min-width:22px;"></i></a>';
    } else {
        return '<a class="hint--left" data-hint="Auftrag aktivieren / deaktivieren"><i onclick="deactivAndActivContract(\''+contract.id+'\',\''+contract.project_id+'\',\''+ contract.cost_code+'\')" class="fa fa-lock" style="font-size:22px;margin-left:4px;min-width:22px;"></i></a>';
    }
}

function deactivAndActivContract(contract_id, project_id,cost_code,is_contract_ative){
    let url = "/contracts/edit/unlockAndlock";
    if(! is_contract_ative){
        bootbox.confirm("are you sure to active contract: "+contract_id+"?", function(result){
            if(result){
                ajaxPost(url,{'contract_id':contract_id, 'project_id':project_id, 'action':'unlock', 'cost_code':cost_code});
            }
        });
    } else {
        bootbox.confirm("are you sure to deactive contract: "+contract_id+"?", function(result){
            if(result){
                ajaxPost(url,{'contract_id':contract_id, 'project_id':project_id, 'action':'lock', 'cost_code':cost_code});
            }
        });
    }
}


function openContractDetail(contract_id) {
    $('#'+contract_id+'_details').show();
    $('#'+contract_id+' i.fa-chevron-circle-right').hide();
    $('#'+contract_id+' i.fa-chevron-circle-down').show();
    $('#'+contract_id).css("font-weight", "600");
}

function closeContractDetail(contract_id) {
    $('#'+contract_id+'_details').hide();
    $('#'+contract_id+' i.fa-chevron-circle-right').show();
    $('#'+contract_id+' i.fa-chevron-circle-down').hide();
    $('#'+contract_id).css("font-weight", "");

}

function formatContractType(contract) {
    var contract_types ='';
    if (contract.contract_typ.electric) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.electric" style="width:5%;padding:0;background-color:#b53f45;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.electric" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    if (contract.contract_typ.gas) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.gas" style="width:5%;padding:0;background-color:#ffd000;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.gas" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    if (contract.contract_typ.water) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.water" style="width:5%;padding:0;height:42px;background-color:#3e6b7e;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.water" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    if (contract.contract_typ.light) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.light" style="width:5%;padding:0;background-color:#91c0ab;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.light" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    if (contract.contract_typ.telecom) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.telecom" style="width:5%;padding:0;background-color:#f87e7b;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.telecom" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    if (contract.contract_typ.others) {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.others" style="width:5%;padding:0;background-color:#333333;">1</td>';
    } else {
        contract_types +=  '<td rowspan="0" class="contract.contract_typ.others" style="width:5%;padding:0;background-color:#ffffff;">1</td>'
    }

    return contract_types;
}

function formatContractStatus(contract){
    if (!contract.is_contract_ative) {
        return '<tr id="'+contract.id+'" class="contract_deaktiv" style="color:rgb(182,182,182);"><td class="2nd_unfold" style="margin-left:0px;width:40px;min-width:40px;max-width:40px;">'+
            '<i onclick="openContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-right" style="font-size:18px;"></i><i onclick="closeContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-down" style="display:none;font-size:18px;"></i></td>'+
            '<td class="2nd_unfold" style="margin-left:0px;min-width:32px;max-width:32px;width:32px;"><i class="fa fa-hand-stop-o" style="font-size:20px;"></i></td>';
    }

    switch (contract.total_status) {
        case 'UNFINISHED':
            return '<tr id="'+contract.id+'" class="contract_not_opened"><td class="2nd_unfold" style="margin-left:0px;width:40px;min-width:40px;max-width:40px;">'+
                '<i onclick="openContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-right" style="font-size:18px;"></i><i onclick="closeContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-down" style="display:none;font-size:18px;"></i></td>'+
                '<td class="2nd_unfold" style="margin-left:0px;min-width:32px;max-width:32px;width:32px;"><i class="fa fa-spinner" style="font-size:20px;"></i></td>';
            break;
        case 'FINISHED':
            return '<tr id="'+contract.id+'" class="contract_finished" style="color:rgba(131,175,155,0.8);"><td class="2nd_unfold" style="margin-left:0px;width:40px;min-width:40px;max-width:40px;">'+
                '<i onclick="openContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-right" style="font-size:18px;"></i><i onclick="closeContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-down" style="display:none;font-size:18px;"></i></td>'+
                '<td class="2nd_unfold" style="margin-left:0px;min-width:32px;max-width:32px;width:32px;"><i class="fa fa-check-square-o" style="font-size:20px;"></i></td>';
            break;
        default:
            return '<tr id="'+contract.id+'" class="contract_not_opened"><td class="2nd_unfold" style="margin-left:0px;width:40px;min-width:40px;max-width:40px;">'+
                '<i onclick="openContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-right" style="font-size:18px;"></i><i onclick="closeContractDetail(\''+contract.id+'\')" class="fa fa-chevron-circle-down" style="display:none;font-size:18px;"></i></td>'+
                '<td class="2nd_unfold" style="margin-left:0px;min-width:32px;max-width:32px;width:32px;"><i class="fa fa-check-square-o" style="font-size:20px;"></i></td>';
            break;
    }
}

function contractDetail(contract) {

    return '<div class="row" style="padding-left:50px;padding-right:0px;">'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding-left:26px;margin-top:15px;"><a href="#" data-toggle="modal" data-target="#contract-permissions-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-thumbs-o-up" style="font-size:30px;"></i></a></div>'+
        '<div class="col-lg-10 col-md-10 col-sm-10">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Genehmigungen</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<input type="text" class="contractSchema.building_permission.permission_status" style="padding-top:0;margin-top:0px;font-size:14px;width:100%;" value="'+formatData(contract, 'permissions_status' )+'" readonly>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding:0px;padding-top:0;padding-left:25px;margin-top:15px;"><a href="#" data-toggle="modal" data-target="#contract-building-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-calendar" style="font-size:30px;"></i></a></div>'+
        '<div class="col-lg-10 col-md-10 col-sm-10">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Tiefbau &amp; Montage Zustand</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<input type="text" class="contractSchema.building_work.status" style="padding-top:0;margin-top:0px;font-size:14px;width:100%;" value="'+getBuildingStatus(formatData(contract.building_work,"status")) +'" readonly>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding-left:24px;margin-top:14px;"><a href="#" data-toggle="modal" data-target="#contract-ofw-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-road" style="font-size:30px;"></i></a></div>'+
        '<div class="col-lg-10 col-md-10 col-sm-10">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">OFW Zustand</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<input type="text" class="OFW_status" style="padding-top:0;margin-top:0px;font-size:14px;width:100%;" value="'+formatData(contract.ofw, "ofw_status") +'" readonly>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding-left:24px;margin-top:14px;"><a href="#" data-toggle="modal" data-target="#contract-invoices-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-credit-card" style="font-size:30px;"></i></a></div>'+
        '<div class="col-lg-10 col-md-10 col-sm-10">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Abrechnungszusatnd</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<input type="text" class="contractSchema.invoice.invoice_status" style="padding-top:0;margin-top:0px;font-size:14px;width:100%;" value="'+getInvoiceStatus(contract.invoices_status) +'" readonly>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="margin-top:15px">'+
        '<label style="margin-left:10px;">Comment</label>'+
        '<textarea style="margin-left:10px;width:98.4%" class="contractSchema.comment" style="width:100%;">'+contract.comment+'</textarea>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-5 col-sm-offset-0"  style="margin-left:7%">'+
        '<div class="row">'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Bauleiter</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.manager_name">'+formatData(contract, 'manager_name' ) +'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Kolonne</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;padding-right:opx;">'+
        '<label class="contractSchema.building_work.worker_name">'+formatData(contract.building_work,"worker_name")+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">geplanter Baubeginn</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.building_work.plan_begin">'+formatDate(formatData(contract.building_work,"plan_begin"))+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">geplantes Bauende</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.building_work.plan_end">'+formatDate(formatData(contract.building_work,"plan_end")) +'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Sch&auml;tzwert</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.manager_name">'+contract.estimated_value+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Zeitwert</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.manager_name">'+contract.current_value+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Unterlagen bei</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.manager_name">'+contract.doc_location.person+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '<div class="col-lg-6 col-md-6 col-sm-6">'+
        '<div class="row">'+
        '<div class="col-md-12">'+
        '<label style="color:rgb(123,120,120);font-size:10px;">Unterlagen Zustand</label>'+
        '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div class="col-md-12" style="height:25px;">'+
        '<label class="contractSchema.manager_name">'+contract.doc_location.reason+'</label>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+


        '</div>'+
        '<div class="col-lg-1 col-lg-offset-0 col-md-1 col-md-offset-0 col-sm-1 col-sm-offset-0">'+
        '<div class="row">'+
        '<div class="col-md-12" style="padding-top:8px;padding-left:30px;padding-right:0px;"><a class="hint--left" data-hint="Vorlage ausdrucken" href="#" data-toggle="modal" data-target="#contract-print-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static"><i class="fa fa-print print_userform" style="font-size:25px;"></i></a></div>'+
        '</div>'+
        '<div class="row" style="padding-top:12px;padding-left:30px;"><a class="hint--left" data-hint="Ordner öffnen"><i class="fa fa-folder-open-o openfolde_userform" style="font-size:25px;"></i></a></div>'+
        '<div class="row" style="padding-top:10px;padding-left:30px;"><a class="hint--left" data-hint="Material"><i class="material-icons Material_userform" style="font-size:29px;">local_grocery_store</i></a></div>'+
        '<div class="row" style="padding-left:34px;padding-top:10px;"><a class="hint--left" data-hint="Aufmaß"><i class="fa fa-calculator Aufmass_userform" style="font-size:25px;"></i></a></div>'+
        '<div class="row" style="padding-left:34px;padding-top:14px;"><a class="hint--left" data-hint="Report"><i class="fa fa-line-chart ContractReport_userform" style="font-size:25px;"></i></a></div>'+
        '</div>'+
        '</div>';

}

function formatData(obj, key){
    if(obj)
        return obj[key];
    else
        return 'no value';
}