/**
 * Created by Zhenyu on 15.06.2017.
 */
(function ($) {
    "use strict";
    $.getScript(  '/scripts/plugins/footable.min.js', function() {
        $('#items-table').footable();
    });

//triggered when modal is about to be shown
    $('#edit-item').on('show.bs.modal', function(e) {
        var item = $(e.relatedTarget).data('item');
        $("#edit-item-title").val(item.title);
        $(".row.note").remove();
        if (item.note.length > 0) {
            item.note.sort(function(a,b){

                if (a.ts > b.ts) {
                    return -1;
                }

                if (a.ts < b.ts) {
                    return 1;
                }

                return 0;
            });
            item.note.forEach(function(note) {
                $("#edit-item-note").append('<div class="row note"><input type="text" class="col-sm-9 form-control" name="content" value="'+note.content+'"><input type="text" class="col-sm-2 form-control" value="'+moment(note.ts).format("DD-MM-YYYY")+'" readonly><input type="hidden" class="form-control" name="ts" value="'+note.ts+'"><a class="col-sm-1 btn btn-icon white" name="remove"><i class="fa fa-remove"></i></a></div>');
            });
        } else {
            $("#edit-item-note").append('<div class="row note"><input type="text" class="col-sm-11 form-control" name="content"><a class="col-sm-1 btn btn-icon white" name="remove"><i class="fa fa-remove"></i></a></div>');
        }

        $("#edit-item-priority").val(item.priority);
        $("#edit-item-status").val(item.status);
        $("#submit-button").append('<input type="hidden" class="form-control" name="id" value="'+item._id+'">');
        $("a[name='remove']").click(function (e) {
            $(this).parent().remove();
        });
    });

    $("#add-note").click(function() {
        $("#edit-item-note").append('<div class="row note"><input type="text" class="col-sm-11 form-control" name="content"><a class="col-sm-1 btn btn-icon white" name="remove"><i class="fa fa-remove"></i></a></div>');
        $("a[name='remove']").click(function (e) {
            $(this).parent().remove();
        });

    });

    $("#edit-item-form").on("submit", function(event){
        event.preventDefault();
        var item = {
            '_id': $(this).find('input[name="id"]').val(),
            'title': $(this).find('input[name="title"]').val(),
            'priority': $(this).find('select[name="priority"]').val(),
            'status': $(this).find('select[name="status"]').val(),
            'note': []
        };
        $( ".row.note" ).each(function() {
            item.note.push({"content": $(this).find('input[name="content"]').val(), "ts": $(this).find('input[name="ts"]').val()});
        });
        $.ajax({
            type: "POST",
            url: "/items/edit",
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(item),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            complete: function(XHR, TS){window.location.reload();}
        });
    });


    $('#del-item').on('show.bs.modal', function(e) {
        $("#delitemtitle").html($(e.relatedTarget).data('item-tilte'));
        $(this).find('.danger').attr('href', $(e.relatedTarget).data('href'));
    });


})(jQuery);

function onChangeItemsStatus(){
    // get all checked items
    let id_array = [];
    $('[name=check_row]:checked').each(function(index) {
        id_array.push(this.dataset.id);
    });
    if(id_array.length <= 0){
        bootbox.alert('Please choose at least one item!');
        return;
    }
    let status = $('#item_edit_status_value').val();
    modify_item_status(id_array, status);
}

function modify_item_status(ids, status){
    if(ids.length > 0){
        url = '/items/edit/status';
        data = {
            ids:ids,
            status:status
        }
        $.ajax({
            type: "POST",
            url: url,
            // The key needs to match your method's input parameter (case-sensitive).
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            complete: function(XHR, TS){window.location.reload();}
        });
    }
}

function checkAll(checked){
    $('[name=check_row]').each(function(index) {
        if(checked)
            this.checked = true;
        else
            this.checked = false;
    });
}

function changeStatusNext(ele){
    let ids = [];
    ids.push(ele.dataset.id);
    switch(ele.dataset.status) {
        case 'Open':
            modify_item_status(ids, 'Pause');
            break;
        case 'Pause':
            modify_item_status(ids, 'Closed');
            break;
        case 'Closed':
            modify_item_status(ids, 'Open');
            break;
    }
}