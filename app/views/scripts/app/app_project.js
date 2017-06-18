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
            $('#'+project_id).after("<tr><td id=\'"+project_id+"_contracts\' colspan='9'></td></tr>");
            data.contracts.forEach((contract) => {
                $('#'+project_id+'_contracts').append(contractDetail(contract));
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

function contractDetail(contract) {
    // `d` is the original data object for the row
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
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding:0px;padding-top:0;padding-left:26px;margin-top:10px;"><a href="#" data-toggle="modal" data-target="#contract-building-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-calendar" style="font-size:30px;"></i></a></div>'+
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
        '<div class="col-lg-2 col-md-2 col-sm-2" style="padding-left:22px;margin-top:14px;"><a href="#" data-toggle="modal" data-target="#contract-ofw-modal" data-contract=\''+JSON.stringify(contract)+'\' data-backdrop="static" class="list-left"><i class="fa fa-road" style="font-size:30px;"></i></a></div>'+
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
        '</div>'+
        '<div class="col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-5 col-sm-offset-0">'+
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
        '<label class="contractSchema.manager_name">'+contract.sum_value+'</label>'+
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
        '<div class="col-md-12" style="padding-top:8px;padding-left:30px;padding-right:0px;"><i class="fa fa-print print_userform" style="font-size:25px;"></i></div>'+
        '</div>'+
        '<div class="row" style="padding-top:12px;padding-left:30px;"><i class="fa fa-folder-open-o openfolde_userform" style="font-size:25px;"></i></div>'+
        '<div class="row" style="padding-top:10px;padding-left:30px;"><i class="material-icons Material_userform" style="font-size:29px;">local_grocery_store</i></div>'+
        '<div class="row" style="padding-left:34px;padding-top:10px;"><i class="fa fa-calculator Aufmass_userform" style="font-size:25px;"></i></div>'+
        '<div class="row" style="padding-left:34px;padding-top:14px;"><i class="fa fa-line-chart ContractReport_userform" style="font-size:25px;"></i></div>'+
        '</div>'+
        '</div>'+
        '<div class="container" style="padding-left:53px;padding-top:15px;margin-top:8px;">'+
        '<div class="col-lg-6 col-md-6 col-sm-6" style="padding-left:39px;">'+
        '<div class="row">'+
        '<label>Comment</label>'+
        '</div>'+
        '<div class="row">'+
        '<textarea class="contractSchema.comment" style="width:99%;">'+'</textarea>'+
        '</div>'+
        '</div>'+
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