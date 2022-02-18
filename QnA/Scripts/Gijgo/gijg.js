
var grid, dialog, dialogtest;
function Popup(e) {
    var dt = new Date(parseInt(e.data.record.CreatedDate.substr(6)));
    $('#TestSuiteId').val(e.data.id);
    $('#TestSuite1').val(e.data.record.TestSuite1);
    $('#TestSuiteDescription').val(e.data.record.TestSuiteDescription);
    $('#IsActive').prop('checked', e.data.record.IsActive);
    $('#TestSuiteOwner').val(e.data.record.TestSuiteOwner);
    $('#CreatedDate').val(dt);
    $('#CreatedBy').val(e.data.record.CreatedBy);
    $('#btnUpdate').show();
    $('#btnDelete').show();
    $('#btnSave').hide();
    dialog.open('TestSuite');
}
function Popuptest(e) { 
    var dt = new Date(parseInt(e.data.record.CreatedDate.substr(6)));
    $('#TestCaseId').val(e.data.id);
    $('#TestSuiteId').val(e.data.record.TestSuiteId);
    $('#PipelineStageId').val(e.data.record.PipelineStageId);
    $('#TestCaseTypeId').val(e.data.record.TestCaseTypeId);
    $('#TestCaseName').val(e.data.record.TestCaseName);
    $('#Description').val(e.data.record.Description);
    $('#IsActive1').prop('checked', e.data.record.IsActive);
    $('#IsObsolete').prop('checked', e.data.record.IsObsolete);
    $('#ObsoleteReason').val(e.data.record.ObsoleteReason);
    $('#CreatedDate').val(dt);
    $('#CreatedBy').val(e.data.record.CreatedBy);
    $('#tbtnUpdate').show();
    $('#tbtnDelete').show();
    $('#tbtnSave').hide();
    dialogtest.open('TestCase');
}
function Save() {
    var record = {
        TestSuiteId: $('#TestSuiteId').val(),
        TestSuite1: $('#TestSuite1').val(),
        TestSuiteDescription: $('#TestSuiteDescription').val(),
        IsActive: $('#IsActive').prop('checked'),
        TestSuiteOwner: $('#TestSuiteOwner').val(),
        CreatedDate: $('#CreatedDate').val(),
        CreatedBy: $('#CreatedBy').val(),
    };
    if (record.TestSuiteId != 0) {
                
        $.ajax({ url: '/Validation/UpdateTestSuite', data: record, method: 'POST' })
        .done(function () {
            var $log = $("#lalert"),
            str = "<p class='alert alert-dismissable'>TestSuite Updated Successfully<a href='#' class='close' data-dismiss='alert' aria-label='close'>×</A></p>"
            html = $.parseHTML(str),
           nodeNames = [];
            // Append the parsed HTML
            $log.append(html);
            dialog.close();
            grid.reload();
        })
        .fail(function () {
            $('#lerror').text('We cant delete the this item which is referencing in other tables')
            dialog.close();
        });
    }
    else {
                 
        $.ajax({ url: '/Validation/SaveTestSuite', data: record, method: 'POST' })
       .done(function () {
           //alert(JSON.stringify(response.success));
           //if (response.success == false) {
           //    alert("Problem in saving Testsuite")
           //};

           dialog.close();
           grid.reload();
       })
       .fail(function () {
           alert('Failed to save.');
           dialog.close();
       });
    }

}
function Delete() {
    var record = {
        TestSuiteId: $('#TestSuiteId').val(),
        TestSuite1: $('#TestSuite1').val(),
        TestSuiteDescription: $('#TestSuiteDescription').val(),
        TestSuiteOwner: $('#TestSuiteOwner').val(),
        CreatedDate: $('#CreatedDate').val(),
        CreateBy: $('#CreateBy').val(),
    };
           
    $.ajax({ url: '/Validation/DeleteTestSuite', data: record, method: 'POST' })
                  .done(function () {
                      dialog.close();
                      grid.reload();

                  })
                  .fail(function () {
                      alert('Failed to delete.');
                  });

}

