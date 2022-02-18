using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BlobApp.Models
{
    public class Sticky
    {
        public int StickyId { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public bool Lock { get; set; }
        public string Owner { get; set; }
    }
}