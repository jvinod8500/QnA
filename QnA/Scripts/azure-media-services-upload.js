var maxRetries = 3;
var blockLength = 1048576; //1048576
var numberOfBlocks = 1;
var currentChunk = 1;
var retryAfterSeconds = 3;
var nameofthefile = "";
$(document).ready(function () {
    debugger
    var indexstarttime, indexendtime, encodingstarttime, encodingendtime, filedetails, noticationmsg, grid;
    $(document).on("click", "#fileUpload", beginUpload);
    $("#progressBar").progressbar(0);
    $(document).on("onchange", "#fileUpload", function () { $("#extractedtextarea").hide(); });
    
});

$(document).keypress(function (e) {
    if (e.which == 13) {
        $("#btnSearch").click();
        event.preventDefault();
    }
});
var beginUpload = function () {
    debugger
 
    var fileControl = document.getElementById("selectFile");
    if (fileControl.files.length > 0) {
        debugger
        for (var i = 0; i < fileControl.files.length; i++) {
            uploadMetaData(fileControl.files[i], i);
        }
    }
    filedetails = fileControl.files[0];
}

var uploadMetaData = function (file, index) {
    debugger
    var size = file.size;
    nameofthefile = file.name;
    numberOfBlocks = Math.ceil(file.size / blockLength);
    var name = file.name;
    currentChunk = 1;
    var record = {
        BlockCount: numberOfBlocks,
        Duration: (file.duration / 60).toFixed(2),
        OriginalName: encodeURIComponent(name),
        Size: size,
        StorageAccount: $("#selectaccount").val()
    }
    $.ajax({
        type: "POST",
        async: false,
        url: "/Blob/SetMetadata",
        data: record
    }).done(function (state) {
        debugger
        if (state === true) {
            $("#fileUpload").hide();
            displayStatusMessage("On your mark, get set, go....");
            sendFile(file, blockLength);
        }
    }).fail(function () {
        $("#fileUpload").show()
        displayStatusMessage("Failed to send MetaData");
    });
}

var sendFile = function (file, chunkSize) {
debugger
    var start = 0, end = Math.min(chunkSize, file.size), retryCount = 0, sendNextChunk, fileChunk;

    sendNextChunk = function () {
        fileChunk = new FormData();

        if (file.slice) {
            fileChunk.append('Slice', file.slice(start, end));
        }
        else if (file.webkitSlice) {
            fileChunk.append('Slice', file.webkitSlice(start, end));
        }
        else if (file.mozSlice) {
            fileChunk.append('Slice', file.mozSlice(start, end));
        }
        else {
            displayStatusMessage(operationType.UNSUPPORTED_BROWSER);
            return;
        }
        jqxhr = $.ajax({
            async: true,
            url: ('/Blob/UploadChunk?id=' + currentChunk),
            data: fileChunk,
            cache: false,
            contentType: false,
            processData: false,
            type: 'POST'
        }).fail(function (request, error) {
            if (error !== 'abort' && retryCount < maxRetries) {
                ++retryCount;
                setTimeout(sendNextChunk, retryAfterSeconds * 1000);
            }

            if (error === 'abort') {
                displayStatusMessage("Aborted");
            }
            else {
                if (retryCount === maxRetries) {
                    displayStatusMessage("Upload timed out.");
                    resetControls();
                    uploader = null;
                }
                else {
                    displayStatusMessage("Resuming Upload.");
                }
            }

            return;
        }).done(function (notice) {
            if (notice.error || notice.isLastBlock) {
                debugger
                displayStatusMessage(notice.message);
                $("#fileUpload").show();
                return;
            }
            ++currentChunk;
            start = (currentChunk - 1) * blockLength;
            end = Math.min(currentChunk * blockLength, file.size);
            retryCount = 0;
            updateProgress();
            if (currentChunk <= numberOfBlocks) {
                sendNextChunk();
            }
        });
    }
    sendNextChunk();
}

var displayStatusMessage = function (message) {
    $("#statusMessage").text(message);
    console.log(message);
}

var updateProgress = function () {
    
    var progress = currentChunk / numberOfBlocks * 100;
    if (progress < 100) {
        $("#progressBar").progressbar("option", "value", parseInt(progress));
        displayStatusMessage("Please wait, uploaded " + parseInt(progress) + "%");
    }
    else if (progress == 100) {
        $("#progressBar").progressbar("option", "value", parseInt(progress));
        displayStatusMessage("Uploaded successfully in blob, Please wait..");
    }
}

