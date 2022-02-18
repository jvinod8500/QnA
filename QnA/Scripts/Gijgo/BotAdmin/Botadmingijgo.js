var grid, rolegrid, usergrid, UserRoleMapgrid,noticationmsg, roles = [], styles = [];
$(document).ready(function () {
    function Popuprole(e) {
        $('#RRoleId').val(e.data.id);
        $('#RRoleName').val(e.data.record.RoleName);
        $('#RRolePurpose').val(e.data.record.RoleName);
        $('#RoleDescription').val(e.data.record.Description);
        $('#RoleModifiedBy').val(e.data.record.ModifiedBy);
        $('#RoleCreatedBy').val(e.data.record.CreatedBy);
        $('#modifiedbydiv').show();
        $('#rolebtnSave').hide();
        $('#rolebtnUpdate').show();
        $('#rolebtnDelete').show();
        dialogRole.open('Role');
    }
    $('#MapbtnSave').on('click', SaveUserRoleMap);
    $('#MapbtnUpdate').on('click', SaveUserRoleMap);
    $('#MapbtnDelete').on('click', DeleteUserRoleMap);
    $('#MapbtnCancel').on('click', function () {
        dialogUserRoleMap.close();
    });

    $('#rolebtnSave,#rolebtnUpdate').on('click', function () {
        debugger
        if ($('.required').val() == '') {
            alert('Please Enter the required fields')
        }
        else {
            var record = {
                RoleId: $('#RRoleId').val(),
                RoleName: $('#RRoleName').val(),
                RolePurpose: $('#RRolePurpose').val(),
                Description: $('#RoleDescription').val(),
                ModifiedBy: $('#RoleModifiedBy').val(),
                CreatedBy: $('#RoleCreatedBy').val()
            };
            if (record.RoleId != 0) {
                $.ajax({ url: '/Home/UpdateRole', data: record, method: 'POST' })
               .done(function (e) {
                   debugger
                   if (e.success) {
                       dialogupdate.open("");
                       dialogRole.close();
                       rolegrid.reload();
                       UserRoleMapgrid.reload();
                       noticationmsg = 'One Role is Updated';
                       Notificationfn(noticationmsg)
                   }
                   else if (e.success) {
                       alert("Failed to Update")
                   }
                   else {
                       alert("Failed to Update")
                   }
               })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
            else {

                $.ajax({ url: '/Home/SaveRole', data: record, method: 'POST' })
                .done(function (e) {
                    debugger
                    if (e.success) {
                        dialogsuccess.open("");
                        dialogRole.close();
                        rolegrid.reload();
                        UserRoleMapgrid.reload();
                        noticationmsg = 'One Role is Inserted';
                        Notificationfn(noticationmsg)
                    }
                    else if (e === "Required") {
                        alert("Please enter requierd feilds")
                    }
                    else {
                        alert("Failed to save")
                    }
                })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
        }


    });

    $('#rolebtnDelete').on('click', function () {
        debugger
        var record = {
            RoleId: $('#RRoleId').val(),
        };
        var result = confirm("Want to delete?");
        if (result) {
              $.ajax({ url: '/Home/DeleteRole', data: record, method: 'POST' })
                        .done(function (e) {
                            dialogdelete.open("");
                            dialogRole.close();
                            rolegrid.reload();
                            noticationmsg = 'One Role is Deleted';
                            Notificationfn(noticationmsg);
                        })
                        .fail(function () {
                            alert('Failed to delete role.');
                        });
        }
     

    });

    $('#stylebtnSave,#stylebtnUpdate').on('click', function () {
        debugger
        if ($('.required').val() == '') {
            alert('Please Enter the required fields')
        }
        else {
            var record = {
                StyleId: $('#SStyleId').val(),
                StyleName: $('#SStyleName').val(),
                HeadingFont: $('#SHeadingFont').val(),
                NormalFont: $('#SNormalFont').val(),
                BackgroundColor: $('#SBackgroundColor').val(),
                ForeColor: $('#SForeColor').val(),
                StyleNotes: $('#SStyleNotes').val(),
                FontSize: $('#SFontSize').val(),
                ModifiedBy: $('#SModifiedBy').val(),
                CreatedBy: $('#SCreatedBy').val()
            };
            if (record.StyleId != 0) {
                $.ajax({ url: '/BotAdmin/UpdateBotAdminStyle', data: record, method: 'POST' })
               .done(function (e) {
                   debugger
                   if (e.success) {
                       dialogupdate.open("");
                       dialogStyle.close();
                       stylegrid.reload();
                       e.displaydata = 'One Style is Updated';
                       Notificationfn(e)
                   }
                   else if (e.success) {
                       alert("Failed to Update")
                   }
                   else {
                       alert("Failed to Update")
                   }
               })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
            else {

                $.ajax({ url: '/BotAdmin/SaveBotAdminStyle', data: record, method: 'POST' })
                .done(function (e) {
                    debugger
                    if (e.success) {
                        dialogsuccess.open("");
                        dialogStyle.close();
                        stylegrid.reload();
                        e.displaydata = 'One Style is Inserted';
                        Notificationfn(e)
                    }
                    else if (e === "Required") {
                        alert("Please enter requierd feilds")
                    }
                    else {
                        alert("Failed to save")
                    }
                })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
        }


    });
    $('#stylebtnDelete').on('click', function () {
        debugger
        var record = {
            StyleId: $('#SStyleId').val(),
        };

        $.ajax({ url: '/BotAdmin/DeleteBotAdminStyle', data: record, method: 'POST' })
                        .done(function (e) {
                            if (e.Deleted)
                            {
                                dialogdelete.open("");
                                dialogStyle.close();
                                stylegrid.reload();
                                e.displaydata = 'One Style is Deleted';
                                Notificationfn(e)
                            }
                            else {
                                alert('Failed to Delete because it is referrenced in another table');
                            }
                        })
                        .fail(function () {
                            alert('Failed to delete Style.');
                        });

    });

    function SaveUserRoleMap() {
        debugger
        if ($('.required').val() == '') {
            alert('Please Enter the required fields')
        }
        else {
            var record = {
                UserRoleMapId: $('#UserRoleMapId').val(),
                RoleId: $('#MapRoleId').val(),
                UserId: $('#MapUserId').val(),
                IsPrimary: $('#MapIsPrimary').prop('checked'),
                Description: $('#MapDescription').val(),
                CreatedBy: $('#MapCreatedBy').val()
            };
            if (record.UserRoleMapId != 0) {
                $.ajax({ url: '/Home/UpdateUserRoleMap', data: record, method: 'POST' })
               .done(function (e) {
                   debugger
                   if (e.success) {
                       dialogupdate.open("");
                       dialogUserRoleMap.close();
                       UserRoleMapgrid.reload();
                       noticationmsg = 'One User-Role Map is Inserted';
                       Notificationfn(noticationmsg)
                   }
                   else if (e.success) {
                       alert("Failed to Update")
                   }
                   else {
                       alert("Failed to Update")
                   }
               })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
            else {

                $.ajax({ url: '/Home/SaveUserRoleMap', data: record, method: 'POST' })
                .done(function (e) {
                    debugger
                    if (e.success) {
                        dialogsuccess.open("");
                        dialogUserRoleMap.close();
                        UserRoleMapgrid.reload();
                        noticationmsg = 'One User-Role Map is Updated';
                        Notificationfn(noticationmsg);
                    }
                    else if (e === "Required") {
                        alert("Please enter requierd feilds")
                    }
                    else {
                        alert("Failed to save")
                    }
                })
                .fail(function () {
                    alert('Failed to save.');
                    dialogOffering.close();
                });
            }
        }


    }
    function DeleteUserRoleMap() {
        var record = {
            OfferingId: $('#RoleStyleMapId').val(),
        };
        var result = confirm("Want to delete?");
        if (result) {
            $.ajax({ url: '/Home/DeleteUserRoleMap', data: record, method: 'POST' })
                       .done(function (e) {
                           dialogdelete.open("");
                           dialogUserRoleMap.close();
                           UserRoleMapgrid.reload();
                           noticationmsg = 'One User-Role Map is Deleted';
                           Notificationfn(noticationmsg)
                       })
                       .fail(function () {
                           alert('Failed to delete.');
                       });
        }
       

    }
    $('#btnUserSearch').on('click', function () {
        debugger
        usergrid.reload({ page: 1, UserName: $('#txtusername').val() });
    });
    $('#btnUserClear').on('click', function () {
        debugger
        $('#txtusername').val('');
        usergrid.reload({ page: 1, UserName: '' });
    });
    $('#btnRoleSearch').on('click', function () {
        rolegrid.reload({ page: 1, RoleName: $('#txtrolename').val()});
    });
    $('#btnRoleClear').on('click', function () {
        $('#txtrolename').val('');
        rolegrid.reload({ page: 1, RoleName: ''});
    });
    $('#btnMapSearch').on('click', function () {
        debugger
        UserRoleMapgrid.reload({ page: 1, UserName: $('#txtmapusername').val(), RoleName: $('#txtmaprolename').val() });
        //subgrid.reload({ page: 1, UserName: $('#txtmapusername').val(), RoleName: $('#txtmaprolename').val(), IsObsolete: $('#xtIsObsolete').prop('checked') });
    });
    $('#btnMapClear').on('click', function () {
        debugger
        $('#txtmapusername').val('');
        $('#txtmaprolename').val('');
        //$('#xtIsactive').prop('checked', false);
        //$('#xtIsObsolete').prop('checked', false);
        UserRoleMapgrid.reload({ page: 1, UserName: '', RoleName: '' });
    });

    $.ajax({
        
        type:"GET",
        url: "/Home/GetRoles",
        success: function (data) {
            debugger
            for (var i = 0; i < data.records.length; i++) {
                roles.push(data.records[i].RoleName)
            }
                
        }, async: false
    }),
 
   
   
    //user
    usergrid = $('#Usergrid').grid({
        dataSource: "/Home/GetUsers",
        primaryKey: 'UserId',
        //inlineEditing: { mode: 'command' },
        responsive: true,
        uiLibrary: 'bootstrap',
        iconsLibrary: 'fontawesome',
        columns: [
            { field: 'UserId', title: 'ID', width: 40 },
            { field: 'UserName' },
            { field: 'UserEmail' },
            { field: 'Description' },

        ],
        pager: { limit: 8 }
    });

    //role grid
    rolegrid = $('#Rolegrid').grid({
        dataSource: "/Home/GetRoles",
        primaryKey: 'RoleId',
        //inlineEditing: { mode: 'command' },
        responsive: true,
        uiLibrary: 'bootstrap',
        columns: [
            { field: 'RoleId', title: 'ID', width: 40 },
            { field: 'RoleName', type: 'dropdown', editor: { dataSource: roles } },
            { field: 'RolePurpose', type: 'dropdown', editor: { dataSource: styles } },
            { field: 'Description', editor: true },
            { field: 'CreatedBy', editor: true },
            { field: 'ModifiedBy' ,editor: true},
            { width: 60, tmpl: '<span class="fa fa-pencil gj-cursor-pointer"></span>', title: 'Edit', align: 'center', events: { 'click': Popuprole } },

        ],
        pager: { limit: 8 }
    });
  
    //UserRoleMapgrid
    UserRoleMapgrid = $('#UserRoleMapgrid').grid({
        dataSource: "/Home/GetUserRoleMap",
        primaryKey: 'UserRoleMapId',
        inlineEditing: { mode: 'command' },  
        uiLibrary: 'bootstrap',
        columns: [
            { field: 'UserRoleMapId', title: 'ID', width: 40 },
            { field: 'UserName'},
            { field: 'RoleName' ,type: 'dropdown', editor: { dataSource: roles } },
            { field: 'IsPrimary' },
            { field: 'Description', editor: true },
            { field: 'CreatedBy', editor: true },
            { field: 'ModifiedBy' },
            { field: 'CreatedDate', hidden:true},
            { field: 'ModifiedDate', hidden: true },
        ],
        pager: { limit: 8 }
    });
    UserRoleMapgrid.on('rowDataChanged', function (e, id, record) {
        debugger
        // Format the date to format that is supported by the backend.
        //record.DateOfBirth = gj.core.parseDate(record.DateOfBirth, 'mm/dd/yyyy').toISOString();
        // Post the data to the server
        $.ajax({ url: '/Home/UpdateUserRoleMap', data: record, method: 'POST' })
            .done(function (e) {
                UserRoleMapgrid.reload();
                dialogupdate.open("");
                noticationmsg = 'One User-Role Map is Updated';
                Notificationfn(noticationmsg)
            })
            .fail(function () {
                alert('Failed to save.');
            });
    });
    UserRoleMapgrid.on('rowRemoving', function (e, $row, id, record) {
        debugger
        if (confirm('Are you sure?')) {
            $.ajax({ url: '/Home/DeleteUserRoleMap', data: record, method: 'POST' })
                .done(function (e) {
                    dialogdelete.open();
                    UserRoleMapgrid.reload();
                    noticationmsg = 'One User-Role Map is Deleted';
                    Notificationfn(noticationmsg)
                })
                .fail(function () {
                    alert('Failed to delete.');
                });
        }
    });

    $('#btnAddUserRoleMap').on('click', function () {
        debugger
        $('#UserRoleMapId').val(0);
        $('#MapRoleId').val('');
        $('#MapUserId').val('');
        $('#MapDescription').val('');
        $('#IsPrimary').val('');
        $('#MapCreatedBy').val('');
        $('#MapbtnUpdate').hide();
        $('#MapbtnSave').show();
        $('#MapbtnDelete').hide();
        dialogUserRoleMap.open('User-Role Mapping');
    });
    $('#btnAddRole').on('click', function () {
        debugger
        $('#RRoleId').val(0);
        $('#RRoleName').val('');
        $('#RRolePurpose').val('');
        $('#RoleDescription').val('');
        $('#RoleCreatedBy').val('');
        $('#modifiedbydiv').hide();
        $('#rolebtnUpdate').hide();
        $('#rolebtnSave').show();
        $('#rolebtnDelete').hide();
        dialogRole.open('Role');
    });
    $('#btnAddUser').on('click', function () {
        debugger
        $('#SStyleId').val(0);
        $('#SStyleName').val('');
        $('#SHeadingFont').val('');
        $('#SNormalFont').val('');
        $('#SBackgroundColor').val('');
        $('#SForeColor').val('');
        $('#SStyleNotes').val('');
        $('#SFontSize').val('');
        $('#SModifiedBy').val('');
        $('#modifiedbydiv2').hide();
        $('#stylebtnUpdate').hide();
        $('#stylebtnSave').show();
        $('#stylebtnDelete').hide();
        dialogStyle.open('Role');
    });
    //di   $('#SCreatedBy').val()alog assigning
    dialogUserRoleMap = $('#dialogUserRoleMap').dialog({
        uiLibrary: 'bootstrap',
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 400
    });
    dialogRole = $('#dialogRole').dialog({
        uiLibrary: 'bootstrap',
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 400
    });
    dialogUser = $('#dialogUser').dialog({
        uiLibrary: 'bootstrap',
        autoOpen: false,
        resizable: false,
        modal: true,
        scrollable: true,
        height: 300,
        uiLibrary: 'bootstrap',
        width: 400
    });
    dialogsuccess = $('#dialogsuccess').dialog({
        uiLibrary: 'bootstrap4',
        autoOpen: false,
        resizable: true,
        modal: true,
        width: 350
    });
    dialogupdate = $('#dialogupdate').dialog({
        uiLibrary: 'bootstrap4',
        autoOpen: false,
        resizable: true,
        modal: true,
        width: 350
    });
    dialogdelete = $('#dialogdelete').dialog({
        uiLibrary: 'bootstrap4',
        autoOpen: false,
        resizable: true,
        modal: true,
        title: 'Message',
        width: 350
    });
});

