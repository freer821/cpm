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

    $('#projects-overview tbody').on('click', 'td.details-control', function (e) {
        var row = $(this).closest('tr');

    });

});

function showContracts(project_id) {
    $('#'+project_id).addClass("shown");
    $.get( '/projects/'+project_id+'/contracts', function( data ) {
        if (data.contracts && data.contracts.length > 0) {
            $('#'+project_id).after("<tr><td colspan='9'><table class='table'><tbody id=\'"+project_id+"_contracts\'></tbody></table></td></tr>");
            data.contracts.forEach((contract) => {
                $('#'+project_id+'_contracts').append(contractOverview(contract));
            });
        } else {
            console.log("no data");
        }
    });
}

function hideContracts(project_id) {
    $('#'+project_id).removeClass("shown");
    $('#'+project_id+'_contracts').parent().remove();
}

function loadContractsOfProject(project_id) {
    return $('#' + project_id).DataTable({
        "info": false,
        "paging": false,
        "ordering": false,
        "searching": false,
        "ajax": '/projects/'+project_id+'/contracts',
        "columns": [
            {
                "className": 'details-control-sub',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {"data": "id"},
            {"data": "contract_street"},
            {"data": "work_content"},
            {"data": "cost_code"},
            {"data": "customer"},
            {"data": "total_status"},
            {
                "data": function (row, type, full, meta) {
                    return '<a href="#" data-toggle="modal" data-target="#contract-basic-modal" data-contract=\''+JSON.stringify(row)+'\' data-backdrop="static"><i class="material-icons md-24">&#xe3c9;</i></a>';
                }
            },
            {
                "data": function (row, type, full, meta) {
                    return '<a onclick="delContract(this)" data-contract=\''+JSON.stringify(row)+'\'><i class="material-icons md-24">&#xe872;</i></a>';
                }
            }            
        ]
    });
}

function contractOverview (d) {
    // generate contract overview
        return formatContractStatus('') +
                        '<td class="2nd_unfold" style="margin-left:0px;width:40px;min-width:40px;max-width:40px;"><i class="fa fa-chevron-circle-right" style="font-size:18px;"></i></td>'+
                        '<td class="2nd_unfold" style="margin-left:0px;min-width:32px;max-width:32px;width:32px;"><i class="fa fa-check-square-o" style="font-size:20px;color:rgb(131,175,155);"></i></td>'+
                        '<td class="contractSchema.id" style="width:150px;min-width:150px;max-width:150px;">H00002-17-44-0001 </td>'+
                        '<td class="contractSchema.street&amp;contractSchema.housenr" style="min-width:150px;">Muster str. 1</td>'+
                        '<td class="contractSchema.work_content" style="min-width:150px;">all typen</td>'+
                        '<td class="contractSchema.cost_code" style="min-width:80px;">734044 </td>'+
                        '<td class="contractSchema.customer" style="min-width:70px;">STW </td>'+
                        '<td class="contractSchema.contract_id" style="min-width:110px;">450003971 </td>'+
                        '<td class="contract_edit" style="min-width:45px;max-width:45px;"><i class="fa fa-pencil-square-o" style="font-size:22px;margin-left:4px;color:rgba(131,175,155,0.8);min-width:22px;"></i></td>'+
                        '<td class="contract_types&amp;lock" style="height:42px;padding:0px;min-width:92px;width:92px;max-width:92px;">'+
                            '<div style="padding:0px;height:40px;">'+
                                '<div style="height:42px;min-height:0px;font-size:0px;">'+
                                    '<table class="table">'+
                                        '<thead>'+
                                            '<tr></tr>'+
                                        '</thead>'+
                                        '<tbody style="height:42px;">'+ 
                                            '<tr style="height:15%;">'+
                                                '<td rowspan="0" style="width:40%;padding-top:10%;padding-left:10%;padding-bottom:10%;padding-right:0%;height:42px;"><i class="fa fa-unlock-alt contract_lock_false" style="font-size:22px;margin-left:4px;color:rgba(131,175,155,0.8);min-width:22px;"></i></td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.electric" style="width:5%;padding:0;background-color:#b53f45;">1</td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.gas" style="width:5%;padding:0;background-color:#ffd000;">1</td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.water" style="width:5%;padding:0;height:42px;background-color:#3e6b7e;">1</td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.light" style="width:5%;padding:0;background-color:#91c0ab;">1</td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.telecom" style="width:5%;padding:0;background-color:#f87e7b;">1</td>'+
                                                '<td rowspan="0" class="projectSchema.contract_types.others" style="width:5%;padding:0;background-color:#333333;">1</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                    '</tr>';
}

function formatContractStatus(status){
    switch (status) {
        case 'finished':
            return;
        default:
            return '<tr class="contract_finished" style="color:rgba(131,175,155,0.8);">';
    }
    
}

function contractDetail(d) {
    // `d` is the original data object for the row
    return '<div style="font-size:18px">' +

        '<div class="row row-sm">'+
        '<div class="col-sm-1">'+
        '<div class="md-form-group" style="padding: 12px 16px;">'+
        '<a href="#" data-toggle="modal" data-target="#contract-permissions-modal" data-contract=\''+JSON.stringify(d)+'\' data-backdrop="static" class="list-left">' +
        '<span class="w-40 circle accent">' +
        '<i class="fa fa-envelope"></i>' +
        '</span>' +
        '</a>' +
        '</div>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatData(d, 'permissions_status' ) +'" readonly>'+
        '<label>Permission Status</label>'+
        '</div>'+
        '</div>'+         
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatData(d, 'manager_name' ) +'">'+
        '<label>Manager Name</label>'+
        '</div>'+
        '</div>'+ 
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatData(d.building_work,"worker_name")+'">'+
        '<label>Worker Name</label>'+
        '</div>'+
        '</div>'+
        '</div>'+

        '<div class="row row-sm">'+
        '<div class="col-sm-1">'+
        '<div class="md-form-group" style="padding: 12px 16px;">'+
        '<a href="#" data-toggle="modal" data-target="#contract-building-modal" data-contract=\''+JSON.stringify(d)+'\' data-backdrop="static" class="list-left">' +
        '<span class="w-40 circle green">' +
        '<i class="fa fa-smile-o"></i>' +
        '</span>' +
        '</a>' +
        '</div>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+getBuildingStatus(formatData(d.building_work,"status")) +'" readonly>'+
        '<label>Building Status</label>'+
        '</div>'+
        '</div>'+           
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatDate(formatData(d.building_work,"plan_begin"))+'">'+
        '<label>Building Begin</label>'+
        '</div>'+
        '</div>'+ 
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatDate(formatData(d.building_work,"plan_end"))+'">'+
        '<label>Building End</label>'+
        '</div>'+
        '</div>'+
        '</div>'+

        '<div class="row row-sm">'+
        '<div class="col-sm-1">'+
        '<div class="md-form-group" style="padding: 12px 16px;">'+
        '<a href="#" data-toggle="modal" data-target="#contract-ofw-modal" data-contract=\''+JSON.stringify(d)+'\' data-backdrop="static" class="list-left">' +
        '<span class="w-40 circle warn">' +
        '<i class="fa fa-flash"></i>' +
        '</span>' +
        '</a>' +
        '</div>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+formatData(d.ofw, "ofw_status") +'" readonly>'+
        '<label>OFW Status</label>'+
        '</div>'+
        '</div>'+          
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+d.sum_value+'">'+
        '<label>Estimated Value</label>'+
        '</div>'+
        '</div>'+ 
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+d.current_value+'">'+
        '<label>Current Value</label>'+
        '</div>'+
        '</div>'+
        '</div>'+

        '<div class="row row-sm">'+
        '<div class="col-sm-1">'+
        '<div class="md-form-group" style="padding: 12px 16px;">'+
        '<a href="#" data-toggle="modal" data-target="#contract-invoices-modal" data-contract=\''+JSON.stringify(d)+'\' data-backdrop="static" class="list-left">' +
        '<span class="w-40 circle danger">' +
        '<i class="fa fa-database"></i>' +
        '</span>' +
        '</a>' +
        '</div>'+
        '</div>'+
        '<div class="col-sm-4">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+getInvoiceStatus(d.invoices_status) +'" readonly>'+
        '<label>Invoice Status</label>'+
        '</div>'+
        '</div>'+         
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+d.doc_location.person+'">'+
        '<label>Doc location Person</label>'+
        '</div>'+
        '</div>'+ 
        '<div class="col-sm-3">'+
        '<div class="md-form-group">'+
        '<input class="md-input" value="'+d.doc_location.reason+'">'+
        '<label>Doc location Reason</label>'+
        '</div>'+
        '</div>'+
        '</div>'+



        '<ul class="list inset m-0">' +

        '<li class="list-item">' +
        '<div class="md-form-group">' +
        '<textarea class="md-input" rows="3" data-minwords="6" ' +
        'required="">' + d.comment + '</textarea>' +
        '<label>Kommentar</label>'+
        '</div>' +
        '</li>' +
        '<li class="list-item">' +
        '<div class="form-group row">' +
        '<div class="col-md-1">' +
        '<button type="submit" class="btn success">打开文件夹</button>' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button data-toggle="modal" data-target="#contract-print-modal" data-backdrop="static" class="btn success">打印模板</button>' +
        '</div>' +
        '<div class="col-md-1">' +
        '<button type="submit" class="btn success">建立XXX</button>' +
        '</div>' +
        '<div class="col-md-2">' +
        '</div>' +
        '</div>' +
        '</li>' +
        '</ul>' +
        '</div>';
}

function delContract(element){
    var contract = element.dataset.contract;
    contract = eval('(' + contract + ')');
    if(contract){
        bootbox.confirm("are you sure to delete contract: "+contract.id+"?", function(result){ 
            if(result){
                let url = "/contracts/"+contract._id+"/del/item";
                //let project_id = contract.project_id;
                ajaxPost(url,{'project_id':''});
            }
        });
    }
}

function formatData(obj, key){
    if(obj)
        return obj[key];
    else
        return 'no value';
}