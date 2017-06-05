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
            $("#files_path").attr("href", 'file:///'+project.files_path);
            $("#files_path").html(project.files_path);
            $("#linesplan_files_path").attr("href", 'file:///'+project.linesplan_files_path);
            $("#linesplan_files_path").html(project.linesplan_files_path);
        } else {
            //set title
            $('#project-modal-title').text('Add Project');

            //set form action
            $('#project-modal-form').attr('action', '/projects/add');

        }
    });

    var projects_table = $('#projects-overview').DataTable();

    // loading the contracts of a project
    $('#projects-overview tbody').on('click', 'td.details-control', function (e) {
        // Stop form submitting normally
        e.preventDefault();

        var projects_tr = $(this).closest('tr');
        var projects_table_row = projects_table.row(projects_tr);
        var project_id = projects_table_row.data()[1];

        if (projects_table_row.child.isShown()) {
            // This row is already open - close it
            projects_table_row.child.hide();
            projects_tr.removeClass('shown');
        }
        else {
            // Open this row
            projects_table_row.child('<table id="' + project_id + '"class="table table-striped b-t b-b dataTable no-footer" cellpadding="5" ui-jp="dataTable" cellspacing="0" border="0" style="padding-left:50px;"></table>').show();
            // set subTableid,use project_id

            var subTable = loadContractsOfProject(project_id);

            $(subTable.table().header()).remove();
            projects_tr.addClass('shown');

            $('#' + project_id + ' tbody').on('click', 'td.details-control-sub', function () {
                var tr = $(this).closest('tr');
                var row = subTable.row(tr);
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                } else {
                    row.child(contractDetail(row.data())).show();
                    tr.addClass('shown');
                }
            });

        }
    });

});

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
        '<label>Sum Value</label>'+
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
        '<button onclick="printTemplate(\'' + d.id + '\')" type="submit" class="btn success">打印模板</button>' +
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