function Savetestcase() {
    var record = {
        TestSuiteId: $('#TestSuiteId').val(),
        TestCaseId: $('#TestCaseId').val(),
        TestCaseName: $('#TestCaseName').val(),
        PipelineStageId: $('#PipelineStageId').val(),
        TestCaseTypeId: $('#TestCaseTypeId').val(),
        Description: $('#Description').val(),
        IsActive: $('#IsActive1').prop('checked'),
        IsObsolete: $('#IsObsolete').prop('checked'),
        ObsoleteReason: $('#ObsoleteReason').val(),
        CreatedDate: $('#CreatedDate').val(),
        CreatedBy: $('#CreatedBy').val(),
    };
      
    if (record.TestCaseId != 0) {
        $.ajax({ url: '/Validation/kendoUpdateGettestcases', data: record, method: 'POST' })
        .done(function () {
            var $log = $("#lalert"),
            str = "<p class='alert alert-dismissable'>TestSuite Updated Successfully<a href='#' class='close' data-dismiss='alert' aria-label='close'>×</A></p>"
            html = $.parseHTML(str),
           nodeNames = [];
            // Append the parsed HTML
            $log.append(html);
            dialogtest.close();
            grid.reload();
        })
        .fail(function () {
            $('#lerror').text('We cant delete the this item which is referencing in other tables')
            dialogtest.close();
        });
    }
    else {
        $.ajax({ url: '/Validation/kendosaveGettestcases', data: record, method: 'POST' })
       .done(function () {
           //alert(JSON.stringify(response.success));
           //if (response.success == false) {
           //    alert("Problem in saving Testsuite")
           //};

           dialog.close();
           grid.reload();
       })
       .fail(function () {
           alert('Failed to save.');
           dialog.close();
       });
    }

}
function DeleteTestcase() {
    var record = {
        TestCaseId: $('#TestCaseId').val(),
    };
    $.ajax({ url: '/Validation/DeleteTestCase', data: record, method: 'POST' })
                  .done(function () {
                      dialogtest.close();
                      grid.reload();

                  })
                  .fail(function () {
                      alert('Failed to delete.');
                  });

}
function showMe(it, box) {
    var vis = (box.checked) ? "block" : "none";
    document.getElementById(it).style.display = vis;
}
$(document).ready(function () {
    grid = $('#grid').grid({
        primaryKey: 'TestSuiteId',
        uiLibrary: 'bootstrap4',
        iconsLibrary: 'fontawesome',
        dataSource: '/Validation/jqueryGettestsuites',
                   
        columns: [
            { field: 'TestSuiteId', sortable: true, width: 64,title:'Id' },
            { field: 'TestSuite1', sortable: true, editor: false, title: 'TestSuiteName' },
            { field: 'TestSuiteDescription', editor: false },
            { field: 'IsActive', editor: false, width: 80 },
            { field: 'TestSuiteOwner', editor: false },
            { field: 'CreatedDate', title: 'Created Date', type: 'date', format: 'mm/dd/yyyy', sortable: true, editor: true, width: 120 },
            { field: 'CreatedBy', title: 'Created By', width: 120 },
            { width: 64, tmpl: '<span class="material-icons gj-cursor-pointer">edit</span>', align: 'center', events: { 'click': Popup } },
            //{ width: 64, tmpl: '<span class="material-icons gj-cursor-pointer">delete</span>', align: 'center', events: { 'click': Popup } }
        ],
        pager: { limit: 8 },

        detailTemplate: ' <div id="subgri" style="width:100%" class="col-md-offset-1"><form class="display-inline"><input id="txtTestcase" type="text" placeholder="Testcasename..." class="gj-textbox-md gj-display-inline-block gj-width-200" />IsActive &nbsp;<input id="xtIsactive" type="checkbox"class="gj-display-inline-block"/>&nbsp;&nbsp;&nbsp;&nbsp;IsObsolete&nbsp;<input id="xtIsObsolete" type="checkbox"class="gj-display-inline-block"/><button id="tbtnSearch" type="button" class="gj-button-md" style="color:#e45200;">Search</button><button id="tbtnClear" type="button" class="gj-button-md">Clear</button></form><table/></div>'

    });
    grid.on('detailExpand', function (e, $detailWrapper, id) {
        var subgrid = $detailWrapper.find('table').grid({
            params: { Id: id },
            uiLibrary: 'bootstrap',
            primaryKey: 'TestCaseId',
            //inlineEditing: { mode: 'command' },
            dataSource: '/Validation/jqueryGettestcases',
            columns: [
            { field: 'TestCaseId', sortable: true, title: 'Id', width: 80 },
             { field: 'PipelineStageId', sortable: true, width: 80 },
            { field: 'TestCaseTypeId', sortable: true, width: 80 },
            { field: 'Description', sortable: true, width: 200 },
            { field: 'TestSuiteId', hidden: 'true', width: 80 },
            { field: 'TestCaseName', sortable: true, width: 220 },
             { field: 'IsActive', sortable: true, width: 80 },
            { field: 'IsObsolete', sortable: true, width: 95 },
            { field: 'ObsoleteReason', width: 200 },
            { width: 64, tmpl: '<span class="material-icons gj-cursor-pointer">edit</span>', align: 'center', events: { 'click': Popuptest } }
            ],
            pager: { limit: 5 }


        });
        subgrid.on('rowDataChanged', function (e, id, record) {
            alert(JSON.stringify(record)),
            $.ajax({ url: '/Validation/kendoUpdateGettestcases', data: record, method: 'POST' })
                .done(function () {
                    grid.reload();
                })
                .fail(function () {
                    alert('Failed to save.');
                });
        });
        $('#tbtnSearch').on('click', function () {      
            subgrid.reload({ page: 1, TestCaseName: $('#txtTestcase').val(), IsActive: $('#xtIsactive').prop('checked'), IsObsolete: $('#xtIsObsolete').prop('checked') });
        });
        $('#tbtnClear').on('click', function () {
            $('#txtTestcase').val('');
            $('#xtIsactive').prop('checked', false);
            $('#xtIsObsolete').prop('checked', false);
            subgrid.reload({ page: 1, TestCaseName: '', IsActive: '',IsObsolete:''});
        });
    });
    grid.on('detailCollapse', function (e, $detailWrapper, id) {
        $detailWrapper.find('table').grid('destroy', true, true);
    });

    grid.on('rowDataChanged', function (e, id, record) {
        //alert(JSON.stringify(record)),
        $.ajax({ url: '/Validation/UpdateTestSuite', data: record, method: 'POST' })
            .done(function () {
                grid.reload();
            })
            .fail(function () {
                alert('Failed to save.');
            });
    });
    grid.on('rowRemoving', function (e, $row, id, record) {
        //alert(JSON.stringify(id));
        if (confirm('Are you sure?')) {
            $.ajax({ url: '/Validation/DeleteTestSuite', data: record, method: 'POST' })
                .done(function () {
                    grid.reload();
                })
                .fail(function () {
                    alert('Failed to delete.');
                });
        }
    });
       
    dialog = $('#dialog').dialog({
        uiLibrary: 'bootstrap4',
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 360
    });
    dialogtest = $('#dialogTestCase').dialog({
        uiLibrary: 'bootstrap',
        autoOpen: false,
        resizable: false,
        modal: true,
        width: 360
    });
    dialogsched = $('#dialogschedular').dialog({
        uiLibrary: 'bootstrap',
        autoOpen: false,
        resizable: true,
        modal: false,
        height: 500,
        width: 650
    });
    $('#btnAdd').on('click', function () {
        $('#TestSuiteId').val(0);
        $('#TestSuite1').val('');
        $('#TestSuiteDescription').val('');
        $('#IsActive').val(false);
        $('#TestSuiteOwner').val('');
        $('#CreatedDate').val('');
        $('#CreatedBy').val('');
        $('#btnUpdate').hide();
        $('#btnDelete').hide();
        $('#btnSave').show();
        dialog.open('Create TestSuite');
    });
    $('#btnSave').on('click', Save);
    $('#btnUpdate').on('click', Save);
    $('#btnDelete').on('click', Delete);
    $('#btnCancel').on('click', function () {
        dialog.close();
    });
    $('#tbtnSave').on('click', Savetestcase);
    $('#tbtnUpdate').on('click', Savetestcase);
    $('#tbtnDelete').on('click', DeleteTestcase);
    $('#tbtnCancel').on('click', function () {
        dialogtest.close();
    });
                
    $('#btnSchedular').on('click', function () {
        dialogsched.open("Event");
    });
    $('#btnSearch').on('click', function () {
        grid.reload({ page: 1, TestSuite1: $('#txtTestsuite').val(), IsActive: $('#txtIsactive').prop('checked') });
    });
    $('#btnClear').on('click', function () {
        $('#txtTestsuite').val('');
        $('#txtIsactive').prop('checked', false);
        grid.reload({ page: 1, TestSuite1: '',IsActive:''});
    });
              

});

