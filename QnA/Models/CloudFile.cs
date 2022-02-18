﻿using Microsoft.WindowsAzure.Storage.Blob;
using System;

namespace BlobApp.Models
{
    public class CloudFile
    {
        public string FileName { get; set; }
        public string OriginalName { get; set; }
        public string URL { get; set; }
        public long Size { get; set; }
        public long BlockCount { get; set; }
        public CloudBlockBlob BlockBlob { get; set; }
        public DateTime StartTime { get; set; }
        public string UploadStatusMessage { get; set; }
        public bool IsUploadCompleted { get; set; }
        public string AssetId { get; set; }
        public double Duration { get; set; }
        public string StorageAccount { get; set; }
        public static CloudFile CreateFromIListBlobItem(IListBlobItem item)
        {
            if (item is CloudBlockBlob)
            {
                var blob = (CloudBlockBlob)item;
                return new CloudFile
                {
                    FileName = blob.Name,
                    URL = blob.Uri.ToString(),
                    Size = blob.Properties.Length
                };
            }
            return null;
        }
    }
}