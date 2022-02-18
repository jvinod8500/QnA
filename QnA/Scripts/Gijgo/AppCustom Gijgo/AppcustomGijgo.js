    //@*gijgoscript*@
$(document).ready(function () {
    var listmetadata = "", listauthordata;
   //tag script in text box
    $('#textarea input').on('keyup', function (e) {
        debugger
        var key = e.which;
        
        if (key == 188) {
            if ($(this).val().slice(0,-1) !='')
            {
                listmetadata += ($(this).val().slice(0, -1)) + ',';
                $('<button class="btnclr"></button>').text($(this).val().slice(0, -1)).insertAfter($(this));
                $(this).val('').focus();
            }
           
        };
        if (key == 13) {
            if ($(this).val()!='') {
                listmetadata += ($(this).val()) + ',';
                $('<button class="btnclr"></button>').text($(this).val()).insertAfter($(this));
                $(this).val('').focus();
            }
        };
    });

    $('#textarea').on('click', 'button', function (e) {
        debugger
        e.preventDefault();
        var vardel = $(this).text();
        listmetadata = listmetadata.replace(vardel + ',', '');
        //metapopl = metapopl.replace(vardel + ',', '');
        $(this).remove();
        return false;
    })
    $('#Authorarea input').on('keyup', function (e) {
        var key = e.which;
        if (key == 188) {
            if ($(this).val().slice(0, -1) != '') {
                listauthordata += ($(this).val().slice(0, -1)) + ',';
                $('<button class="btnclr"></button>').text($(this).val().slice(0, -1)).insertAfter($(this));
                $(this).val('').focus();
            }
        };
        if (key == 13) {
            if ($(this).val()!= '') {
                listauthordata += ($(this).val()) + ',';
                $('<button class="btnclr"></button>').text($(this).val()).insertAfter($(this));
                $(this).val('').focus();
            }
        };

    });

    $('#Authorarea').on('click', 'button', function (e) {
        debugger
        e.preventDefault();
        var vardel = $(this).text();
        listauthordata = listauthordata.replace(vardel + ',', '');
        //metapopl = metapopl.replace(vardel + ',', '');
        $(this).remove();
        return false;
    })


    //tree gijgo

        var tree = $('#tree').tree({
            dataSource: '/ADLS/GetAdlsFolder',
            textField: 'FolderName',
            uiLibrary: 'bootstrap4',
            iconsLibrary: 'fontawesome',
            primaryKey: 'AdlsFolderId',
            dataBound: function (e) {
                $('#loadingimage').hide();
                tree.css('color', 'darkblue')
            }
        });
        tree.on('collapse', function (e, node, id) {
            grid = $('#grid').grid().destroy();
        });
        tree.on('select', function (e, node, id) {
           debugger
            if (node[0].childElementCount == 1)
            {
                var renderer;
                function Save() {
                    debugger
                    debugger
                    var record = {
                        EntityAttributeId: $('#AttributeId').val(),
                        Description: $('#Description').val(),
                        Metadata: listmetadata.slice(0, -1),
                        Author: listauthordata.slice(0, -1)
                    }
                    $.ajax({ url: '/ADLS/UpdateAttributes', data: record, method: 'POST' })
                     .done(function (e) {
                         debugger
                         grid.reload();
                         dialogupdate.open("");
                         e.displaydata = 'EntityAttribute is Updated';
                         Notificationfn(e)
                         dialog.close();
                     })
                     .fail(function () {
                         alert('Update Failed')
                     });

                }

                function Popup(e) {
                    var metapopl = "", authorpopl = "";
                    listmetadata = "";
                    listauthordata = "";
                    $('.btnclr').remove();
                    if (e.data.record.Metadata != null) {
                        listmetadata = e.data.record.Metadata + ',';
                        metapopl = listmetadata.slice(0, -1).split(',');
                    }
                    for (var i = 0; i < metapopl.length; i++) {
                        $('#textarea').append($('<button class="btnclr"></button>').text(metapopl[i]));
                    }

                    if (e.data.record.Author != null) {
                        listauthordata = e.data.record.Author + ',';
                        authorpopl = listauthordata.slice(0, -1).split(',');
                    }
                    for (var i = 0; i < authorpopl.length; i++) {
                        $('#Authorarea').append($('<button class="btnclr"></button>').text(authorpopl[i]));
                    }
                    $('#AttributeId').val(e.data.id);
                    $('#AttributeName').val(e.data.record.AttributeName);
                    $('#Description').val(e.data.record.Description);

                    $('#btnUpdate').show();
                    dialog.open('EntityAttribute');
                }
                $('#btnUpdate').on('click', Save);

                $('#btnCancel').on('click', function () {
                    $('#textarea').val("");
                    $('#AttributeId').empty();
                    $('#AttributeName').empty();
                    $('#Description').empty();
                    $('#Author').empty();
                    dialog.close();
                });
                dialog = $('#dialog').dialog({
                    uiLibrary: 'bootstrap4',
                    autoOpen: false,
                    resizable: false,
                    modal: true,
                    width: 450

                });
                dialogupdate = $('#dialogupdate').dialog({
                    uiLibrary: 'bootstrap',
                    autoOpen: false,
                    resizable: true,
                    modal: false,
                    width: 350
                });
                updateatt = function (e) {
                    
                    var d = e.data.record;
                    debugger
                    var record = {
                        AttributeId: d.AttributeId,
                        Description: d.Description,
                        Metadata: d.Metadata,
                        Author: d.Author
                    }
                    $.ajax({ url: '/ADLS/UpdateAttributes', data: record, method: 'POST' })
                    .done(function (e) {
                        grid.reload();
                        dialogupdate.open("");
                        e.displaydata = 'EntityAttribute is Updated';
                        Notificationfn(e)
                        //alert('Updated successfully')
                    })
                    .fail(function () {
                        alert('Update Failed')
                    });
                }
                grid = $('#grid').grid().destroy();

                grid = $('#grid').grid({
                    primaryKey: 'EntityAttributeId',
                    responsive: true,
                    uiLibrary: 'bootstrap4',
                    iconsLibrary: 'fontawesome',
                    inlineEditing: { mode: 'command', managementColumn: false },
                    dataSource: '/ADLS/GetAttributes?id=' + id,
                    columns: [
                       { field: 'EntityAttributeId', title: 'ID', width: 56, sortable: true },
                       { field: 'AttributeName', sortable: true,tooltip:"text" },
                       { field: 'Description', editor: true},
                       { field: 'Metadata', editor: true },
                       { field: 'Author', editor: true },
                       { width: 50, tmpl: '<span class="fa fa-pencil gj-cursor-pointer"></span>', title: 'Edit', align: 'center', events: { 'click': Popup } },

                    ],
                    pager: { limit: 8 },
                });
            }

            else
            {
                alert('This is Parent directory!! Please choose child items');
            }
           
           
        });

    });