$(function () {

            $("#scheduler").kendoScheduler({
                date: new Date(),
                height: 400,
                width:600,
                views: [
               "day",
               { type: "week", selected: true },
               "month"
                ],
                dataSource: {
                    batch: true,
                    Type: "json",
                    transport: {
                        read: {

                            url: "@Url.Action("GetCalendarEvents", "Validation")",
                            dataType: "json"
                        },
                        update: {
                            url: "@Url.Action("UpdateCalendarEvent", "Validation")",
                            dataType: "json",
                            contentType: "application/json",
                            type: "POST"
                        },
                        create: {
                            url: "@Url.Action("SaveCalendarEvent", "Validation")",
                            contentType: "application/json",
                            dataType: "json"
                        },
                        destroy: {
                            url: "@Url.Action("DeleteCalendarEvent", "Validation")",
                            dataType: "json"
                        },
                            parameterMap: function (options, operation) {
                                if (operation !== "read" && options.models) {
                                    return { models: kendo.stringify(options.models) };
                                }
                            }

                    },

                    schema: {
                        model: {
                            id: "taskId",
                            fields: {
                                taskId: { from: "TaskID", type: "number" },
                                title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                                start: { type: "date", from: "Start" },
                                end: { type: "date", from: "End" },
                                startTimezone: { from: "StartTimezone" },
                                endTimezone: { from: "EndTimezone" },
                                description: { from: "Description" },
                                recurrenceId: { from: "RecurrenceID" },
                                recurrenceRule: { from: "RecurrenceRule" },
                                recurrenceException: { from: "RecurrenceException" },
                                isAllDay: { type: "boolean", from: "IsAllDay" }
                            }
                        }
                    },
                }
            });
});
